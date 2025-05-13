import { useState, useEffect } from "react"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import axios from 'axios';
function LoginSection() {

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showProfileModal, setshowProfileModal] = useState(false);

    const [userAuth, setUserAuth] = useState(false);


    const handleLogout = async () => {
        await axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true, })
        setUserAuth(false)
    }

    const handleLoginSuccess = () => {
        setUserAuth(true)
        setShowLoginModal(false)
    }

    const handleRegisterSuccess = () => {
        setUserAuth(true)
        setShowRegisterModal(false)
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/auth/check`, {
                    withCredentials: true,
                });
                setUserAuth(res.data); // Podés guardar esto en un state, por ejemplo
            } catch (error) {
                setUserAuth(false)
            }
        };

        checkAuth();


    }, []);


    return (
        <>
            {showLoginModal ? (<LoginModal onLoginSuccess={handleLoginSuccess}/>) : null}
            {showRegisterModal ? (<RegisterModal onRegisterSuccess={handleRegisterSuccess} />) : null}

            {!userAuth ? (
                <div id="authContainer">
                    <button onClick={() => setShowLoginModal(true)} title="Iniciar Sesión">
                        <i className="fa-solid fa-hand"></i> Iniciar Sesión
                    </button>
                    <button onClick={() => setShowRegisterModal(true)} title="Registrarse">
                        <i className="fa-solid fa-plus"></i> Registrarse
                    </button>
                </div>
            ) : (
                <div id="authContainer">
                    <button onClick={() => setshowProfileModal(true)} title="Perfil">
                        <i className="fa-solid fa-person"></i> Perfil
                    </button>

                    <button onClick={handleLogout} title="Cerrar Sesion">
                        <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesion
                    </button>
                </div>
            )}
        </>
    )
}

export default LoginSection