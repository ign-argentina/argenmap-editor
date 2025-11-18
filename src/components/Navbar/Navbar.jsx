import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "/src/context/UserContext";
import { useToast } from "../../context/ToastContext";
import LoginModal from "../LoginModal/LoginModal";
import CreateModal from "../CreateModal/CreateModal";
import ProfileModal from "../ProfileModal/ProfileModal";
import "./Navbar.css";

function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { isAuth, superAdmin, groupAdmin, logout, checkAuth, user, isAuthLoading } = useUser();

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast()

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsReady(true);
    };
    initAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
  };

  const handleLoginSuccess = async () => {
    await checkAuth();
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = () => {
    checkAuth();
    setShowRegisterModal(false);
  };

  if (isAuthLoading || !isReady || (isAuth && !user)) return null

  return (
    <header>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showRegisterModal && (
        <CreateModal
          type="user"
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
      {isAuth && showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      <nav className="navbar">
        <div className="logo">
          <img
            src="https://static.ign.gob.ar/img/logo/ign/logo_IGN_blanco_sinTexto.svg"
            alt="Logo IGN"
          />
        </div>

        <div className="nav-links">
          <NavLink
            to="/info"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <i className="fa-solid fa-circle-info"></i>
          </NavLink>

          <NavLink
            to="/visores"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <i className="fa-solid fa-house"></i> Gestor
          </NavLink>

          {!isAuth ? (
            <>
              <button
                className="nav-button"
                onClick={() => setShowLoginModal(true)}
                title="Iniciar Sesión"
              >
                <i className="fa-solid fa-right-from-bracket"></i> Iniciar Sesión
              </button>
              <button
                className="nav-button"
                onClick={() => setShowRegisterModal(true)}
                title="Registrarse"
              >
                <i className="fa-solid fa-user-plus"></i>
              </button>
            </>
          ) : (
            <div className="navbar-dropdown" ref={dropdownRef}>
              <button
                className="nav-button profile-button"
                onClick={() => setShowDropdown((prev) => !prev)}
                title="Opciones de usuario"
              >
                <i className="fa-solid fa-user"></i> {user?.name}{" "}
                <i className="fa-solid fa-caret-down"></i>
              </button>

              {showDropdown && (
                <div className="navbar-dropdown-menu">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    <i className="fa-solid fa-id-badge"></i> Perfil
                  </button>

                  {(groupAdmin || superAdmin) && (
                    <button
                      onClick={() => {
                        navigate("/management");
                        setShowDropdown(false);
                      }}
                    >
                      <i className="fa-solid fa-people-group"></i> Mis Grupos
                    </button>
                  )}

                  {superAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setShowDropdown(false);
                      }}
                    >
                      <i className="fa-solid fa-screwdriver-wrench"></i> Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    title="Cerrar Sesión"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
