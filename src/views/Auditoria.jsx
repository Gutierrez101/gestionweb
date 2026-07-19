import { useState, useEffect } from 'react';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051/api';
const API_URL = 'http://localhost:5051/api';

export default function Auditoria() {
  const [revisiones, setRevisiones] = useState([]);
  const [revisionActiva, setRevisionActiva] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState('');

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => { cargarRevisiones(); }, []);

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
        alert('Nueva auditoría física iniciada en el servidor.');
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
        // CAMBIO CRÍTICO DE LA API OPENAPI: Enviamos codigoBien en lugar de codigoBarras
        body: JSON.stringify({ codigoBien: codigoIngresado })
      });

      if (res.ok) {
        alert('✅ Código verificado y marcado en la revisión.');
        setCodigoIngresado(''); 
      } else if (res.status === 409) {
        alert('⚠️ Conflicto: Este bien ya fue escaneado en la sesión actual.');
      } else if (res.status === 404) {
        alert('❌ Error: El código del bien no existe en el catálogo.');
      }
    } catch (e) { console.error(e); }
  };

  const finalizarRevision = async () => {
    if(!confirm('¿Seguro que deseas finalizar esta revisión? Se calcularán los faltantes.')) return;
    
    try {
      const res = await fetch(`${API_URL}/revisiones/${revisionActiva.id}/finalizar`, { method: 'POST', headers });
      if (res.ok) {
        const resultado = await res.json();
        alert(`🔒 Revisión finalizada exitosamente.\nElementos faltantes detectados: ${resultado.elementosFaltantes}`);
        setRevisionActiva(null);
        cargarRevisiones();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="view-card">
      <div className="hero-panel hero-panel-secondary">
        <div className="hero-copy">
          <span className="eyebrow">Control Patrimonial</span>
          <h2>Auditoría de Inventario</h2>
          <p>Módulo de escaneo y verificación física conectado en tiempo real al servidor central.</p>
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
            {revisiones.length === 0 ? <p className="empty-state">No hay revisiones registradas en la red.</p> : null}
            {revisiones.map(rev => (
              <li 
                key={rev.id} 
                style={{ padding: '15px', border: '1px solid #cdd6d2', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', background: rev.estado === 'EnCurso' ? '#f1faf3' : '#fff' }}
                onClick={() => setRevisionActiva(rev)}
              >
                <strong>Sesión UUID:</strong> {rev.id.substring(0,8)}... <br/>
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
                <p>Ingresa o escanea el <strong>Código del Bien</strong> para confirmar su presencia física en el laboratorio.</p>
                <form onSubmit={procesarEscaneoManual} style={{ marginTop: '20px' }}>
                  <div className="form-group">
                    <label>Código del Bien</label>
                    <input 
                      type="text" 
                      value={codigoIngresado} 
                      onChange={(e) => setCodigoIngresado(e.target.value)} 
                      placeholder="Ej: SIL-001" 
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    Registrar Hallazgo
                  </button>
                </form>

                <hr style={{ margin: '30px 0', borderTop: '1px solid #cdd6d2' }}/>
                
                <button onClick={finalizarRevision} className="btn-primary" style={{ width: '100%', backgroundColor: 'var(--espe-red)' }}>
                  Clausurar Auditoría
                </button>
              </>
            ) : (
              <div className="empty-state" style={{ textAlign: 'center' }}>
                <strong style={{ color: 'var(--espe-green-dark)' }}>Esta sesión ya fue clausurada.</strong>
                <p>Finalizó el: {new Date(revisionActiva.fechaFin).toLocaleString()}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Selecciona una revisión del panel izquierdo para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
}