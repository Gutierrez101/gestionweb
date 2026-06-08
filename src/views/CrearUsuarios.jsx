import { useState } from 'react';

export default function CrearUsuarios() {
  const [usuario, setUsuario] = useState({ nombre: '', email: '', rol: 'Usuario' });

  const handleCrear = (e) => {
    e.preventDefault();
    console.log("Usuario creado:", usuario);
    alert(`Usuario ${usuario.nombre} creado correctamente.`);
    setUsuario({ nombre: '', email: '', rol: 'Usuario' });
  };

  return (
    <div className="view-card">
      <h2>Crear Usuarios</h2>
      <form onSubmit={handleCrear}>
        <label>Nombre</label>
        <input type="text" value={usuario.nombre} onChange={(e) => setUsuario({...usuario, nombre: e.target.value})} required />
        
        <label>Email</label>
        <input type="email" value={usuario.email} onChange={(e) => setUsuario({...usuario, email: e.target.value})} required />
        
        <label>Rol</label>
        <select value={usuario.rol} onChange={(e) => setUsuario({...usuario, rol: e.target.value})}>
          <option value="Usuario">Usuario</option>
          <option value="Administrador">Administrador</option>
        </select>
        
        <button type="submit" className="btn-primary">Crear Cuenta</button>
      </form>
    </div>
  );
}