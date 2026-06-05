import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && password === 'admin123') {
      setError('');
      navigate('/dashboard'); 
    } else {
      setError('Credenciales incorrectas. Solo acceso para administrador.');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        
        <div className="form-group">
          <label>Usuario:</label>
          <input 
            type="text" 
            value={usuario} 
            onChange={(e) => setUsuario(e.target.value)} 
            placeholder="Ingrese usuario"
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Ingrese contraseña"
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button type="submit" className="btn-primary">Ingresar</button>
      </form>
    </div>
  );
}