import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function CargarDatos() {
  const [bien, setBien] = useState({ codigo: '', descripcion: '', pcs: '', ubicacion: '' });

  const handleManualSubmit = (e) => {
    e.preventDefault();
    console.log("Carga individual:", bien);
    alert(`Bien ${bien.codigo} registrado con éxito (en consola).`);
    setBien({ codigo: '', descripcion: '', pcs: '', ubicacion: '' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log("Carga masiva detectada:", json);
      alert(`Se han cargado ${json.length} bienes masivamente.`);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="view-card">
      <h2>Cargar Datos</h2>
      
      <section>
        <h3>Carga Individual</h3>
        <form onSubmit={handleManualSubmit}>
          <input type="text" placeholder="Código" value={bien.codigo} onChange={(e) => setBien({...bien, codigo: e.target.value})} required />
          <input type="text" placeholder="Descripción" value={bien.descripcion} onChange={(e) => setBien({...bien, descripcion: e.target.value})} required />
          <input type="number" placeholder="PCS" value={bien.pcs} onChange={(e) => setBien({...bien, pcs: e.target.value})} required />
          <input type="text" placeholder="Ubicación" value={bien.ubicacion} onChange={(e) => setBien({...bien, ubicacion: e.target.value})} required />
          <button type="submit" className="btn-primary">Registrar Bien</button>
        </form>
      </section>

      <hr />

      <section>
        <h3>Carga Masiva (Excel)</h3>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </section>
    </div>
  );
}