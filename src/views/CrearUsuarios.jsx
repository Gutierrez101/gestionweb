import { useState } from 'react';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051/api';
//const API_URL = 'http://localhost:5051/api';
const API_URL = 'http://192.168.0.100:80/api';

export default function CrearUsuarios() {
  const [usuario, setUsuario] = useState({ cedula: '', nombre: '', email: '', password: '' });

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(usuario)
      });

      if (res.ok) {
        alert(`Usuario ${usuario.nombre} creado correctamente en BD.`);
        setUsuario({ cedula: '', nombre: '', email: '', password: '' });
      } else {
        alert('Error al crear el usuario. Verifica los datos.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con la API.');
    }
  };

  return (
    <div className="view-card">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Gestión</span>
          <h2>Administración de Usuarios</h2>
          <p>Registro de nuevo personal docente</p>
        </div>
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleCrear}>
          <div className="form-group"><label>Cédula</label><input type="text" value={usuario.cedula} onChange={(e) => setUsuario({...usuario, cedula: e.target.value})} required /></div>
          <div className="form-group"><label>Nombre Completo</label><input type="text" value={usuario.nombre} onChange={(e) => setUsuario({...usuario, nombre: e.target.value})} required /></div>
          <div className="form-group"><label>Correo Electrónico</label><input type="email" value={usuario.email} onChange={(e) => setUsuario({...usuario, email: e.target.value})} required /></div>
          <div className="form-group"><label>Contraseña Temporal</label><input type="password" value={usuario.password} onChange={(e) => setUsuario({...usuario, password: e.target.value})} required /></div>
          <button type="submit" className="btn-primary">Registrar Cuenta Segura</button>
        </form>
      </div>
    </div>
  );
}