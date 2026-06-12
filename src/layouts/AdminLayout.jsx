// src/layouts/AdminLayout.jsx
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const rol = localStorage.getItem('rol') || 'Estudiante'; // Por defecto Usuario

  const handleLogout = () => {
    localStorage.removeItem('rol');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Gestion Bienes</h3>
          <small>{rol}</small>
        </div>
        
        <ul className="sidebar-menu">
          <li><Link to="/dashboard" className={isActive('/dashboard')}>📊 Dashboard</Link></li>
          
          {rol === 'Administrador' && (
            <>
              <li><Link to="/crear-usuarios" className={isActive('/crear-usuarios')}>👤 Crear Usuarios</Link></li>
              <li><Link to="/registrar-bienes" className={isActive('/registrar-bienes')}>📦 Registrar Bienes</Link></li>
              <li><Link to="/cargar-datos" className={isActive('/cargar-datos')}>📂 Cargar Datos</Link></li>
            </>
          )}

          {rol === 'Estudiante' && (
            <li><Link to="/consultar-bienes" className={isActive('/consultar-bienes')}>🔍 Consultar Bienes</Link></li>
          )}
        </ul>

        <button className="btn-logout" onClick={handleLogout}>
          🚪 Salir
        </button>
      </aside>

      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
}