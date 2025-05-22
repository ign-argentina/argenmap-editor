import { useState, useEffect } from 'react';
import './ProfileModal.css';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import ProfileUpdateForm from './ProfileUpdateForm';

function ProfileModal({ onClose }) {
  const { user } = useUser();

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showChangePasswordForm, setChangePasswordForm] = useState(false);

  const showForm = (form) => {
    if (form === 0) {
      setShowUpdateForm(!showUpdateForm);
      setChangePasswordForm(false);
    } else if (form === 1) {
      setChangePasswordForm(!showChangePasswordForm);
      setShowUpdateForm(false);
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
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h1>Perfil de Usuario</h1>
          <div className="profile-body">
            <div className="profile-data">
              <h2>Datos Personales</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Apellido:</strong> {user.lastname}</p>
            </div>

            <div className="profile-actions">
              <h2>Acciones</h2>
              <button onClick={() => showForm(0)}>Modificar Datos</button>
              <button onClick={() => showForm(1)}>Cambiar Contraseña</button>
            </div>

          </div>
        </div>
        <div className="profile-form">
          {showUpdateForm && <ProfileUpdateForm personalData={true} />}
          {showChangePasswordForm && <ProfileUpdateForm personalData={false} />}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
