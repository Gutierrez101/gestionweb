import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Menú Lateral */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Gestión Lab</h3>
          <small>Administrador</small>
        </div>
        
        <ul className="sidebar-menu">
          <li><Link to="/dashboard">Inicio</Link></li>
          <li><Link to="/crear-usuarios">👤 Crear Usuarios</Link></li>
          <li><Link to="/registrar-bienes">📦 Registrar Bienes</Link></li>
          <li><Link to="/cargar-datos">📂 Cargar Datos</Link></li>
          <li><Link to="/consultar-bienes">🔍 Consultar Bienes</Link></li>
        </ul>

        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </aside>

      {/* Área de Contenido Dinámico */}
      <main className="main-content">
        {/* Aquí se renderizarán las vistas seleccionadas */}
        <Outlet /> 
      </main>
    </div>
  );
}