import { useState } from 'react';

const API_URL = 'http://localhost:5051/api';

export default function ConsultarBienes() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);

  const buscarBien = async () => {
    try {
      const res = await fetch(`${API_URL}/elementos`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const datos = await res.json();
        setResultados(datos.filter(b => b.codigoBarras?.toLowerCase() === busqueda.toLowerCase()));
      }
    } catch (e) { console.error(e); }
  };

  const descargarExcelApi = async () => {
    try {
      const res = await fetch(`${API_URL}/elementos/exportar`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Inventario.xlsx';
        a.click();
      } else alert('Error al exportar desde el servidor.');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="view-card">
      <div className="hero-panel hero-panel-secondary">
        <div className="hero-copy"><h2>Consultar y Exportar</h2></div>
      </div>
      
      <div className="control-panel consult-control-panel">
        <div className="search-bar search-bar-compact">
          <input type="text" value={busqueda} placeholder="Código de barras..." onChange={e => setBusqueda(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={buscarBien}>Buscar</button>
        <button className="btn-primary" onClick={descargarExcelApi} style={{ background: 'var(--espe-gold)' }}>Descargar Todo (Excel)</button>
      </div>

      <table className="bienes-table">
        <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th></tr></thead>
        <tbody>
          {resultados.map(b => <tr key={b.id}><td>{b.codigoBarras}</td><td>{b.nombre}</td><td>{b.categoria}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}