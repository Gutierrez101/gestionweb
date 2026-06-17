import { useMemo, useState } from 'react';

const bienesIniciales = [
  { codigo: 'SIL-001', serie: 'SR-2026-001', modelo: 'Ergo Pro', marca: 'OfficeLine', ubicacion: 'Sala 1' },
  { codigo: 'SIL-002', serie: 'SR-2026-002', modelo: 'Fold Basic', marca: 'OfficeLine', ubicacion: 'Sala 2' },
  { codigo: 'MES-010', serie: 'MT-2026-010', modelo: 'Work Mod', marca: 'Mobiliario ESPE', ubicacion: 'Sala 3' },
  { codigo: 'TAB-005', serie: 'TB-2026-005', modelo: 'Lab Stool', marca: 'LabTec', ubicacion: 'Laboratorio 1' },
];

export default function AdministrarBienes() {
  const [busqueda, setBusqueda] = useState('');

  const bienesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return bienesIniciales;
    return bienesIniciales.filter(bien =>
      bien.codigo.toLowerCase().includes(texto) ||
      bien.serie.toLowerCase().includes(texto) ||
      bien.modelo.toLowerCase().includes(texto) ||
      bien.marca.toLowerCase().includes(texto) ||
      bien.ubicacion.toLowerCase().includes(texto)
    );
  }, [busqueda]);

  const totalBienes = bienesIniciales.length;
  const ubicacionesUnicas = new Set(bienesIniciales.map((bien) => bien.ubicacion)).size;

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

        <div className="pill-row">
          <span className="pill">Códigos activos</span>
          <span className="pill">Serie visible</span>
          <span className="pill">Diseño limpio</span>
        </div>
      </div>

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
              </tr>
            </thead>
            <tbody>
              {bienesFiltrados.map((bien) => (
                <tr key={bien.codigo}>
                  <td>{bien.codigo}</td>
                  <td>{bien.serie}</td>
                  <td>{bien.modelo}</td>
                  <td>{bien.marca}</td>
                  <td>{bien.ubicacion}</td>
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
