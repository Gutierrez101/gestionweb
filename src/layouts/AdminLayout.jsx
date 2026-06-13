import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
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
          <li><Link to="/dashboard">Inicio</Link></li>
          <li><Link to="/crear-usuarios">👤 Crear Usuarios</Link></li>
          <li><Link to="/registrar-bienes">📦 Registrar Bienes</Link></li>
          <li><Link to="/administrar-bienes">🛠️ Administrar Bienes</Link></li>
          <li><Link to="/cargar-datos">📂 Cargar Datos</Link></li>
          <li><Link to="/consultar-bienes">🔍 Consultar Bienes</Link></li>
        </ul>

        <button className="btn-logout" onClick={handleLogout}>
          🚪 Salir
        </button>
      </aside>

      <main className="main-content">
        {/* Aquí se renderizarán las vistas seleccionadas */}
        <Outlet /> 
      </main>
    </div>
  );
}