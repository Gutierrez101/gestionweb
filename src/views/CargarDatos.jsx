import { useState, useEffect } from 'react';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051/api';
const API_URL = 'http://localhost:5051/api';

export default function CargarDatos() {
  const [archivo, setArchivo] = useState(null);
  const [custodios, setCustodios] = useState([]);
  
  // ADAPTADO AL NUEVO ESQUEMA:
  const [bienManual, setBienManual] = useState({
    codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '', usuarioIdPropietario: ''
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
        body: JSON.stringify(bienManual)
      });

      if (res.ok) {
        alert(`Bien ${bienManual.codigoBien} registrado individualmente con éxito.`);
        setBienManual({ codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '', usuarioIdPropietario: '' });
      } else {
        alert('Error al registrar. Verifica que el código del bien no exista en la base de datos.');
      }
    } catch (e) {
      console.error(e); alert('Error de conexión con la red.');
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
        alert('Error al procesar el archivo Excel. Verifica el formato de columnas en el servidor.');
      }
    } catch (e) { console.error(e); alert('Error de red.'); }
  };

  return (
    <div className="view-card">
      <div className="hero-panel"><div className="hero-copy"><h2>Ingreso de Bienes</h2><p>Carga individual o importación masiva por red.</p></div></div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '25px' }}>
        
        <div className="form-card" style={{ padding: '25px', background: '#fff', borderRadius: '15px', border: '1px solid #e1ebe5', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--espe-green)' }}>Carga Individual</h3>
          <form onSubmit={handleManualSubmit}>
            <div className="form-group"><label>Código del Bien *</label><input type="text" value={bienManual.codigoBien} onChange={e => setBienManual({...bienManual, codigoBien: e.target.value})} required /></div>
            <div className="form-group"><label>Nombre del Bien *</label><input type="text" value={bienManual.nombreBien} onChange={e => setBienManual({...bienManual, nombreBien: e.target.value})} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group"><label>Serie</label><input type="text" value={bienManual.serie} onChange={e => setBienManual({...bienManual, serie: e.target.value})} required /></div>
              <div className="form-group"><label>Modelo</label><input type="text" value={bienManual.modelo} onChange={e => setBienManual({...bienManual, modelo: e.target.value})} required /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group"><label>Marca / Raza</label><input type="text" value={bienManual.marcaRazaOtros} onChange={e => setBienManual({...bienManual, marcaRazaOtros: e.target.value})} required /></div>
              <div className="form-group"><label>Ubicación</label><input type="text" value={bienManual.ubicacion} onChange={e => setBienManual({...bienManual, ubicacion: e.target.value})} required /></div>
            </div>
            
            <div className="form-group">
              <label>Custodio (Responsable) *</label>
              <select 
                value={bienManual.usuarioIdPropietario} 
                onChange={e => setBienManual({...bienManual, usuarioIdPropietario: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', color: 'var(--text-dark)'}}
                required
              >
                <option value="">-- Seleccione un usuario de la BD --</option>
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
          <p style={{ color: '#5f6f68', fontSize: '0.9rem' }}>El archivo <strong>.xlsx</strong> debe contener las nuevas columnas: <code>codigoBien</code>, <code>nombreBien</code>, <code>serie</code>, <code>modelo</code>, <code>marcaRazaOtros</code>, <code>ubicacion</code>.</p>
          
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