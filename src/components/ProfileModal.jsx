import React, { useState } from 'react';
import './ProfileModal.css';
import axios from 'axios';

const API_URL = "http://localhost:3001";

function ProfileModal({ onClose, userData, onPasswordChange }) {
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_URL}/auth/change-password`, {
                email: userData?.email,
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
                <h2>Perfil de Usuario</h2>
                <form className="form-profile" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={userData?.email}
                        disabled
                    /><br />
                    <input
                        type="text"
                        value={userData?.name}
                        disabled
                    /><br />
                    <input
                        type="text"
                        value={userData?.lastname}
                        disabled
                    /><br />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /><br />
                    <button type="submit">Cambiar Contraseña</button>
                    <button type="submit">Actualizar Datos</button>
                </form>
            </div>
        </div>
    );
}

export default ProfileModal;
