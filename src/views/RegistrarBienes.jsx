import { useState, useEffect } from 'react';

//const API_URL = 'http://localhost:5051/api';
const API_URL = 'http://192.168.0.100:80/api';

export default function RegistrarBienes() {
  const [bienes, setBienes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [cargandoGuardar, setCargandoGuardar] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  // Nuevos estados para controlar la edición
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idBienEditar, setIdBienEditar] = useState(null);

  const [form, setForm] = useState({
    codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '', usuarioIdPropietario: '', rutaImagen: ''
  });
  const [archivoImagen, setArchivoImagen] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargandoDatos(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [resBienes, resUsuarios] = await Promise.all([
        fetch(`${API_URL}/elementos`, { headers }),
        fetch(`${API_URL}/usuarios`, { headers })
      ]);

      if (resBienes.ok) setBienes(await resBienes.json());
      if (resUsuarios.ok) setUsuarios(await resUsuarios.json());
      
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setCargandoDatos(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  // Función para abrir modal en modo CREACIÓN
  const abrirModalCrear = () => {
    setMensaje({ texto: '', tipo: '' });
    setForm({ codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '', usuarioIdPropietario: '', rutaImagen: '' });
    setArchivoImagen(null);
    setModoEdicion(false);
    setIdBienEditar(null);
    setMostrarModal(true);
  };

  // Función para abrir modal en modo EDICIÓN
  const abrirModalEditar = (bien) => {
    setMensaje({ texto: '', tipo: '' });
    setForm({
      codigoBien: bien.codigoBien || '',
      nombreBien: bien.nombreBien || '',
      serie: bien.serie || '',
      modelo: bien.modelo || '',
      marcaRazaOtros: bien.marcaRazaOtros || '',
      ubicacion: bien.ubicacion || '',
      usuarioIdPropietario: bien.usuarioIdPropietario || '',
      rutaImagen: bien.rutaImagen || '' // Mantenemos la imagen original por si no sube una nueva
    });
    setArchivoImagen(null);
    setModoEdicion(true);
    setIdBienEditar(bien.id);
    setMostrarModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de imagen: Solo es obligatoria si estamos creando un bien nuevo
    if (!modoEdicion && !archivoImagen) {
      setMensaje({ texto: 'La fotografía del bien es obligatoria.', tipo: 'error' });
      return;
    }

    setCargandoGuardar(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const token = localStorage.getItem('token');
      const headersAuth = { 'Authorization': `Bearer ${token}` };
      
      let rutaImagenId = form.rutaImagen; // Por defecto, usamos la imagen que ya tenía

      // 1. Si el usuario seleccionó una imagen NUEVA, la subimos
      if (archivoImagen) {
        const formData = new FormData();
        formData.append('archivo', archivoImagen);
        const imgRes = await fetch(`${API_URL}/imagenes`, { method: 'POST', headers: headersAuth, body: formData });
        
        if (!imgRes.ok) throw new Error("Error al subir la fotografía.");
        const imgData = await imgRes.json();
        rutaImagenId = imgData.id; // Actualizamos con el nuevo UUID
      }

      // 2. Preparar el payload convirtiendo el ID del usuario a número
      const elementoPayload = { 
        ...form, 
        usuarioIdPropietario: parseInt(form.usuarioIdPropietario, 10),
        rutaImagen: rutaImagenId 
      };

      // 3. Determinar si hacemos un POST o un PUT
      const url = modoEdicion ? `${API_URL}/elementos/${idBienEditar}` : `${API_URL}/elementos`;
      const method = modoEdicion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { ...headersAuth, 'Content-Type': 'application/json' },
        body: JSON.stringify(elementoPayload)
      });

      if (!res.ok) throw new Error(modoEdicion ? "Error al actualizar el bien." : "Error al registrar el bien.");

      setMensaje({ texto: modoEdicion ? '¡Bien actualizado exitosamente!' : '¡Bien registrado y asignado!', tipo: 'success' });
      cargarDatos();
      setTimeout(() => setMostrarModal(false), 1500);

    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' });
    } finally {
      setCargandoGuardar(false);
    }
  };

  return (
    <div className="view-card" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      <div className="hero-panel hero-panel-secondary" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div className="hero-copy">
          <span className="eyebrow" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>Gestión de Inventario</span>
          <h2 style={{ margin: '5px 0' }}>Catálogo de Bienes Registrados</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Visualice, gestione y asigne los equipos individuales a sus respectivos custodios.</p>
        </div>
      </div>

      <div className="table-shell" style={{ borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', background: '#fff', padding: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f3f4', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>Listado General</h3>
            <span style={{ fontSize: '0.9rem', color: '#5f6f68' }}>Total de bienes en la red ({bienes.length})</span>
          </div>
          <button 
            onClick={abrirModalCrear} 
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
          </div>
        ) : (
          <div className="table-responsive">
            <table className="bienes-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fbf9' }}>
                  <th style={{ padding: '15px' }}>Foto</th>
                  <th>Código</th>
                  <th>Nombre del bien</th>
                  <th>Serie</th>
                  <th>Ubicación</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bienes.map(bien => (
                  <tr key={bien.id} style={{ borderBottom: '1px solid #f1f3f4', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#fcfcfc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '15px' }}>
                      {bien.rutaImagen ? (
                        <img src={`${API_URL}/imagenes/${bien.rutaImagen}`} alt="Foto" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', background: '#e1ebe5', borderRadius: '6px', display: 'grid', placeItems: 'center', fontSize: '0.7rem' }}>N/A</div>
                      )}
                    </td>
                    <td><strong>{bien.codigoBien}</strong></td>
                    <td>{bien.nombreBien}</td>
                    <td style={{ color: '#5f6f68' }}>{bien.serie || '-'}</td>
                    <td><span className="pill" style={{ background: '#e1ebe5', color: 'var(--espe-green-dark)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>{bien.ubicacion || 'Sin Asignar'}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => abrirModalEditar(bien)}
                        style={{ padding: '8px 12px', background: '#f8fbf9', border: '1px solid #cdd6d2', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '1.1rem' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#e1ebe5'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#f8fbf9'}
                        title="Editar Bien"
                      >
                        ✏️
                      </button>
                    </td>
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
            <button onClick={() => setMostrarModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f3f4', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', color: '#5f6f68', transition: 'background 0.2s' }}>&times;</button>
            
            <div style={{ borderBottom: '2px solid #f1f3f4', paddingBottom: '15px', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: 'var(--espe-green-dark)', fontSize: '1.5rem' }}>
                {modoEdicion ? 'Editar Bien Patrimonial' : 'Registrar Nuevo Bien'}
              </h3>
              <p style={{ margin: '5px 0 0 0', color: '#5f6f68', fontSize: '0.9rem' }}>
                {modoEdicion ? 'Modifique los datos técnicos del equipo.' : 'Complete la ficha técnica y asigne un custodio.'}
              </p>
            </div>
            
            {mensaje.texto && (
              <div style={{ padding: '12px 15px', marginBottom: '20px', borderRadius: '8px', background: mensaje.tipo === 'success' ? '#e6f4ea' : '#fce8e6', color: mensaje.tipo === 'success' ? '#137333' : '#c5221f', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
                <span>{mensaje.tipo === 'success' ? '✅' : '⚠️'}</span> {mensaje.texto}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Código del Bien *</label>
                <input type="text" name="codigoBien" value={form.codigoBien} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Nombre del Bien *</label>
                <input type="text" name="nombreBien" value={form.nombreBien} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
              </div>
              
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Custodio Asignado *</label>
                <select name="usuarioIdPropietario" value={form.usuarioIdPropietario} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none', background: '#fff' }}>
                  <option value="">-- Seleccione un usuario --</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Número de Serie</label>
                <input type="text" name="serie" value={form.serie} onChange={handleChange} style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Modelo</label>
                <input type="text" name="modelo" value={form.modelo} onChange={handleChange} style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Marca / Otros</label>
                <input type="text" name="marcaRazaOtros" value={form.marcaRazaOtros} onChange={handleChange} style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>Ubicación Física</label>
                <input type="text" name="ubicacion" value={form.ubicacion} onChange={handleChange} style={{ padding: '10px 12px', border: '1px solid #cdd6d2', borderRadius: '8px', outline: 'none' }} />
              </div>
              
              <div style={{ gridColumn: '1 / -1', background: '#f8fbf9', padding: '15px', borderRadius: '8px', border: '1px dashed #cdd6d2' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#333', marginBottom: '8px' }}>
                  📸 Fotografía del Equipo {modoEdicion ? '(Opcional: Suba una nueva para reemplazar)' : '* (Obligatoria)'}
                </label>
                <input type="file" accept="image/*" onChange={(e) => setArchivoImagen(e.target.files[0])} style={{ width: '100%', fontSize: '0.9rem', color: '#5f6f68' }} />
              </div>
              
              <div style={{ gridColumn: '1 / -1', marginTop: '10px', display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '2px solid #f1f3f4', paddingTop: '20px' }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #cdd6d2', borderRadius: '8px', cursor: 'pointer', color: '#333', fontWeight: '600' }}>Cancelar</button>
                <button type="submit" disabled={cargandoGuardar} style={{ padding: '12px 24px', background: 'var(--espe-green)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {cargandoGuardar ? 'Procesando...' : (modoEdicion ? 'Guardar Cambios' : 'Guardar Ficha Técnica')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}