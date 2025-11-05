import { useState, useEffect } from "react"
import LoginModal from "./LoginModal"
import RegisterModal from "../RegisterModal"
import ProfileModal from "../ProfileModal/ProfileModal";
import { useUser } from "../../context/UserContext";
import './LoginSection.css';
import { userCheckAuth } from "../../api/auth";

function LoginSection() {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [userAuth, setUserAuth] = useState(false);

  const { logout } = useUser()


  const handleLogout = async () => {
    setUserAuth(false)
    logout()
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
        const res = await userCheckAuth()
        setUserAuth(res.data);
      } catch (error) {
        setUserAuth(false)
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      {showLoginModal ? (<LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />) : null}
      {showRegisterModal ? (<RegisterModal onClose={() => setShowRegisterModal(false)} onRegisterSuccess={handleRegisterSuccess} />) : null}
      {(userAuth && showProfileModal) ? (<ProfileModal onClose={() => setShowProfileModal(false)} />) : null}

      {!userAuth ? (
        <div id="authContainer">
          <button className="login-button" onClick={() => setShowLoginModal(true)} title="Iniciar Sesión">
            <i className="fa-solid fa-hand"></i> Iniciar Sesión
          </button>
          <button className="login-button" onClick={() => setShowRegisterModal(true)} title="Registrarse">
            <i className="fa-solid fa-plus"></i> Registrarse
          </button>
        </div>
      ) : (
        <div id="authContainer">
          <button className="login-button" onClick={() => setShowProfileModal(true)} title="Perfil">
            <i className="fa-solid fa-person"></i> Perfil
          </button>

          <button className="login-button" onClick={handleLogout} title="Cerrar Sesion">
            <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesion
          </button>
        </div>
      )}
    </>
  )
}

export default LoginSection