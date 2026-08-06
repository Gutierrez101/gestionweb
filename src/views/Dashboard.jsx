import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//const API_URL = 'http://localhost:5051/api';
const API_URL = 'http://192.168.0.100:80/api';

// ==========================================
// 1. VISTA ADMINISTRADOR
// ==========================================
function VistaAdmin({ stats, bienes, custodios, cargando }) {
  const obtenerNombreCustodio = (uuid) => {
    const usuario = custodios.find(c => c.id === uuid);
    return usuario ? `${usuario.nombre} (${usuario.email})` : 'Sin Asignar';
  };

  return (
    <div className="view-card">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Panel de Control Global</span>
          <h2>Administración General de Inventario</h2>
          <p>Supervisión en tiempo real del catálogo patrimonial y custodios de la institución.</p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: 'var(--espe-green-dark)', marginBottom: '20px' }}>Métricas Generales del Sistema</h3>
        {cargando ? <p style={{ color: '#5f6f68' }}>Sincronizando con la base de datos...</p> : (
          <div className="summary-grid">
            <div className="summary-box">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>📦</span>
              <strong>{stats.totalBienes}</strong>
              <span>Total Bienes en BD</span>
            </div>
            <div className="summary-box">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>👥</span>
              <strong>{stats.totalUsuarios}</strong>
              <span>Custodios Registrados</span>
            </div>
            <div className="summary-box" style={{ borderLeft: stats.auditoriasActivas > 0 ? '4px solid var(--espe-gold)' : '1px solid #dceadf' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🔍</span>
              <strong>{stats.auditoriasActivas}</strong>
              <span>Auditorías en Curso</span>
            </div>
          </div>
        )}
      </div>

      <div className="table-shell" style={{ marginTop: '35px' }}>
        <div className="table-header">
          <div>
            <h3>Catálogo General Completo ({bienes.length})</h3>
            <p>Listado total de bienes patrimoniales en el servidor de red.</p>
          </div>
        </div>
        
        {cargando ? <p style={{ padding: '20px' }}>Cargando inventario de la red...</p> : bienes.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px', textAlign: 'center' }}>
            <strong>No existen bienes en el sistema.</strong>
            <p style={{ color: '#5f6f68', margin: '5px 0 0 0' }}>Utilice el módulo de Carga de Datos para ingresar registros.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="bienes-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Código</th>
                  <th>Nombre del bien</th>
                  <th>Serie / Modelo</th>
                  <th>Ubicación</th>
                  <th>Custodio Asignado</th>
                </tr>
              </thead>
              <tbody>
                {bienes.map(bien => (
                  <tr key={bien.id}>
                    {/* CELDA DE IMAGEN CORREGIDA */}
                    <td style={{ padding: '10px' }}>
                      {bien.rutaImagen ? (
                        <img 
                          src={`${API_URL}/imagenes/${bien.rutaImagen}`} 
                          alt="Bien" 
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cdd6d2' }} 
                        />
                      ) : (
                        <div style={{ width: '45px', height: '45px', background: '#f1f3f4', borderRadius: '6px', display: 'grid', placeItems: 'center', fontSize: '0.65rem', color: '#888' }}>
                          Sin Foto
                        </div>
                      )}
                    </td>
                    <td><strong>{bien.codigoBien}</strong></td>
                    <td>{bien.nombreBien}</td>
                    <td>{bien.serie} / {bien.modelo}</td>
                    <td><span className="pill">{bien.ubicacion}</span></td>
                    <td style={{ color: 'var(--espe-green-dark)', fontWeight: '500' }}>
                      {obtenerNombreCustodio(bien.usuarioIdPropietario)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [bienes, setBienes] = useState([]);
  const [custodios, setCustodios] = useState([]);
  const [stats, setStats] = useState({ totalBienes: 0, misBienesCount: 0, totalUsuarios: 0, auditoriasActivas: 0 });
  const [cargando, setCargando] = useState(true);
  
  const navigate = useNavigate();
  const emailSesion = localStorage.getItem('email') || '';

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        const [resElementos, resUsuarios, resRevisiones] = await Promise.all([
          fetch(`${API_URL}/elementos`, { headers }),
          fetch(`${API_URL}/usuarios`, { headers }),
          fetch(`${API_URL}/revisiones`, { headers })
        ]);

        let listaElementos = [];
        let listaUsuarios = [];
        let audActivas = 0;

        if (resElementos.ok) listaElementos = await resElementos.json();
        if (resUsuarios.ok) listaUsuarios = await resUsuarios.json();
        if (resRevisiones.ok) {
          const revisiones = await resRevisiones.json();
          audActivas = revisiones.filter(rev => rev.estado === 'EnCurso').length;
        }

        const miPerfil = listaUsuarios.find(u => u.email?.toLowerCase() === emailSesion.toLowerCase());
        const miId = miPerfil ? miPerfil.id : null;
        
        const misBienes = miId ? listaElementos.filter(b => b.usuarioIdPropietario === miId) : [];

        setBienes(listaElementos);
        setCustodios(listaUsuarios);
        setStats({
          totalBienes: listaElementos.length,
          misBienesCount: misBienes.length,
          totalUsuarios: listaUsuarios.length,
          auditoriasActivas: audActivas
        });

      } catch (error) {
        console.error("Error al cargar el servidor:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [navigate, emailSesion]);

  return <VistaAdmin stats={stats} bienes={bienes} custodios={custodios} cargando={cargando} />;
}