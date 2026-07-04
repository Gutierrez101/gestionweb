import { useState, useEffect, useMemo } from 'react';

const API_URL = 'http://localhost:5051/api';

export default function RegistrarBienes() {
  const [bienes, setBienes] = useState([]);
  const [custodios, setCustodios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({ codigoBarras: '', nombre: '', descripcion: '', categoria: '', precio: 0 });

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
    return bienes.filter(b => b.codigoBarras?.toLowerCase().includes(busqueda.toLowerCase()) || b.nombre?.toLowerCase().includes(busqueda.toLowerCase()));
  }, [busqueda, bienes]);

  const handleGuardar = async () => {
    try {
      const url = editandoId ? `${API_URL}/elementos/${editandoId}` : `${API_URL}/elementos`;
      const method = editandoId ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, headers, body: JSON.stringify(formData) });
      if (res.ok) {
        alert(editandoId ? 'Bien actualizado' : 'Bien registrado');
        setMostrarFormulario(false);
        setEditandoId(null);
        setFormData({ codigoBarras: '', nombre: '', descripcion: '', categoria: '', precio: 0 });
        cargarDatos();
      } else alert('Error al guardar');
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
    setFormData(bien); setEditandoId(bien.id); setMostrarFormulario(true);
  };

  return (
    <div className="view-card">
      <div className="hero-panel">
        <div className="hero-copy"><h2>Administrar Bienes</h2><p>CRUD completo conectado a la API y BD.</p></div>
      </div>
      <div className="control-panel">
        <div className="search-bar search-bar-compact"><input type="text" placeholder="Buscar..." onChange={e => setBusqueda(e.target.value)}/></div>
        <button className="btn-primary" onClick={() => setMostrarFormulario(!mostrarFormulario)}>{mostrarFormulario ? 'Cancelar' : '+ Nuevo bien'}</button>
      </div>

      {mostrarFormulario && (
        <div className="form-shell" style={{ marginBottom: '20px', padding: '20px', background: '#f8fbf9' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group"><label>Código de Barras</label><input type="text" value={formData.codigoBarras} onChange={e => setFormData({...formData, codigoBarras: e.target.value})} /></div>
            <div className="form-group"><label>Nombre</label><input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
            <div className="form-group"><label>Categoría</label><input type="text" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} /></div>
            <div className="form-group"><label>Precio</label><input type="number" value={formData.precio} onChange={e => setFormData({...formData, precio: parseFloat(e.target.value)})} /></div>
          </div>
          <button className="btn-primary" onClick={handleGuardar}>Guardar</button>
        </div>
      )}

      <table className="bienes-table">
        <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>
          {bienesFiltrados.map(b => (
            <tr key={b.id}>
              <td>{b.codigoBarras}</td><td>{b.nombre}</td><td>{b.categoria}</td><td>${b.precio}</td>
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