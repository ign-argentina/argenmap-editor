import { useState } from 'react';
import './ProfileModal.css';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import ProfileUpdateForm from './ProfileUpdateForm';

const API_URL = "http://localhost:3001";

function ProfileModal({ onClose, onPasswordChange }) {
    const [password, setPassword] = useState('');
    const { user } = useUser()

    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [showChangePasswordForm, setChangePasswordForm] = useState(false)

    const showForm = (form) => {

        if (form === 0) {
            setShowUpdateForm(!showUpdateForm)
            setChangePasswordForm(false)
        } else if (form === 1){
            setChangePasswordForm(!showChangePasswordForm)
            setShowUpdateForm(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_URL}/auth/change-password`, {
                email: user?.email,
                password
            }, {
                withCredentials: true,
            });

            if (res.status === 200) {
                onPasswordChange();
                alert("Contraseña actualizada correctamente!");
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error.response?.data || error.message);
            alert('Hubo un error al cambiar la contraseña.');
        }
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="profile-data">
                    <h2>Perfil de Usuario</h2>
                    Email: {user.email}<br /><br />
                    Nombre: {user.name}<br></br>
                    Apellido: {user.lastname}<br></br>
                </div>

                <div className="profile-actions">
                    <h2>Acciones</h2>

                    <button onClick={() => showForm(0)}>MODIFICAR DATOS</button>
                    <button onClick={() => showForm(1)}>CAMBIAR CONTRASEÑA</button>
                </div>

                <div className="profile-form">

                    {showUpdateForm ? <ProfileUpdateForm personalData={true} /> : null}
                    {showChangePasswordForm ? <ProfileUpdateForm personalData={false} /> : null}

                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
