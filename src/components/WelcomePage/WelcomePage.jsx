import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangelogModal from "../ChangelogModal/ChangelogModal";
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const [skipWelcome, setSkipWelcome] = useState(
    localStorage.getItem('skipWelcome') === 'true'
  );

  const [showNovedades, setShowNovedades] = useState(false);

  return (
    <div className="welcome-screen">
      <div className="welcome-hero">
        <div className="hero-content">
          <div className="hero-logo">
            <div className="logo-icon">🗺️</div>
            <h1>Editor Argenmap</h1>
            <p className="hero-subtitle">Plataforma integral para la gestión de visores cartográficos</p>
            
            <div className="checkbox-container">
              <label className="checkbox-label">
                <input
                  className="welcome-checkbox"
                  type="checkbox"
                  checked={skipWelcome}
                  onChange={(e) => {
                    const value = e.target.checked;
                    setSkipWelcome(value);
                    localStorage.setItem('skipWelcome', value);
                  }}
                />
                <span className="checkmark"></span>
                No volver a mostrar esta página
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="welcome-main-content">
        {/* Welcome Message Section */}
        <div className="welcome-message-section">
          <div className="section-header">
            <h2>¿Qué te encontrás en esta app?</h2>
            <div className="header-decoration"></div>
          </div>
          
          <div className="welcome-description">
            <p className="intro-text">
              Argenmap Editor es una plataforma integral para la gestión, edición y despliegue de visores de mapas, 
              pensada para equipos, instituciones y usuarios que necesitan crear, personalizar y compartir visores de mapas 
              de manera sencilla y colaborativa.
            </p>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>¿Qué podés hacer?</h3>
                <ul>
                  <li>Gestionar visores de mapas Argenmap</li>
                  <li>Organizar proyectos por grupos de trabajo</li>
                  <li>Configurar capas, estilos y mapas base</li>
                  <li>Compartir visores de forma pública o privada</li>
                  <li>Colaborar con tu equipo de manera mas fácil</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">�</div>
                <h3>Para quién es útil</h3>
                <ul>
                  <li>Organismos públicos y privados</li>
                  <li>Equipos de desarrollo y SIG</li>
                  <li>Usuarios que buscan crear mapas interactivos</li>
                  <li>Instituciones que manejan información geográfica</li>
                </ul>
              </div>
            </div>

            <div className="welcome-actions">
              <button className="cta-button" onClick={() => { localStorage.setItem('skipWelcome', true); navigate('/visores')}}>
                <span>Comenzar a explorar</span>
                <span className="button-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Novedades Section */}
        <div className="novedades-section">
          <div className="novedades-toggle" onClick={() => setShowNovedades(!showNovedades)}>
            <h2>Novedades</h2>
            <span className={`novedades-indicator ${showNovedades ? 'expanded' : ''}`}>
              {showNovedades ? 'ocultar' : 'ver'}
            </span>
          </div>
          
          {showNovedades && (
            <div className="changelog-container">
              <ChangelogModal />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default WelcomePage;