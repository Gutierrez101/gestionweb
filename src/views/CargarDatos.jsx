// src/views/CargarDatos.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function CargarDatos() {
  const [bien, setBien] = useState({ codigo: '', descripcion: '', pcs: '', ubicacion: '' });

  const handleManualSubmit = (e) => {
    e.preventDefault();
    alert(`Bien ${bien.codigo} registrado de forma individual.`);
    setBien({ codigo: '', descripcion: '', pcs: '', ubicacion: '' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      alert(`Se han importado exitosamente ${json.length} bienes mediante el archivo Excel.`);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>Ingreso y Transferencia de Datos</h2>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Sección Carga Individual */}
        <div className="view-card">
          <h3>Carga Individual</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Ingrese los datos de inventariado básicos para añadir una unidad única al registro de laboratorios.
          </p>
          
          <form onSubmit={handleManualSubmit}>
            <div className="form-group">
              <label>Código Único</label>
              <input type="text" placeholder="Ej: SIL-001" value={bien.codigo} onChange={(e) => setBien({...bien, codigo: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label>Descripción del Objeto</label>
              <input type="text" placeholder="Ej: Silla plegable de conferencia" value={bien.descripcion} onChange={(e) => setBien({...bien, descripcion: e.target.value})} required />
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '0px', gap: '15px' }}>
              <div className="form-group">
                <label>Cantidad (PCS)</label>
                <input type="number" placeholder="Cantidad" value={bien.pcs} onChange={(e) => setBien({...bien, pcs: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Ubicación / Aula</label>
                <input type="text" placeholder="Ej: Sala 2" value={bien.ubicacion} onChange={(e) => setBien({...bien, ubicacion: e.target.value})} required />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '15px' }}>
              Registrar Bien
            </button>
          </form>
        </div>

        {/* Sección Carga Masiva */}
        <div className="view-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>Carga Masiva de Registros</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Cargue hojas de cálculo en formatos compatibles (.xlsx o .xls) para indexar bienes masivamente.
          </p>

          <div 
            style={{
              flex: 1,
              border: '2px dashed var(--border-color)',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '30px',
              background: 'var(--bg-light)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '45px', marginBottom: '15px' }}>📄</div>
            <label 
              htmlFor="excel-upload" 
              className="btn-primary" 
              style={{ 
                width: 'auto', 
                padding: '12px 24px', 
                cursor: 'pointer',
                display: 'inline-block',
                borderRadius: '10px'
              }}
            >
              Seleccionar Libro de Excel
            </label>
            <input 
              id="excel-upload"
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }}
            />
            <span style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tipos permitidos: Microsoft Excel (.xlsx, .xls)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}