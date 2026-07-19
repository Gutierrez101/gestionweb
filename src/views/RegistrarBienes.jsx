import { useState, useEffect, useMemo } from 'react';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051/api';
const API_URL = 'http://localhost:5051/api';

export default function RegistrarBienes() {
  const [bienes, setBienes] = useState([]);
  const [custodios, setCustodios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  // ALINEADO AL NUEVO ESQUEMA DEL JSON OpenAPI:
  const [formData, setFormData] = useState({ 
    codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '', usuarioIdPropietario: '' 
  });

  const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };

  const cargarDatos = async () => {
    try {
      const [resBienes, resUsuarios] = await Promise.all([
        fetch(`${API_URL}/elementos`, { headers }),
        fetch(`${API_URL}/usuarios`, { headers })
      ]);
      if (resBienes.ok) setBienes(await resBienes.json());
      if (resUsuarios.ok) setCustodios(await resUsuarios.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const bienesFiltrados = useMemo(() => {
    return bienes.filter(b => 
      b.codigoBien?.toLowerCase().includes(busqueda.toLowerCase()) || 
      b.nombreBien?.toLowerCase().includes(busqueda.toLowerCase()) ||
      b.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, bienes]);

  const handleGuardar = async () => {
    try {
      const url = editandoId ? `${API_URL}/elementos/${editandoId}` : `${API_URL}/elementos`;
      const method = editandoId ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, headers, body: JSON.stringify(formData) });
      if (res.ok) {
        alert(editandoId ? 'Bien actualizado correctamente' : 'Bien registrado exitosamente');
        cerrarVentana();
        cargarDatos();
      } else alert('Error al guardar. Verifica que el Código del Bien no esté duplicado.');
    } catch (e) { console.error(e); }
  };

  const handleEliminar = async (id) => {
    if(!confirm('¿Eliminar este bien permanentemente?')) return;
    try {
      const res = await fetch(`${API_URL}/elementos/${id}`, { method: 'DELETE', headers });
      if (res.ok || res.status === 204) {
        alert('Bien eliminado');
        cargarDatos();
      }
    } catch (e) { console.error(e); }
  };

  const iniciarEdicion = (bien) => {
    setFormData({
      codigoBien: bien.codigoBien || '',
      nombreBien: bien.nombreBien || '',
      serie: bien.serie || '',
      modelo: bien.modelo || '',
      marcaRazaOtros: bien.marcaRazaOtros || '',
      ubicacion: bien.ubicacion || '',
      usuarioIdPropietario: bien.usuarioIdPropietario || ''
    });
    setEditandoId(bien.id); 
    setMostrarFormulario(true);
  };

  const cerrarVentana = () => {
    setMostrarFormulario(false);
    setEditandoId(null);
    setFormData({ codigoBien: '', nombreBien: '', serie: '', modelo: '', marcaRazaOtros: '', ubicacion: '', usuarioIdPropietario: '' });
  };

  // Función auxiliar para mostrar el nombre del custodio en la tabla en vez de su UUID
  const obtenerNombreCustodio = (uuid) => {
    const usuario = custodios.find(c => c.id === uuid);
    return usuario ? usuario.nombre : 'Sin Asignar';
  };

  return (
    <div className="view-card">
      <div className="hero-panel">
        <div className="hero-copy"><h2>Administrar Bienes</h2><p>Inventario general conectado al servidor de red.</p></div>
      </div>
      <div className="control-panel">
        <div className="search-bar search-bar-compact"><input type="text" placeholder="Buscar por código, nombre o ubicación..." onChange={e => setBusqueda(e.target.value)}/></div>
        <button className="btn-primary" onClick={() => setMostrarFormulario(true)}>+ Nuevo bien</button>
      </div>

      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '750px', alignItems: 'stretch', textAlign: 'left' }}>
            <h3 style={{ borderBottom: '2px solid #f4f6f8', paddingBottom: '15px' }}>
              {editandoId ? 'Editar Bien Institucional' : 'Registrar Nuevo Bien'}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div className="form-group"><label>Código del Bien *</label><input type="text" value={formData.codigoBien} onChange={e => setFormData({...formData, codigoBien: e.target.value})} placeholder="Ej: SIL-001" required /></div>
              <div className="form-group"><label>Nombre del Bien *</label><input type="text" value={formData.nombreBien} onChange={e => setFormData({...formData, nombreBien: e.target.value})} placeholder="Ej: Escritorio Ejecutivo" required /></div>
              <div className="form-group"><label>Serie *</label><input type="text" value={formData.serie} onChange={e => setFormData({...formData, serie: e.target.value})} placeholder="Ej: SR-2026-X9" required /></div>
              <div className="form-group"><label>Modelo *</label><input type="text" value={formData.modelo} onChange={e => setFormData({...formData, modelo: e.target.value})} placeholder="Ej: ErgoPro 2" required /></div>
              <div className="form-group"><label>Marca / Raza / Otros *</label><input type="text" value={formData.marcaRazaOtros} onChange={e => setFormData({...formData, marcaRazaOtros: e.target.value})} placeholder="Ej: OfficeLine / HP" required /></div>
              <div className="form-group"><label>Ubicación Física *</label><input type="text" value={formData.ubicacion} onChange={e => setFormData({...formData, ubicacion: e.target.value})} placeholder="Ej: Sala de Juntas 1" required /></div>
              
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Custodio Asignado *</label>
                <select 
                  value={formData.usuarioIdPropietario} 
                  onChange={e => setFormData({...formData, usuarioIdPropietario: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', color: 'var(--text-dark)'}}
                  required
                >
                  <option value="">-- Seleccione el Docente/Custodio responsable --</option>
                  {custodios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>{usuario.nombre} - Cédula: {usuario.cedula}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
              <button className="btn-cancel" onClick={cerrarVentana} style={{ flex: 1 }}>Cancelar</button>
              <button className="btn-primary" onClick={handleGuardar} style={{ flex: 1 }}>Guardar Bien</button>
            </div>
          </div>
        </div>
      )}

      <table className="bienes-table">
        <thead><tr><th>Código</th><th>Nombre</th><th>Serie / Modelo</th><th>Ubicación</th><th>Custodio</th><th>Acciones</th></tr></thead>
        <tbody>
          {bienesFiltrados.map(b => (
            <tr key={b.id}>
              <td><strong>{b.codigoBien}</strong></td>
              <td>{b.nombreBien}</td>
              <td>{b.serie} / {b.modelo}</td>
              <td>{b.ubicacion}</td>
              <td>{obtenerNombreCustodio(b.usuarioIdPropietario)}</td>
              <td className="actions-cell">
                <button className="btn-small btn-edit" onClick={() => iniciarEdicion(b)}>Editar</button>
                <button className="btn-small btn-delete" onClick={() => handleEliminar(b.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}