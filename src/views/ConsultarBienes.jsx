import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

const bienesDeEjemplo = [
  { codigo: 'SIL-001', descripcion: 'Silla ergonómica office', pcs: 12, ubicacion: 'Sala 1' },
  { codigo: 'SIL-002', descripcion: 'Silla plegable conferencia', pcs: 8, ubicacion: 'Sala 2' },
  { codigo: 'MES-010', descripcion: 'Mesa de trabajo modular', pcs: 5, ubicacion: 'Sala 3' },
  { codigo: 'TAB-005', descripcion: 'Taburete laboratorio', pcs: 20, ubicacion: 'Laboratorio 1' },
];

function descargarExcel(registros) {
  const datos = registros.map(item => ({
    'Código': item.codigo,
    'Descripción': item.descripcion,
    'PCS': item.pcs,
    'Ubicación': item.ubicacion
  }));

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(libro, hoja, 'Bienes');

  XLSX.writeFile(libro, 'bienes_exportados.xlsx');
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
          <h2 style={{ color: 'var(--text-dark)' }}>Consultar Bienes por código</h2>
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
          onClick={() => descargarExcel(resultados)}
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
