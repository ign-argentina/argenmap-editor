import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "/src/context/UserContext";
import LoginModal from "../LoginModal/LoginModal"
import RegisterModal from "../RegisterModal/RegisterModal"
import ProfileModal from "../ProfileModal/ProfileModal";
import './Navbar.css'

function Navbar() {

  useEffect(() => {
    checkAuth();
  }, []);


  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { isAuth, superAdmin, groupAdmin, logout, loadingUser, checkAuth, user } = useUser();

  const handleLogout = async () => {
    await logout()
  }

  const handleLoginSuccess = () => {
    checkAuth()
    setShowLoginModal(false)
  }

  const handleRegisterSuccess = () => {
    checkAuth()
    setShowRegisterModal(false)
  }

  if (loadingUser) {
    return null;
  }

  return (
    <header>
      {showLoginModal ? (<LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />) : null}
      {showRegisterModal ? (<RegisterModal onClose={() => setShowRegisterModal(false)} onRegisterSuccess={handleRegisterSuccess} />) : null}
      {(isAuth && showProfileModal) ? (<ProfileModal onClose={() => setShowProfileModal(false)} />) : null}
      <nav className="navbar">
        <div className="logo">
          <img src="https://static.ign.gob.ar/img/logo/ign/logo_IGN_blanco_sinTexto.svg" alt="Logo IGN" />
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : undefined)}>
          <i className="fa-solid fa-house"></i> Home
          </NavLink>

          {superAdmin  ? (<> <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "active" : undefined)}>
            <i className="fa-solid fa-screwdriver-wrench"></i> Admin Dashboard
          </NavLink></>) : null}
          {groupAdmin  ? (<> <NavLink to="/management" className={({ isActive }) => (isActive ? "active" : undefined)}>
            <i className="fa-solid fa-people-group"></i>Administrar Grupos
          </NavLink></>) : null}

          {!isAuth ? (
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
                <i className="fa-solid fa-user"></i> {user.name}
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