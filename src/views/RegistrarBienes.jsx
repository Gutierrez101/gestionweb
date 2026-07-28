import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5051/api';

export default function RegistrarBienes() {
  const [bienes, setBienes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [cargandoGuardar, setCargandoGuardar] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  const [form, setForm] = useState({
    codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: ''
  });
  const [archivoImagen, setArchivoImagen] = useState(null);

  useEffect(() => {
    cargarBienes();
  }, []);

  const cargarBienes = async () => {
    setCargandoDatos(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/elementos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBienes(data);
      }
    } catch (error) {
      console.error("Error al cargar la tabla:", error);
    } finally {
      setCargandoDatos(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const abrirModal = () => {
    setMensaje({ texto: '', tipo: '' });
    setForm({ codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '' });
    setArchivoImagen(null);
    setMostrarModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargandoGuardar(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const token = localStorage.getItem('token');
      const headersAuth = { 'Authorization': `Bearer ${token}` };
      let rutaImagenId = null;

      if (archivoImagen) {
        const formData = new FormData();
        formData.append('archivo', archivoImagen);
        const imgRes = await fetch(`${API_URL}/imagenes`, { method: 'POST', headers: headersAuth, body: formData });
        if (!imgRes.ok) throw new Error("Error al subir la fotografía.");
        const imgData = await imgRes.json();
        rutaImagenId = imgData.id;
      }

      const elementoPayload = { ...form, rutaImagen: rutaImagenId };
      const res = await fetch(`${API_URL}/elementos`, {
        method: 'POST',
        headers: { ...headersAuth, 'Content-Type': 'application/json' },
        body: JSON.stringify(elementoPayload)
      });

      if (!res.ok) throw new Error("Error al registrar el bien en la base de datos.");

      setMensaje({ texto: '¡Bien registrado exitosamente!', tipo: 'success' });
      cargarBienes();
      setTimeout(() => setMostrarModal(false), 1500);

    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' });
    } finally {
      setCargandoGuardar(false);
    }
  };

  return (
    <div className="view-card" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* Hero Panel Estilizado */}
      <div className="hero-panel hero-panel-secondary" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div className="hero-copy">
          <span className="eyebrow" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>Gestión de Inventario</span>
          <h2 style={{ margin: '5px 0' }}>Catálogo de Bienes Registrados</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Visualice, gestione y registre los equipos individuales de la institución.</p>
        </div>
      </div>

      {/* Tabla con Action Bar integrado */}
      <div className="table-shell" style={{ borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', background: '#fff', padding: '25px' }}>
        
        {/* Cabecera de la tabla y botón (Posición correcta) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f3f4', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>Listado General</h3>
            <span style={{ fontSize: '0.9rem', color: '#5f6f68' }}>Total de bienes en la red ({bienes.length})</span>
          </div>
          <button 
            onClick={abrirModal} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--espe-green)', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '1.2rem' }}>+</span> Nuevo Bien
          </button>
        </div>
        
        {cargandoDatos ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#5f6f68' }}>
            <span style={{ fontSize: '2rem', display: 'block', animation: 'spin 1s linear infinite' }}>⏳</span>
            <p style={{ marginTop: '10px' }}>Sincronizando inventario...</p>
          </div>
        ) : bienes.length === 0 ? (
          <div className="empty-state" style={{ padding: '50px 20px', textAlign: 'center', background: '#f8fbf9', borderRadius: '12px', border: '1px dashed #cdd6d2' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>📦</span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--espe-green-dark)' }}>El catálogo está vacío</strong>
            <p style={{ color: '#5f6f68', marginTop: '8px' }}>Haga clic en "+ Nuevo Bien" para comenzar a registrar equipos.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="bienes-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fbf9' }}>
                  <th style={{ padding: '15px' }}>Código</th>
                  <th>Nombre del bien</th>
                  <th>Serie</th>
                  <th>Modelo</th>
                  <th>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {bienes.map(bien => (
                  <tr key={bien.id} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#fcfcfc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '15px' }}><strong>{bien.codigoBien}</strong></td>
                    <td>{bien.nombreBien}</td>
                    <td style={{ color: '#5f6f68' }}>{bien.serie || '-'}</td>
                    <td style={{ color: '#5f6f68' }}>{bien.modelo || '-'}</td>
                    <td><span className="pill" style={{ background: '#e1ebe5', color: 'var(--espe-green-dark)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>{bien.ubicacion || 'Sin Asignar'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 30, 20, 0.6)', backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' }}>
          
          <div className="form-card" style={{ background: 'white', padding: '35px', borderRadius: '16px', width: '100%', maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
            
            <button onClick={() => setMostrarModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f3f4', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', color: '#5f6f68', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#e1ebe5'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f3f4'}>
              &times;
            </button>
            
            <div style={{ borderBottom: '2px solid #f1f3f4', paddingBottom: '15px', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: 'var(--espe-green-dark)', fontSize: '1.5rem' }}>Registrar Nuevo Bien</h3>
              <p style={{ margin: '5px 0 0 0', color: '#5f6f68', fontSize: '0.9rem' }}>Complete la ficha técnica del equipo.</p>
            </div>
            
            {mensaje.texto && (
              <div style={{ padding: '12px 15px', marginBottom: '20px', borderRadius: '8px', background: mensaje.tipo === 'success' ? '#e6f4ea' : '#fce8e6', color: mensaje.tipo === 'success' ? '#137333' : '#c5221f', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
                <span>{mensaje.tipo === 'success' ? '✅' : '⚠️'}</span> {mensaje.texto}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Código del Bien *</label>
                <input type="text" name="codigoBien" value={form.codigoBien} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none', transition: 'border 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--espe-green)'} onBlur={(e) => e.target.style.borderColor = '#cdd6d2'} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Nombre del Bien *</label>
                <input type="text" name="nombreBien" value={form.nombreBien} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--espe-green)'} onBlur={(e) => e.target.style.borderColor = '#cdd6d2'} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Número de Serie</label>
                <input type="text" name="serie" value={form.serie} onChange={handleChange} style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--espe-green)'} onBlur={(e) => e.target.style.borderColor = '#cdd6d2'} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Modelo</label>
                <input type="text" name="modelo" value={form.modelo} onChange={handleChange} style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--espe-green)'} onBlur={(e) => e.target.style.borderColor = '#cdd6d2'} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Marca / Otros</label>
                <input type="text" name="marcaRazaOtros" value={form.marcaRazaOtros} onChange={handleChange} style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--espe-green)'} onBlur={(e) => e.target.style.borderColor = '#cdd6d2'} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Ubicación Física</label>
                <input type="text" name="ubicacion" value={form.ubicacion} onChange={handleChange} style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--espe-green)'} onBlur={(e) => e.target.style.borderColor = '#cdd6d2'} />
              </div>
              
              {/* Contenedor de Imagen Estilizado */}
              <div style={{ gridColumn: '1 / -1', background: '#f8fbf9', padding: '15px', borderRadius: '8px', border: '1px dashed #cdd6d2' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#333', marginBottom: '8px' }}>Fotografía del Equipo (Obligatorio)</label>
                <input type="file" accept="image/*" onChange={(e) => setArchivoImagen(e.target.files[0])} style={{ width: '100%', fontSize: '0.9rem', color: '#5f6f68' }} />
              </div>
              
              <div style={{ gridColumn: '1 / -1', marginTop: '10px', display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '2px solid #f1f3f4', paddingTop: '20px' }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #cdd6d2', borderRadius: '8px', cursor: 'pointer', color: '#333', fontWeight: '600', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fbf9'} onMouseOut={(e) => e.currentTarget.style.background = '#fff'}>
                  Cancelar
                </button>
                <button type="submit" disabled={cargandoGuardar} style={{ padding: '12px 24px', background: 'var(--espe-green)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {cargandoGuardar ? 'Procesando...' : 'Guardar Ficha Técnica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}