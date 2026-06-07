import { useMemo, useState } from 'react';

const bienesDeEjemplo = [
  { codigo: 'SIL-001', descripcion: 'Silla ergonómica office', pcs: 12, ubicacion: 'Sala 1' },
  { codigo: 'SIL-002', descripcion: 'Silla plegable conferencia', pcs: 8, ubicacion: 'Sala 2' },
  { codigo: 'MES-010', descripcion: 'Mesa de trabajo modular', pcs: 5, ubicacion: 'Sala 3' },
  { codigo: 'TAB-005', descripcion: 'Taburete laboratorio', pcs: 20, ubicacion: 'Laboratorio 1' },
];

function descargarCSV(registros) {
  const encabezados = ['Código', 'Descripción', 'PCS', 'Ubicación'];
  const filas = registros.map(item => [item.codigo, item.descripcion, item.pcs, item.ubicacion]);
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
      <div className="page-header">
        <div>
          <h2>Consultar Bienes por código</h2>
          <p>Busca un bien por su código y exporta los resultados a CSV.</p>
        </div>
      </div>

      <div className="search-bar">
        <label htmlFor="codigo-busqueda">Código del bien</label>
        <input
          id="codigo-busqueda"
          type="text"
          value={codigo}
          placeholder="Ej: SIL-001"
          onChange={(e) => setCodigo(e.target.value)}
        />
      </div>

      <div className="actions-row">
        <button
          className="btn-primary"
          disabled={resultados.length === 0}
          onClick={() => descargarCSV(resultados)}
        >
          Exportar resultados
        </button>
      </div>

      {codigo.trim() === '' ? (
        <p className="empty-state">Ingresa un código para ver resultados.</p>
      ) : resultados.length === 0 ? (
        <p className="empty-state">No se encontraron bienes con ese código.</p>
      ) : (
        <div className="table-responsive">
          <table className="bienes-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>PCS</th>
                <th>Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((bien) => (
                <tr key={bien.codigo}>
                  <td>{bien.codigo}</td>
                  <td>{bien.descripcion}</td>
                  <td>{bien.pcs}</td>
                  <td>{bien.ubicacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
