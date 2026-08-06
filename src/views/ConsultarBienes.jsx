import { useState, useEffect } from 'react';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051/api';
//const API_URL = 'http://localhost:5051/api';
const API_URL = 'http://192.168.0.100:80/api';

export default function ConsultarBienes() {
  const [busqueda, setBusqueda] = useState('');
  const [bienes, setBienes] = useState([]);
  const [custodios, setCustodios] = useState([]);
  const [cargando, setCargando] = useState(false);

  const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    // Cargamos tanto los bienes como los usuarios al entrar para poder mostrar el nombre del custodio
    const cargarInventario = async () => {
      setCargando(true);
      try {
        const [resBienes, resUsuarios] = await Promise.all([
          fetch(`${API_URL}/elementos`, { headers }),
          fetch(`${API_URL}/usuarios`, { headers })
        ]);
        if (resBienes.ok) setBienes(await resBienes.json());
        if (resUsuarios.ok) setCustodios(await resUsuarios.json());
      } catch (e) { console.error("Error conectando al servidor", e); }
      finally { setCargando(false); }
    };
    cargarInventario();
  }, []);

  // Filtramos localmente por el nuevo atributo codigoBien o por nombreBien
  const resultados = busqueda.trim() === '' ? [] : bienes.filter(b => 
    b.codigoBien?.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
    b.nombreBien?.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  const obtenerNombreCustodio = (uuid) => {
    const usuario = custodios.find(c => c.id === uuid);
    return usuario ? usuario.nombre : 'Sin Asignar';
  };

  const descargarExcelApi = async () => {
    try {
      const res = await fetch(`${API_URL}/elementos/exportar`, { headers });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Catálogo_Inventario_ESPE.xlsx';
        a.click();
      } else alert('Error al generar el archivo en el servidor de red.');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="view-card">
      <div className="hero-panel hero-panel-secondary">
        <div className="hero-copy">
          <span className="eyebrow">Consulta de Red</span>
          <h2>Consultar Bienes</h2>
          <p>Búsqueda en tiempo real sobre el catálogo de la universidad. Exportación directa desde la base de datos.</p>
        </div>
      </div>

      <div className="control-panel consult-control-panel">
        <div className="search-bar search-bar-compact">
          <label htmlFor="codigo-busqueda">Código o Nombre del bien</label>
          <input
            id="codigo-busqueda"
            type="text"
            value={busqueda}
            placeholder="Ej: SIL-001 o Escritorio..."
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="actions-row consult-actions-row">
          <button
            className="btn-primary"
            onClick={descargarExcelApi}
            style={{ background: 'var(--espe-gold)', color: '#333' }}
          >
            📥 Descargar Catálogo Excel
          </button>
        </div>
      </div>

      {cargando ? (
        <p className="empty-state">Sincronizando con el servidor en la red...</p>
      ) : busqueda.trim() === '' ? (
        <p className="empty-state">Ingresa un código o nombre para buscar en la base de datos.</p>
      ) : resultados.length === 0 ? (
        <p className="empty-state">No se encontraron bienes que coincidan con tu búsqueda.</p>
      ) : (
        <div className="table-shell">
          <div className="table-header">
            <div>
              <h3>Resultados encontrados ({resultados.length})</h3>
              <p>Datos patrimoniales extraídos de la base de datos.</p>
            </div>
          </div>
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
                  <th>Custodio</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((bien) => (
                  <tr key={bien.id}>
                    <td><strong>{bien.codigoBien}</strong></td>
                    <td>{bien.nombreBien}</td>
                    <td>{bien.serie}</td>
                    <td>{bien.modelo}</td>
                    <td>{bien.marcaRazaOtros}</td>
                    <td>{bien.ubicacion}</td>
                    <td>{obtenerNombreCustodio(bien.usuarioIdPropietario)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}