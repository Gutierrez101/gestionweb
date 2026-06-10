// src/views/RegistrarBienes.jsx
import { useState } from 'react';

// Generar 10 bienes iniciales para la tabla
const bienesIniciales = Array.from({ length: 10 }, (_, i) => ({
  codigo: `B-00${i + 1}`,
  descripcion: `Equipo Laboratorio ${i + 1}`,
  categoria: i % 2 === 0 ? 'Electrónica' : 'Mobiliario',
  pcs: Math.floor(Math.random() * 5) + 1,
}));

export default function RegistrarBienes() {
  const [bienes, setBienes] = useState(bienesIniciales);
  const [filtro, setFiltro] = useState('');
  const [form, setForm] = useState({ codigo: '', descripcion: '', categoria: '', pcs: '' });
  const [editando, setEditando] = useState(false);

  // Manejar el submit (Crear o Actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      setBienes(bienes.map(b => b.codigo === form.codigo ? form : b));
      setEditando(false);
    } else {
      if(bienes.find(b => b.codigo === form.codigo)) return alert('El código ya existe');
      setBienes([form, ...bienes]);
    }
    setForm({ codigo: '', descripcion: '', categoria: '', pcs: '' });
  };

  const handleEdit = (bien) => {
    setForm(bien);
    setEditando(true);
  };

  const handleDelete = (codigo) => {
    if(window.confirm('¿Eliminar este bien?')) {
      setBienes(bienes.filter(b => b.codigo !== codigo));
    }
  };

  // Filtrar bienes por código
  const bienesFiltrados = bienes.filter(b => b.codigo.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div>
      <div className="dashboard-header">
        <h2>Gestión de Bienes</h2>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
        
        {/* Formulario */}
        <div className="view-card">
          <h3>{editando ? 'Editar Bien' : 'Registrar Nuevo Bien'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input type="text" placeholder="Código (ej. B-011)" value={form.codigo} disabled={editando} onChange={e => setForm({...form, codigo: e.target.value})} required className="form-control"/>
              <input type="text" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required />
              <input type="text" placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required />
              <input type="number" placeholder="Cantidad (PCS)" value={form.pcs} onChange={e => setForm({...form, pcs: e.target.value})} required />
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button type="submit" className="btn-primary" style={{width: 'auto'}}>{editando ? 'Actualizar' : 'Guardar Bien'}</button>
              {editando && <button type="button" className="btn-danger" onClick={() => {setEditando(false); setForm({codigo:'', descripcion:'', categoria:'', pcs:''})}}>Cancelar</button>}
            </div>
          </form>
        </div>

        {/* Tabla con Filtro */}
        <div className="view-card">
          <h3>Listado de Bienes</h3>
          <div className="search-bar">
            <input type="text" placeholder="Buscar por código..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          </div>
          
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>PCS</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bienesFiltrados.slice(0, 10).map((bien) => (
                  <tr key={bien.codigo}>
                    <td><strong>{bien.codigo}</strong></td>
                    <td>{bien.descripcion}</td>
                    <td>{bien.categoria}</td>
                    <td>{bien.pcs}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(bien)}>Editar</button>
                      <button className="btn-danger" onClick={() => handleDelete(bien.codigo)}>Borrar</button>
                    </td>
                  </tr>
                ))}
                {bienesFiltrados.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No se encontraron bienes con ese código.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}