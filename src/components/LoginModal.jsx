import React, { useState } from 'react';
import './LoginModal.css';
import axios from 'axios';

const API_URL = "http://localhost:3001"

function LoginModal({ onClose }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password }, {
                withCredentials: true,
            });


            alert("Bienvenido " + res.data.name)
            window.location.reload();
            return res.data
        } catch (error) {
            console.error('Error en login:', error.response?.data || error.message);
            throw error;
        }
    };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" >
                <h2>Iniciar sesión</h2>
                <form onSubmit={handleSubmit}>
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