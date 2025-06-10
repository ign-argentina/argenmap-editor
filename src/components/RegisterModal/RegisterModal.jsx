import React, { useState } from 'react';
import './RegisterModal.css';
import axios from 'axios';
import { useUser } from '/src/context/UserContext';
import Toast from '../Toast/Toast';


const API_URL = "http://localhost:3001";

function RegisterModal({ onClose, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser()
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        lastname,
        email,
        password
      }, { withCredentials: true });

      if (res.status === 201) {
        login(email, password)
        onRegisterSuccess();
        showToast("Usuario creado correctamente!", "success");
      }
    } catch (error) {
      console.error('Error en registro:', error.response?.data || error.message);
      showToast('Error en registro: ' + error, "error");
    }
  };



  return (
    <div className="register-overlay" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Nuevo Usuario</h2>
        <form className="form-register" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
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
          <button type="submit">Registrarse</button>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default RegisterModal;
