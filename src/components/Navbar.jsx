import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import ProfileModal from "./ProfileModal";
import axios from 'axios';
import './Navbar.css'

function Navbar() {

  useEffect(() => {
    checkAuth();
  }, []);


  const [userAuth, setUserAuth] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { logout, setGroupAdmin, setSuperAdmin } = useUser()


  const checkAuth = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/auth/check`, {
        withCredentials: true,
      });
      setUserAuth(res.data);
      setIsGroupAdmin(res.data.isag)
      setIsSuperAdmin(res.data.isa)

      // Context Vars
      setGroupAdmin(res.data.isag)
      setSuperAdmin(res.data.isa)
    } catch (error) {
      setUserAuth(false)
      setIsGroupAdmin(false)
      setIsSuperAdmin(false)
      //Context Vars
      setGroupAdmin(false)
      setSuperAdmin(false)
    }
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true, })
    setUserAuth(false)
    setIsGroupAdmin(false)
    setIsSuperAdmin(false)
    logout() // Cerramos sesion. Podriamos para el proximo sprint refactorear y persistir mas en memoria estos datos ya que están a mano
  }

  const handleLoginSuccess = () => {
    checkAuth()
    setShowLoginModal(false)
  }

  const handleRegisterSuccess = () => {
    checkAuth()
    setShowRegisterModal(false)
  }

  return (
    <header>
      {showLoginModal ? (<LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />) : null}
      {showRegisterModal ? (<RegisterModal onClose={() => setShowRegisterModal(false)} onRegisterSuccess={handleRegisterSuccess} />) : null}
      {(userAuth && showProfileModal) ? (<ProfileModal onClose={() => setShowProfileModal(false)} />) : null}
      <nav className="navbar">
        <div className="logo">
          <img src="https://static.ign.gob.ar/img/logo/ign/logo_IGN_blanco_sinTexto.svg" alt="Logo IGN" />
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : undefined)}>Home</NavLink>
          <NavLink to="/editor" className={({ isActive }) => (isActive ? "active" : undefined)}>
            <i className="fa-solid fa-right-from-bracket"></i> Formulario
          </NavLink>

          {isSuperAdmin ? (<> <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "active" : undefined)}>
                              <i class="fa-solid fa-screwdriver-wrench"></i> Admin Dashboard
                              </NavLink></>) : null}
          {isGroupAdmin ? (<> <NavLink to="/management" className={({ isActive }) => (isActive ? "active" : undefined)}>
                              <i className="fa-solid fa-people-group"></i>Administrar Grupos
                              </NavLink></>) : null}

          {!userAuth ? (
            <>
              <button className="nav-button" onClick={() => setShowLoginModal(true)} title="Iniciar Sesión">
                <i className="fa-solid fa-right-from-bracket"></i>Iniciar Sesión
              </button>
              <button className="nav-button" onClick={() => setShowRegisterModal(true)} title="Registrarse">
                <i className="fa-solid fa-user-plus"></i> Registrarse
              </button>
            </>
          ) : (
            <>
              <button className="nav-button" onClick={() => setShowProfileModal(true)} title="Perfil">
                <i class="fa-solid fa-user"></i> Perfil
              </button>

              <button className="nav-button" onClick={handleLogout} title="Cerrar Sesion">
                <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesion
              </button>
            </>
          )}
        </div>

      </nav>
    </header >
  )
}

export default Navbar;