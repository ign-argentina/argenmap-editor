import { useState, useEffect } from 'react';
import './LoginModal.css';
import axios from 'axios';
import { useUser } from '/src/context/UserContext';

function LoginModal({ onClose, onLoginSuccess }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result === 200) {
      onLoginSuccess(); //cerrar modal
      alert("Bienvenido " + user.name);
    } else {
      alert("Error en login: ");
    }
  };
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()} >
        <h2>Iniciar sesión</h2>
        <form className="form-login" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;