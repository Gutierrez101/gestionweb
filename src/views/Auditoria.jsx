import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5051/api';

export default function Auditoria() {
  const [revisiones, setRevisiones] = useState([]);
  const [revisionActiva, setRevisionActiva] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState('');

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  //Lista de revisiones
  useEffect(() => {
    cargarRevisiones();
  }, []);

  const cargarRevisiones = async () => {
    try {
      const res = await fetch(`${API_URL}/revisiones`, { headers });
      if (res.ok) setRevisiones(await res.json());
    } catch (e) { console.error(e); }
  };

  const iniciarNuevaRevision = async () => {
    try {
      const res = await fetch(`${API_URL}/revisiones`, { method: 'POST', headers });
      if (res.ok) {
        alert('Nueva auditoría iniciada');
        cargarRevisiones();
      }
    } catch (e) { console.error(e); }
  };

  const procesarEscaneoManual = async (e) => {
    e.preventDefault();
    if (!codigoIngresado || !revisionActiva) return;

    try {
      const res = await fetch(`${API_URL}/revisiones/${revisionActiva.id}/escanear`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ codigoBarras: codigoIngresado })
      });

      if (res.ok) {
        alert('Código verificado correctamente.');
        setCodigoIngresado('');
      } else if (res.status === 409) {
        alert('Conflicto: Este código ya fue escaneado en esta revisión.');
      } else if (res.status === 404) {
        alert('Error: Bien no encontrado en el sistema.');
      }
    } catch (e) { console.error(e); }
  };

  const finalizarRevision = async () => {
    if(!confirm('¿Seguro que deseas finalizar esta revisión? Se calcularán los faltantes.')) return;
    
    try {
      const res = await fetch(`${API_URL}/revisiones/${revisionActiva.id}/finalizar`, { method: 'POST', headers });
      if (res.ok) {
        const resultado = await res.json();
        alert(`Revisión finalizada. Elementos faltantes: ${resultado.elementosFaltantes}`);
        setRevisionActiva(null);
        cargarRevisiones();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="view-card">
      <div className="hero-panel hero-panel-secondary">
        <div className="hero-copy">
          <span className="eyebrow">Control y Seguridad</span>
          <h2>Auditoría de Inventario</h2>
          <p>Inicia sesiones de revisión física, registra los códigos de los bienes encontrados y finaliza para obtener reportes de faltantes.</p>
        </div>
      </div>

      <div className="control-panel">
        <button className="btn-primary" onClick={iniciarNuevaRevision}>
          + Iniciar Nueva Auditoría
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="table-shell" style={{ padding: '20px' }}>
          <h3>Historial de Revisiones</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {revisiones.length === 0 ? <p className="empty-state">No hay revisiones registradas.</p> : null}
            {revisiones.map(rev => (
              <li 
                key={rev.id} 
                style={{ padding: '15px', border: '1px solid #cdd6d2', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', background: rev.estado === 'EnCurso' ? '#f1faf3' : '#fff' }}
                onClick={() => setRevisionActiva(rev)}
              >
                <strong>ID:</strong> {rev.id.substring(0,8)}... <br/>
                <strong>Estado:</strong> <span className="pill">{rev.estado}</span> <br/>
                <small>Inicio: {new Date(rev.fechaInicio).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </div>

        {revisionActiva ? (
          <div className="form-card" style={{ border: '2px solid var(--espe-green)', borderRadius: '15px', padding: '25px', background: '#f8fbf9' }}>
            <h3 style={{ color: 'var(--espe-green)' }}>Auditoría Activa: {revisionActiva.id.substring(0,8)}</h3>
            
            {revisionActiva.estado === 'EnCurso' ? (
              <>
                <p>Escribe el código de barras del bien para registrar su presencia física.</p>
                <form onSubmit={procesarEscaneoManual} style={{ marginTop: '20px' }}>
                  <div className="form-group">
                    <label>Ingresar Código de Barras</label>
                    <input 
                      type="text" 
                      value={codigoIngresado} 
                      onChange={(e) => setCodigoIngresado(e.target.value)} 
                      placeholder="Ej: SIL-001" 
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    Registrar Código
                  </button>
                </form>

                <hr style={{ margin: '30px 0', borderTop: '1px solid #cdd6d2' }}/>
                
                <button onClick={finalizarRevision} className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--espe-red)' }}>
                  Clausurar Auditoría
                </button>
              </>
            ) : (
              <div className="empty-state" style={{ textAlign: 'center' }}>
                <strong style={{ color: 'var(--espe-green-dark)' }}>Esta sesión ya está finalizada.</strong>
                <p>Finalizó el: {new Date(revisionActiva.fechaFin).toLocaleString()}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Selecciona una revisión del panel izquierdo para escanear bienes.</p>
          </div>
        )}
      </div>
    </div>
  );
}