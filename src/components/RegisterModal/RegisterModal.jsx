import React, { useState } from 'react';
import './RegisterModal.css';
import { registerUser } from '../../api/configApi';
import { useUser } from '/src/context/UserContext';
import { useToast } from '../../context/ToastContext';

function RegisterModal({ onClose, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser()
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(name, lastname, email, password);

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
    </div>
  );
}

export default RegisterModal;
