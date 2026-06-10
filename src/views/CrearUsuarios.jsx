// src/views/CrearUsuarios.jsx
import { useState } from 'react';

export default function CrearUsuarios() {
  const [usuario, setUsuario] = useState({ nombre: '', email: '', rol: 'Usuario' });

  const handleCrear = (e) => {
    e.preventDefault();
    alert(`Usuario ${usuario.nombre} creado correctamente.`);
    setUsuario({ nombre: '', email: '', rol: 'Usuario' });
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>Administración de Usuarios</h2>
      </div>

      <div className="view-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3>Crear Nueva Cuenta</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px' }}>
          Complete los campos para registrar un nuevo perfil de acceso al sistema de gestión de laboratorios.
        </p>

        <form onSubmit={handleCrear}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              value={usuario.nombre} 
              onChange={(e) => setUsuario({...usuario, nombre: e.target.value})} 
              placeholder="Ej: Juan Pérez"
              required 
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico Institucional</label>
            <input 
              type="email" 
              value={usuario.email} 
              onChange={(e) => setUsuario({...usuario, email: e.target.value})} 
              placeholder="ejemplo@espe.edu.ec"
              required 
            />
          </div>

          <div className="form-group">
            <label>Rol de Sistema</label>
            <select 
              value={usuario.rol} 
              onChange={(e) => setUsuario({...usuario, rol: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'inherit',
                backgroundColor: 'var(--white)',
                color: 'var(--text-dark)'
              }}
            >
              <option value="Usuario">Usuario (Docente asignado)</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Registrar Cuenta
          </button>
        </form>
      </div>
    </div>
  );
}