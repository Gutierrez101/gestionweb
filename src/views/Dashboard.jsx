import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051/api';

function VistaAdmin({ stats, bienes, custodios, cargando }) {
  const obtenerNombreCustodio = (uuid) => {
    const usuario = custodios.find(c => c.id === uuid);
    return usuario ? `${usuario.nombre} (${usuario.cedula})` : 'Sin Asignar';
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

function VistaDocente({ stats, misBienes, cargando }) {
  return (
    <div className="view-card">
      <div className="hero-panel hero-panel-secondary">
        <div className="hero-copy">
          <span className="eyebrow">Panel de Custodio / Docente</span>
          <h2>Mi Inventario Asignado</h2>
          <p>Control y visualización de los equipos institucionales bajo tu responsabilidad física.</p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: 'var(--espe-green-dark)', marginBottom: '20px' }}>Resumen de mi cuenta</h3>
        {cargando ? <p style={{ color: '#5f6f68' }}>Sincronizando con el servidor...</p> : (
          <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="summary-box" style={{ background: '#f8fbf9', border: '1px solid #cdd6d2' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>📦</span>
              <strong>{stats.misBienesCount}</strong>
              <span>Equipos Bajo Mi Custodia</span>
            </div>
            <div className="summary-box" style={{ borderLeft: stats.auditoriasActivas > 0 ? '4px solid var(--espe-gold)' : '1px solid #dceadf' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🚨</span>
              <strong>{stats.auditoriasActivas}</strong>
              <span>Auditorías Institucionales Activas</span>
            </div>
          </div>
        )}
      </div>

      <div className="table-shell" style={{ marginTop: '35px' }}>
        <div className="table-header">
          <div>
            <h3>Equipos a mi Cargo ({misBienes.length})</h3>
            <p>Si notas algún daño o discrepancia, repórtalo de inmediato al administrador de laboratorio.</p>
          </div>
        </div>

        {cargando ? <p style={{ padding: '20px' }}>Cargando mis equipos...</p> : misBienes.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
            <strong style={{ color: 'var(--text-dark)', fontSize: '1.1rem' }}>No tienes equipos asignados actualmente.</strong>
            <p style={{ color: '#5f6f68', margin: '8px 0 0 0' }}>El administrador del laboratorio aún no ha registrado bienes bajo tu usuario.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="bienes-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre del bien</th>
                  <th>Serie</th>
                  <th>Modelo</th>
                  <th>Marca / Otros</th>
                  <th>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {misBienes.map(bien => (
                  <tr key={bien.id}>
                    <td><strong>{bien.codigoBien}</strong></td>
                    <td>{bien.nombreBien}</td>
                    <td>{bien.serie}</td>
                    <td>{bien.modelo}</td>
                    <td>{bien.marcaRazaOtros}</td>
                    <td><span className="pill">{bien.ubicacion}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recordatorio exclusivo para docentes */}
      <div className="form-card" style={{ marginTop: '30px', padding: '20px', background: '#f8fbf9', borderRadius: '12px', border: '1px solid #e1ebe5' }}>
        <h4 style={{ margin: '0 0 8px 0', color: 'var(--espe-green)' }}>ℹ️ Recordatorio de Responsabilidad Patrimonial</h4>
        <p style={{ margin: 0, color: '#5f6f68', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Como custodio, eres estrictamente responsable del cuidado y permanencia de los bienes listados en esta tabla. Prohibido realizar traslados o préstamos entre laboratorios sin el descargo formal en el sistema.
        </p>
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
  const esAdmin = emailSesion.toLowerCase().includes('admin');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        // Peticiones simultáneas a la API
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

        // Identificar el ID único de la sesión logueada
        const miPerfil = listaUsuarios.find(u => u.email?.toLowerCase() === emailSesion.toLowerCase());
        const miId = miPerfil ? miPerfil.id : null;
        
        // Filtrar los bienes si es docente
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

  if (esAdmin) {
    return <VistaAdmin stats={stats} bienes={bienes} custodios={custodios} cargando={cargando} />;
  } else {
    // Para el docente solo enviamos la lista filtrada de sus propios equipos
    const misBienesAsignados = custodios.length > 0
      ? bienes.filter(b => {
          const miPerfil = custodios.find(u => u.email?.toLowerCase() === emailSesion.toLowerCase());
          return miPerfil && b.usuarioIdPropietario === miPerfil.id;
        })
      : [];

    return <VistaDocente stats={stats} misBienes={misBienesAsignados} cargando={cargando} />;
  }
}