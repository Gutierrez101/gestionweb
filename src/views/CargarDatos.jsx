import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5051/api';

export default function CargarDatos() {
  const [archivo, setArchivo] = useState(null);
  const [custodios, setCustodios] = useState([]);
  const [bienManual, setBienManual] = useState({
    codigoBarras: '', nombre: '', descripcion: '', categoria: '', precio: '', usuarioIdPropietario: ''
  });

  const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };


  useEffect(() => {
    const fetchCustodios = async () => {
      try {
        const res = await fetch(`${API_URL}/usuarios`, { headers: { ...headers, 'Content-Type': 'application/json' } });
        if (res.ok) setCustodios(await res.json());
      } catch (e) { console.error("Error al cargar custodios", e); }
    };
    fetchCustodios();
  }, []);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!bienManual.usuarioIdPropietario) return alert("Por favor selecciona un custodio.");

    try {
      const res = await fetch(`${API_URL}/elementos`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bienManual, precio: parseFloat(bienManual.precio) || 0 })
      });

      if (res.ok) {
        alert(`Bien ${bienManual.codigoBarras} registrado individualmente con éxito.`);
        setBienManual({ codigoBarras: '', nombre: '', descripcion: '', categoria: '', precio: '', usuarioIdPropietario: '' });
      } else {
        alert('Error al registrar el bien. Verifica que el código no esté duplicado.');
      }
    } catch (e) {
      console.error(e); alert('Error de conexión con la API.');
    }
  };

  const handleUploadMasivo = async () => {
    if (!archivo) return alert("Selecciona un archivo Excel (.xlsx) primero.");

    const formData = new FormData();
    formData.append('file', archivo); 

    try {
      const res = await fetch(`${API_URL}/elementos/importar`, {
        method: 'POST',
        headers: headers, 
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Carga Masiva Exitosa:\n- ${data.procesados} registros procesados.\n- ${data.ignorados} ignorados o con error.`);
        setArchivo(null);
      } else {
        alert('Error al procesar el archivo Excel. Verifica el formato.');
      }
    } catch (e) { console.error(e); alert('Error de conexión.'); }
  };

  return (
    <div className="view-card">
      <div className="hero-panel"><div className="hero-copy"><h2>Ingreso de Bienes</h2><p>Registre bienes de forma individual o realice una importación masiva mediante Excel.</p></div></div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '25px' }}>
        
        <div className="form-card" style={{ padding: '25px', background: '#fff', borderRadius: '15px', border: '1px solid #e1ebe5', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--espe-green)' }}>Carga Individual</h3>
          <form onSubmit={handleManualSubmit}>
            <div className="form-group"><label>Código de Barras</label><input type="text" value={bienManual.codigoBarras} onChange={e => setBienManual({...bienManual, codigoBarras: e.target.value})} required /></div>
            <div className="form-group"><label>Nombre del Bien</label><input type="text" value={bienManual.nombre} onChange={e => setBienManual({...bienManual, nombre: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group"><label>Categoría</label><input type="text" value={bienManual.categoria} onChange={e => setBienManual({...bienManual, categoria: e.target.value})} required /></div>
              <div className="form-group"><label>Precio ($)</label><input type="number" value={bienManual.precio} onChange={e => setBienManual({...bienManual, precio: e.target.value})} required /></div>
            </div>
            
            <div className="form-group">
              <label>Custodio (Responsable) *</label>
              <select 
                value={bienManual.usuarioIdPropietario} 
                onChange={e => setBienManual({...bienManual, usuarioIdPropietario: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', color: 'var(--text-dark)'}}
                required
              >
                <option value="">-- Seleccione un usuario --</option>
                {custodios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nombre} ({usuario.cedula})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Registrar Bien Individual</button>
          </form>
        </div>

        <div className="form-card" style={{ padding: '25px', background: '#f8fbf9', borderRadius: '15px', border: '1px solid #e1ebe5', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0, color: 'var(--espe-green)' }}>Carga Masiva (Excel)</h3>
          <p style={{ color: '#5f6f68', fontSize: '0.9rem' }}>El archivo <strong>.xlsx</strong> debe contener las columnas exactas requeridas por el sistema.</p>
          
          <div style={{ flex: 1, border: '2px dashed #b5c2bc', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', background: '#fff', margin: '20px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📄</div>
            <label htmlFor="excel-upload" className="btn-cancel" style={{ cursor: 'pointer', display: 'inline-block', textAlign: 'center' }}>
              {archivo ? archivo.name : 'Seleccionar archivo .xlsx'}
            </label>
            <input id="excel-upload" type="file" accept=".xlsx, .csv" onChange={(e) => setArchivo(e.target.files[0])} style={{ display: 'none' }} />
          </div>

          <button type="button" className="btn-primary" onClick={handleUploadMasivo} disabled={!archivo}>
            Subir e Importar Datos
          </button>
        </div>

      </div>
    </div>
  );
}