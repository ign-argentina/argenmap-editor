import React, { useState } from 'react';
import './LoginModal.css';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const API_URL = "http://localhost:3001"

function LoginModal({ onClose, onLoginSuccess }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser(); // Context

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password }, {
                withCredentials: true,
            });

            if (res.status === 200) {
                console.log(res.data)
                login(res.data) // Cargamos los datos de usuario en el contexto
                onLoginSuccess()
                alert("Bienvenido " + res.data.name)
            }
            return res.data
        } catch (error) {
            console.error('Error en login:', error.response?.data || error.message);
        }
    };

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