import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangelogModal from "../ChangelogModal/ChangelogModal";
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const [skipWelcome, setSkipWelcome] = useState(
    localStorage.getItem('skipWelcome') === 'true'
  );

  return (
    <div className="welcome-screen">

      <div className="welcome-content">
        <div className="welcome-screen-modal">
          <h2>BIENVENIDO AL EDITOR ARGENMAP</h2>
          <p>
            Crea, edita y comparte visores basados en Argenmap.
          </p>
          <button className="welcome-page-button" onClick={() => navigate('/visores')}>
            <i className="fa-solid fa-eye"></i> COMENZAR
          </button>
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
            No volver a mostrar
          </label>
        </div>
        </div>
        <div>
          <ChangelogModal />
        </div>

      </div>

    </div>
  );
};

export default WelcomePage;
