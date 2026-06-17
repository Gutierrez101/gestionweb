import { useMemo, useState } from 'react';

const bienesIniciales = [
  { id: 1, codigo: 'SIL-001', serie: 'SR-2026-001', modelo: 'Ergo Pro', marca: 'OfficeLine', ubicacion: 'Sala 1' },
  { id: 2, codigo: 'SIL-002', serie: 'SR-2026-002', modelo: 'Fold Basic', marca: 'OfficeLine', ubicacion: 'Sala 2' },
  { id: 3, codigo: 'MES-010', serie: 'MT-2026-010', modelo: 'Work Mod', marca: 'Mobiliario ESPE', ubicacion: 'Sala 3' },
  { id: 4, codigo: 'TAB-005', serie: 'TB-2026-005', modelo: 'Lab Stool', marca: 'LabTec', ubicacion: 'Laboratorio 1' },
];

export default function AdministrarBienes() {
  const [bienes, setBienes] = useState(bienesIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    serie: '',
    modelo: '',
    marca: '',
    ubicacion: '',
  });

  const bienesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return bienes;
    return bienes.filter(bien =>
      bien.codigo.toLowerCase().includes(texto) ||
      bien.serie.toLowerCase().includes(texto) ||
      bien.modelo.toLowerCase().includes(texto) ||
      bien.marca.toLowerCase().includes(texto) ||
      bien.ubicacion.toLowerCase().includes(texto)
    );
  }, [busqueda, bienes]);

  const totalBienes = bienes.length;
  const ubicacionesUnicas = new Set(bienes.map((bien) => bien.ubicacion)).size;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardar = () => {
    if (!formData.codigo || !formData.serie || !formData.modelo || !formData.marca || !formData.ubicacion) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (editandoId) {
      // Actualizar bien existente
      setBienes(bienes.map(bien =>
        bien.id === editandoId
          ? { ...bien, ...formData }
          : bien
      ));
      setEditandoId(null);
    } else {
      // Agregar nuevo bien
      const nuevoId = Math.max(...bienes.map(b => b.id), 0) + 1;
      setBienes([...bienes, { id: nuevoId, ...formData }]);
    }

    setFormData({ codigo: '', serie: '', modelo: '', marca: '', ubicacion: '' });
    setMostrarFormulario(false);
  };

  const handleEditar = (bien) => {
    setFormData(bien);
    setEditandoId(bien.id);
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este bien?')) {
      setBienes(bienes.filter(bien => bien.id !== id));
    }
  };

  const handleCancelar = () => {
    setFormData({ codigo: '', serie: '', modelo: '', marca: '', ubicacion: '' });
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="view-card">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Inventario / administración</span>
          <h2>Administrar Bienes</h2>
          <p>Vista minimalista para revisar y controlar cada bien con foco en identificación, serie, modelo y ubicación.</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span>Registros</span>
            <strong>{totalBienes}</strong>
          </div>
          <div className="stat-card">
            <span>Ubicaciones</span>
            <strong>{ubicacionesUnicas}</strong>
          </div>
          <div className="stat-card stat-card-accent">
            <span>Filtrados</span>
            <strong>{bienesFiltrados.length}</strong>
          </div>
        </div>
      </div>

      <div className="control-panel">
        <div className="search-bar search-bar-compact">
          <label htmlFor="busqueda-bienes">Buscar por código, serie, modelo, marca o ubicación</label>
          <input
            id="busqueda-bienes"
            type="text"
            value={busqueda}
            placeholder="Ej: SIL-001, SR-2026, Ergo Pro"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button 
          className="btn-primary"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? 'Cancelar' : '+ Registrar nuevo bien'}
        </button>

        <div className="pill-row">
          <span className="pill">Códigos activos</span>
          <span className="pill">Serie visible</span>
          <span className="pill">Diseño limpio</span>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="form-shell">
          <div className="form-header">
            <h3>{editandoId ? 'Editar bien' : 'Registrar nuevo bien'}</h3>
          </div>
          <form className="bien-form">
            <div className="form-group">
              <label htmlFor="codigo">Código del bien *</label>
              <input
                id="codigo"
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                placeholder="Ej: SIL-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="serie">Serie *</label>
              <input
                id="serie"
                type="text"
                name="serie"
                value={formData.serie}
                onChange={handleInputChange}
                placeholder="Ej: SR-2026-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="modelo">Modelo *</label>
              <input
                id="modelo"
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                placeholder="Ej: Ergo Pro"
              />
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca/Raza/Otros *</label>
              <input
                id="marca"
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                placeholder="Ej: OfficeLine"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ubicacion">Ubicación *</label>
              <input
                id="ubicacion"
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                placeholder="Ej: Sala 1"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button"
                className="btn-primary"
                onClick={handleGuardar}
              >
                {editandoId ? 'Guardar cambios' : 'Registrar bien'}
              </button>
              <button 
                type="button"
                className="btn-secondary"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-shell">
        <div className="table-header">
          <div>
            <h3>Listado de bienes</h3>
            <p>Formato institucional para seguimiento rápido del activo.</p>
          </div>
          <span className="table-badge">{bienesFiltrados.length} resultados</span>
        </div>
        <div className="table-responsive">
          <table className="bienes-table">
            <thead>
              <tr>
                <th>Código del bien</th>
                <th>Serie</th>
                <th>Modelo</th>
                <th>Marca/Raza/Otros</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bienesFiltrados.map((bien) => (
                <tr key={bien.id}>
                  <td>{bien.codigo}</td>
                  <td>{bien.serie}</td>
                  <td>{bien.modelo}</td>
                  <td>{bien.marca}</td>
                  <td>{bien.ubicacion}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-small btn-edit"
                      onClick={() => handleEditar(bien)}
                      title="Editar bien"
                    >
                      Editar
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleEliminar(bien.id)}
                      title="Eliminar bien"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bienesFiltrados.length === 0 && (
        <p className="empty-state">No se encontró ningún bien con ese criterio.</p>
      )}
    </div>
  );
}