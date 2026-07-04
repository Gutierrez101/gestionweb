import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5051/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        // Guardamos el token en localStorage
        localStorage.setItem('token', data.token || data.Token); 
        const rol = email.includes('admin') ? 'Administrador' : 'Docente';
        localStorage.setItem('rol', rol);

        setError('');
        if(rol==='Administrador'){
          navigate('/dashboard'); 
        } else{
          navigate('/consultar-bienes');
        }
      } else {
        setError('Credenciales incorrectas o usuario no registrado.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="error-msg">{error}</div>}
        <button type="submit" className="btn-primary">Ingresar</button>
      </form>
    </div>
  );
}