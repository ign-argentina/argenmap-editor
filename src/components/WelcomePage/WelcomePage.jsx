import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChangelogModal from "../ChangelogModal/ChangelogModal";
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">

      <div className="welcome-content">
        <div className="welcome-screen-modal">
          <h2>BIENVENIDO AL EDITOR ARGENMAP</h2>
          <p>
            Un editor de archivos JSON fácil de usar para facilitar la creación, edición y validación de la configuración del visor Argenmap.
          </p>
          <p style={{ marginTop: '20px' }}>Para ver los visores, entre aquí:</p>
          <button className="visor-manager-button" onClick={() => navigate('/')}>
            <i className="fa-solid fa-eye"></i> Visor Manager
          </button>
        </div>

        <div>
          <ChangelogModal />
        </div>

      </div>

    </div>
  );
};

export default WelcomePage;
