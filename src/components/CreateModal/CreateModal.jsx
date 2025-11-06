import React, { useState } from 'react';
import './CreateModal.css';
import { registerUser } from '../../api/auth';
// import { createGroup } from '../../api/groups';
import { useUser } from '/src/context/UserContext';
import { useToast } from '../../context/ToastContext';

function CreateModal({ type = "user", onClose, onSuccess }) {
  const { login } = useUser();
  const { showToast } = useToast();

  // Campos para ambos casos
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [admin, setAdmin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (type === "user") {
        res = await registerUser(name, lastname, email, password);
        if (res) {
          showToast("Usuario creado correctamente!", "success");
/*           onSuccess?.(); */
        }
      } else if (type === "group") {
        // res = await createGroup({
        //   name,
        //   description,
        //   admin
        // });
        // if (res) {
        //   showToast("Grupo creado correctamente!", "success");
        //   onSuccess?.();
        // }
      }

      onClose();
    } catch (error) {
      showToast(error.response?.data || error.message, "warning");
    }
  };

  return (
    <div className="register-overlay" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{type === "user" ? "Nuevo Usuario" : "Nuevo Grupo"}</h2>
        <form className="form-register" onSubmit={handleSubmit}>
          
          {/* Campos comunes según tipo */}
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {type === "user" && (
            <>
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
            </>
          )}

          {type === "group" && (
            <>
              <textarea
                type="text"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Administrador"
                value={admin}
                onChange={(e) => setAdmin(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit">
            {type === "user" ? "Crear Usuario" : "Crear Grupo"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateModal;