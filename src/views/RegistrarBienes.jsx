// src/views/RegistrarBienes.jsx
import { useState } from 'react';

const bienesIniciales = Array.from({ length: 10 }, (_, i) => ({
  codigo: `LAB-${String(i + 1).padStart(3, '0')}`,
  descripcion: `Dispositivo / Mobiliario Tipo ${i + 1}`,
  categoria: i % 2 === 0 ? 'Electrónica' : 'Infraestructura',
  pcs: Math.floor(Math.random() * 12) + 1,
}));

export default function RegistrarBienes() {
  const [bienes, setBienes] = useState(bienesIniciales);
  const [filtro, setFiltro] = useState('');
  const [form, setForm] = useState({ codigo: '', descripcion: '', categoria: '', pcs: '' });
  const [editando, setEditando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mitigación básica XSS a nivel de cliente (limpieza de cadenas)
    const limpioCodigo = form.codigo.replace(/<[^>]*>/g, '').trim();
    const limpioDescripcion = form.descripcion.replace(/<[^>]*>/g, '').trim();
    const limpioCategoria = form.categoria.replace(/<[^>]*>/g, '').trim();

    const objetoFormateado = {
      codigo: limpioCodigo,
      descripcion: limpioDescripcion,
      categoria: limpioCategoria,
      pcs: parseInt(form.pcs, 10)
    };

    if (editando) {
      setBienes(bienes.map(b => b.codigo === objetoFormateado.codigo ? objetoFormateado : b));
      setEditando(false);
    } else {
      if (bienes.find(b => b.codigo.toLowerCase() === objetoFormateado.codigo.toLowerCase())) {
        alert('Este código identificador ya se encuentra registrado.');
        return;
      }
      setBienes([objetoFormateado, ...bienes]);
    }
    setForm({ codigo: '', descripcion: '', categoria: '', pcs: '' });
  };

  const handleEdit = (bien) => {
    setForm(bien);
    setEditando(true);
  };

  const handleDelete = (codigo) => {
    if (confirm('¿Confirma la eliminación permanente de este registro?')) {
      setBienes(bienes.filter(b => b.codigo !== codigo));
    }
  };

  const bienesFiltrados = bienes.filter(b => b.codigo.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div>
      <div className="dashboard-header">
        <h2>Registro de Bienes Tecnológicos y de Infraestructura</h2>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
        
        {/* Formulario de Registro */}
        <div className="view-card">
          <h3>{editando ? 'Modificar Información del Bien' : 'Indexar Nuevo Bien'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ marginBottom: '15px' }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Código de Inventario</label>
                <input type="text" placeholder="Ej: LAB-001" value={form.codigo} disabled={editando} onChange={e => setForm({...form, codigo: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Descripción General</label>
                <input type="text" placeholder="Nombre o detalle" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required />
              </div>
            </div>
            
            <div className="form-grid" style={{ marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Categoría</label>
                <input type="text" placeholder="Mobiliario, Equipos, etc." value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Unidades Totales (PCS)</label>
                <input type="number" placeholder="Cantidad numérica" value={form.pcs} onChange={e => setForm({...form, pcs: e.target.value})} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 25px' }}>
                {editando ? 'Actualizar Registro' : 'Confirmar Guardado'}
              </button>
              {editando && (
                <button type="button" className="btn-danger" style={{ padding: '10px 25px' }} onClick={() => { setEditando(false); setForm({ codigo: '', descripcion: '', categoria: '', pcs: '' }); }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla Informativa */}
        <div className="view-card">
          <h3>Primeros 10 Bienes en Sistema</h3>
          <div className="search-bar" style={{ marginBottom: '20px' }}>
            <input type="text" placeholder="Filtrar listado escribiendo el código..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          </div>
          
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Código Interno</th>
                  <th>Descripción Técnica</th>
                  <th>Categoría</th>
                  <th>Cantidad (PCS)</th>
                  <th>Operaciones</th>
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
                      <button className="btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(bien.codigo)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {bienesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No coinciden registros con el criterio de código ingresado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}