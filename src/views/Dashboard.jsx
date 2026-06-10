// src/views/Dashboard.jsx
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [rol, setRol] = useState('');

  useEffect(() => {
    setRol(localStorage.getItem('rol') || 'Estudiante');
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h2>Panel del {rol}</h2>
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="stats-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="stat-card">
              <span>{rol === 'Administrador' ? 'Bienes Registrados' : 'Bienes Asignados'}</span>
              <strong>{rol === 'Administrador' ? '10' : '4'}</strong>
            </div>
            <div className="stat-card">
              <span>Total Unidades (PCS)</span>
              <strong>{rol === 'Administrador' ? '45' : '4'}</strong>
            </div>
          </div>

          <div className="view-card">
            <h3>{rol === 'Administrador' ? 'Últimos Movimientos en Laboratorios' : 'Mis Bienes Asignados'}</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>SIL-001</strong></td>
                    <td>Silla ergonómica office</td>
                    <td>Sala 1</td>
                    <td className="status-active">Disponible</td>
                  </tr>
                  <tr>
                    <td><strong>MES-010</strong></td>
                    <td>Mesa de trabajo modular</td>
                    <td>Sala 3</td>
                    <td className="status-active">Disponible</td>
                  </tr>
                  <tr>
                    <td><strong>TAB-005</strong></td>
                    <td>Taburete laboratorio</td>
                    <td>Laboratorio 1</td>
                    <td className="status-active">Disponible</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="side-col">
          <div className="profile-card">
            <div style={{width:'80px', height:'80px', background:'#006b3a', borderRadius:'50%', margin:'0 auto 15px', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px', fontWeight:'bold'}}>E</div>
            <h3>Universidad</h3>
            <p>Portal Institucional</p>
            <span style={{display: 'block', marginTop: '15px', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
              Sesión activa: {rol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}