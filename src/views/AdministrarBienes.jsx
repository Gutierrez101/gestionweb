import { useMemo, useState } from 'react';

const bienesIniciales = [
  { codigo: 'SIL-001', descripcion: 'Silla ergonómica office', categoria: 'Silla', pcs: 12, ubicacion: 'Sala 1', estado: 'Disponible' },
  { codigo: 'SIL-002', descripcion: 'Silla plegable conferencia', categoria: 'Silla', pcs: 8, ubicacion: 'Sala 2', estado: 'En uso' },
  { codigo: 'MES-010', descripcion: 'Mesa de trabajo modular', categoria: 'Mesa', pcs: 5, ubicacion: 'Sala 3', estado: 'Disponible' },
  { codigo: 'TAB-005', descripcion: 'Taburete laboratorio', categoria: 'Taburete', pcs: 20, ubicacion: 'Laboratorio 1', estado: 'Disponible' },
];

export default function AdministrarBienes() {
  const [busqueda, setBusqueda] = useState('');

  const bienesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return bienesIniciales;
    return bienesIniciales.filter(bien =>
      bien.codigo.toLowerCase().includes(texto) ||
      bien.descripcion.toLowerCase().includes(texto) ||
      bien.categoria.toLowerCase().includes(texto)
    );
  }, [busqueda]);

  const totalPcs = bienesIniciales.reduce((sum, bien) => sum + bien.pcs, 0);

  return (
    <div className="view-card">
      <div className="page-header">
        <div>
          <h2>Administrar Bienes</h2>
          <p>Controla inventario, códigos y cantidades de bienes como sillas y mobiliario.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-box">
          <strong>{bienesIniciales.length}</strong>
          <span>Bienes registrados</span>
        </div>
        <div className="summary-box">
          <strong>{totalPcs}</strong>
          <span>Pcs totales</span>
        </div>
        <div className="summary-box">
          <strong>{bienesFiltrados.length}</strong>
          <span>Resultados filtrados</span>
        </div>
      </div>

      <div className="search-bar">
        <label htmlFor="busqueda-bienes">Buscar por código, descripción o categoría</label>
        <input
          id="busqueda-bienes"
          type="text"
          value={busqueda}
          placeholder="Ej: SIL-001, silla, mesa"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="bienes-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>PCS</th>
              <th>Ubicación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {bienesFiltrados.map((bien) => (
              <tr key={bien.codigo}>
                <td>{bien.codigo}</td>
                <td>{bien.descripcion}</td>
                <td>{bien.categoria}</td>
                <td>{bien.pcs}</td>
                <td>{bien.ubicacion}</td>
                <td>{bien.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bienesFiltrados.length === 0 && (
        <p className="empty-state">No se encontró ningún bien con ese criterio.</p>
      )}
    </div>
  );
}
