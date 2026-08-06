import { useState, useEffect } from 'react';

const API_URL = 'http://192.168.0.100:80/api';
const API_FALLBACK_URL = 'http://localhost:5051/api';

const fetchApi = async (endpoint, options = {}) => {
  try {
    return await fetch(`${API_URL}${endpoint}`, options);
  } catch (error) {
    if (error instanceof TypeError) {
      return await fetch(`${API_FALLBACK_URL}${endpoint}`, options);
    }
    throw error;
  }
};

export default function CargarDatos() {
  const [usuarios, setUsuarios] = useState([]);
  const [errorUsuarios, setErrorUsuarios] = useState('');
  const [form, setForm] = useState({
    codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '', usuarioIdPropietario: ''
  });
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [mensajeIndividual, setMensajeIndividual] = useState({ texto: '', tipo: '' });
  const [cargandoIndiv, setCargandoIndiv] = useState(false);

  const [archivoExcel, setArchivoExcel] = useState(null);
  const [mensajeMasivo, setMensajeMasivo] = useState({ texto: '', tipo: '' });
  const [cargandoMasivo, setCargandoMasivo] = useState(false);
  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetchApi('/usuarios', { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`${res.status} ${res.statusText}: ${errorText}`);
        }
        setUsuarios(await res.json());
      } catch (error) {
        console.error('Error al cargar usuarios', error);
        setErrorUsuarios('No se pudieron cargar los usuarios. Verifique su conexión y el servidor API.');
      }
    };
    fetchUsuarios();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleGuardarIndividual = async (e) => {
    e.preventDefault();
    if (!archivoImagen) {
      setMensajeIndividual({ texto: 'La foto del equipo es obligatoria.', tipo: 'error' });
      return;
    }

    setCargandoIndiv(true);
    setMensajeIndividual({ texto: '', tipo: '' });

    try {
      const token = localStorage.getItem('token');
      const headersAuth = { 'Authorization': `Bearer ${token}` };
      
      const formData = new FormData();
      formData.append('archivo', archivoImagen);
      const imgRes = await fetch(`${API_URL}/imagenes`, { method: 'POST', headers: headersAuth, body: formData });
      if (!imgRes.ok) throw new Error("Error al subir la imagen");
      
      const imgData = await imgRes.json();
      const rutaImagenId = imgData.id;

      const elementoPayload = { ...form, rutaImagen: rutaImagenId };
      const res = await fetch(`${API_URL}/elementos`, {
        method: 'POST',
        headers: { ...headersAuth, 'Content-Type': 'application/json' },
        body: JSON.stringify(elementoPayload)
      });

      if (!res.ok) throw new Error("Error al registrar el elemento");

      setMensajeIndividual({ texto: 'Bien ingresado y asignado con éxito.', tipo: 'success' });
      setForm({ codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '', usuarioIdPropietario: '' });
      setArchivoImagen(null);
      document.getElementById('fileImagenIndiv').value = '';

    } catch (error) {
      setMensajeIndividual({ texto: error.message, tipo: 'error' });
    } finally {
      setCargandoIndiv(false);
    }
  };

  const handleUploadMasivo = async (e) => {
    e.preventDefault();
    if (!archivoExcel) return;

    setCargandoMasivo(true);
    setMensajeMasivo({ texto: '', tipo: '' });
    setResultados(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('archivo', archivoExcel); 

      const res = await fetch(`${API_URL}/elementos/importar`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
      });

      if (!res.ok) throw new Error("Error de procesamiento del archivo.");
      
      const data = await res.json();
      setResultados(data);
      setMensajeMasivo({ texto: 'Validación e importación completadas.', tipo: 'success' });
      document.getElementById('excelInput').value = '';
      setArchivoExcel(null);
      
    } catch (error) {
      setMensajeMasivo({ texto: error.message, tipo: 'error' });
    } finally {
      setCargandoMasivo(false);
    }
  };

  return (
    <div className="view-card" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div className="hero-panel" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', background: 'linear-gradient(135deg, var(--espe-green-dark) 0%, var(--espe-green) 100%)', color: 'white' }}>
        <div className="hero-copy">
          <span className="eyebrow" style={{ color: '#dceadf', letterSpacing: '1px' }}>Ingreso de Datos al Servidor</span>
          <h2 style={{ margin: '5px 0' }}>Módulo de Alimentación de Inventario</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Cree registros individuales rápidos o sincronice su base de datos histórica.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        <div className="form-card" style={{ padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f3f4', paddingBottom: '15px', marginBottom: '25px' }}>
            <span style={{ fontSize: '1.5rem' }}>✍️</span>
            <div>
              <h3 style={{ margin: 0, color: 'var(--espe-green-dark)' }}>Registro Rápido</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#5f6f68' }}>Formulario para ingresos individuales con asignación</p>
            </div>
          </div>
          
          {mensajeIndividual.texto && (
            <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', background: mensajeIndividual.tipo === 'success' ? '#e6f4ea' : '#fce8e6', color: mensajeIndividual.tipo === 'success' ? '#137333' : '#c5221f', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500' }}>
               <span>{mensajeIndividual.tipo === 'success' ? '✅' : '⚠️'}</span> {mensajeIndividual.texto}
            </div>
          )}
          {errorUsuarios && (
            <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', background: '#fff4e5', color: '#9a3412', border: '1px solid #fcdcbf', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500' }}>
              <span>⚠️</span> {errorUsuarios}
            </div>
          )}

          <form onSubmit={handleGuardarIndividual} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <select name="usuarioIdPropietario" value={form.usuarioIdPropietario} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none', background: '#f8fbf9', fontWeight: 'bold' }}>
                <option value="">-- Seleccione el Custodio Asignado --</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
                ))}
              </select>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <input type="text" name="codigoBien" placeholder="Código del Bien *" value={form.codigoBien} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <input type="text" name="nombreBien" placeholder="Nombre del Bien *" value={form.nombreBien} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <input type="text" name="serie" placeholder="Serie" value={form.serie} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <input type="text" name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <input type="text" name="marcaRazaOtros" placeholder="Marca / Otros" value={form.marcaRazaOtros} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <input type="text" name="ubicacion" placeholder="Ubicación Física" value={form.ubicacion} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
            </div>
            
            <div style={{ gridColumn: '1 / -1', background: '#f8fbf9', padding: '12px', borderRadius: '8px', border: '1px dashed #cdd6d2', marginTop: '5px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#5f6f68', marginBottom: '8px' }}>Captura Fotográfica * (Obligatoria)</label>
              <input id="fileImagenIndiv" type="file" accept="image/*" onChange={(e) => setArchivoImagen(e.target.files[0])} required style={{ width: '100%', fontSize: '0.9rem', outline: 'none' }} />
            </div>

            <button type="submit" disabled={cargandoIndiv} style={{ gridColumn: '1 / -1', marginTop: '10px', padding: '14px', background: 'var(--espe-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {cargandoIndiv ? 'Guardando en BD...' : 'Crear Registro Único'}
            </button>
          </form>
        </div>

        {/* ... (El bloque COLUMNA 2 de Carga Masiva se mantiene exactamente igual que la respuesta anterior) ... */}
        {/* COLUMNA 2: Dropzone Carga Masiva */}
        <div className="form-card" style={{ padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #f1f3f4', paddingBottom: '15px', marginBottom: '25px' }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <div>
              <h3 style={{ margin: 0, color: 'var(--espe-green-dark)' }}>Sincronización Masiva</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#5f6f68' }}>Importación mediante archivo Excel (.xlsx)</p>
            </div>
          </div>
          
          {mensajeMasivo.texto && (
            <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', background: mensajeMasivo.tipo === 'success' ? '#e6f4ea' : '#fce8e6', color: mensajeMasivo.tipo === 'success' ? '#137333' : '#c5221f', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '500' }}>
               <span>{mensajeMasivo.tipo === 'success' ? '✅' : '⚠️'}</span> {mensajeMasivo.texto}
            </div>
          )}

          <form onSubmit={handleUploadMasivo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ border: '2px dashed #cdd6d2', padding: '40px 20px', textAlign: 'center', borderRadius: '12px', background: archivoExcel ? '#e6f4ea' : '#f8fbf9', transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative' }}>
              <input 
                id="excelInput" type="file" accept=".xlsx, .csv" onChange={(e) => setArchivoExcel(e.target.files[0])} required 
                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
              />
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px', opacity: archivoExcel ? 1 : 0.6 }}>{archivoExcel ? '📗' : '📁'}</span>
              <label style={{ fontWeight: 'bold', color: archivoExcel ? 'var(--espe-green-dark)' : '#5f6f68', display: 'block', fontSize: '1.1rem' }}>
                {archivoExcel ? archivoExcel.name : 'Arrastra o haz clic para seleccionar'}
              </label>
            </div>
            
            <div style={{ background: '#f1f3f4', padding: '15px', borderRadius: '8px', fontSize: '0.85rem', color: '#5f6f68', borderLeft: '4px solid #cdd6d2' }}>
              <strong style={{ color: '#333' }}>Estructura Requerida:</strong> Asegúrese de que el archivo cuente exactamente con estas cabeceras: 
              <br/><code>CodigoBien</code>, <code>NombreBien</code>, <code>Serie</code>, <code>Modelo</code>, <code>MarcaRazaOtros</code>, <code>Ubicacion</code>.
            </div>

            <button type="submit" disabled={!archivoExcel || cargandoMasivo} style={{ padding: '14px', background: archivoExcel ? 'var(--espe-green-dark)' : '#cdd6d2', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: archivoExcel ? 'pointer' : 'not-allowed', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {cargandoMasivo ? 'Leyendo filas y sincronizando...' : 'Ejecutar Importación'}
            </button>
          </form>

          {resultados && (
            <div style={{ marginTop: '25px', padding: '20px', background: '#fff', border: '1px solid #dceadf', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
              <h4 style={{ margin: '0 0 15px 0', color: 'var(--espe-green)', display: 'flex', alignItems: 'center', gap: '8px' }}><span>📊</span> Resumen del Proceso</h4>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, padding: '15px', background: '#e6f4ea', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#137333' }}>{resultados.procesados}</span>
                  <span style={{ fontSize: '0.85rem', color: '#137333' }}>Guardados</span>
                </div>
                <div style={{ flex: 1, padding: '15px', background: '#fce8e6', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#c5221f' }}>{resultados.ignorados}</span>
                  <span style={{ fontSize: '0.85rem', color: '#c5221f' }}>Omitidos</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}