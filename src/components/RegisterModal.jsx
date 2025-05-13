import React, { useState } from 'react';
import './RegisterModal.css';
import axios from 'axios';

const API_URL = "http://localhost:3001"

function RegisterModal({ onClose, onRegisterSuccess }) {

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_URL}/auth/register`, { name, lastname, email, password }, {
                withCredentials: true,
            });

            if (res.status === 201) {
                onRegisterSuccess()
                alert("Usuario creado correcamente!")
            }

            return res.data
        } catch (error) {
            console.error('Error en login:', error.response?.data || error.message);
            throw error;
        }
    };

    return (
        <div className="register-overlay" onClick={onClose}>
            <div className="register-modal" onClick={(e) => e.stopPropagation()} >
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    /> <br />
                    <input
                        type="text"
                        placeholder="Apellido"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    /> <br />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /><br />
                    <button type="submit">Registrarse</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterModal;