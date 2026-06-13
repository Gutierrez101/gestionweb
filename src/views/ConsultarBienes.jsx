import { useMemo, useState } from 'react';

const bienesDeEjemplo = [
  { codigo: 'SIL-001', serie: 'SR-2026-001', modelo: 'Ergo Pro', marca: 'OfficeLine', ubicacion: 'Sala 1' },
  { codigo: 'SIL-002', serie: 'SR-2026-002', modelo: 'Fold Basic', marca: 'OfficeLine', ubicacion: 'Sala 2' },
  { codigo: 'MES-010', serie: 'MT-2026-010', modelo: 'Work Mod', marca: 'Mobiliario ESPE', ubicacion: 'Sala 3' },
  { codigo: 'TAB-005', serie: 'TB-2026-005', modelo: 'Lab Stool', marca: 'LabTec', ubicacion: 'Laboratorio 1' },
];

function descargarCSV(registros) {
  const encabezados = ['Código del bien', 'Serie', 'Modelo', 'Marca/Raza/Otros', 'Ubicación'];
  const filas = registros.map(item => [item.codigo, item.serie, item.modelo, item.marca, item.ubicacion]);
  const csv = [encabezados.join(','), ...filas.map(f => f.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'bienes_exportados.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ConsultarBienes() {
  const [codigo, setCodigo] = useState('');

  const resultados = useMemo(() => {
    const valor = codigo.trim().toLowerCase();
    if (!valor) return [];
    return bienesDeEjemplo.filter(bien => bien.codigo.toLowerCase().includes(valor));
  }, [codigo]);

  return (
    <div className="view-card">
      <div className="hero-panel hero-panel-secondary">
        <div className="hero-copy">
          <span className="eyebrow">Consulta rápida</span>
          <h2>Consultar Bienes</h2>
          <p>Busca por código y revisa la ficha esencial del bien en una pantalla sobria, clara y fácil de escanear.</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span>Modo</span>
            <strong>Consulta</strong>
          </div>
          <div className="stat-card">
            <span>Exportación</span>
            <strong>CSV</strong>
          </div>
        </div>
      </div>

      <div className="control-panel consult-control-panel">
        <div className="search-bar search-bar-compact">
          <label htmlFor="codigo-busqueda">Código del bien</label>
          <input
            id="codigo-busqueda"
            type="text"
            value={codigo}
            placeholder="Ej: SIL-001"
            onChange={(e) => setCodigo(e.target.value)}
          />
        </div>

        <div className="actions-row consult-actions-row">
          <button
            className="btn-primary"
            disabled={resultados.length === 0}
            onClick={() => descargarCSV(resultados)}
          >
            Exportar resultados
          </button>
        </div>
      </div>

      {codigo.trim() === '' ? (
        <p className="empty-state">Ingresa un código para ver resultados.</p>
      ) : resultados.length === 0 ? (
        <p className="empty-state">No se encontraron bienes con ese código.</p>
      ) : (
        <div className="table-shell">
          <div className="table-header">
            <div>
              <h3>Resultado de búsqueda</h3>
              <p>Información disponible del bien consultado.</p>
            </div>
            <span className="table-badge">1 ficha encontrada</span>
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
                {resultados.map((bien) => (
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
      )}
    </div>
  );
}