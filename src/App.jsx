import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import AdminLayout from './layouts/AdminLayout';

// Vistas
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import CrearUsuarios from './views/CrearUsuarios';
import RegistrarBienes from './views/RegistrarBienes';
import CargarDatos from './views/CargarDatos';
import ConsultarBienes from './views/ConsultarBienes';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal*/}
        <Route path="/" element={<Login />} />
        
        {/* Rutas de Administrador*/}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crear-usuarios" element={<CrearUsuarios />} />
          <Route path="/registrar-bienes" element={<RegistrarBienes />} />
          <Route path="/cargar-datos" element={<CargarDatos />} />
          <Route path="/consultar-bienes" element={<ConsultarBienes />} />
        </Route>
      </Routes>
    </Router>
  );
}