import { useState } from 'react';
import VisorManagerModal from './VisorManagerModal';
import './WelcomePage.css';

const WelcomePage = () => {
  const [isVisorManagerVisible, setIsVisorManagerVisible] = useState(false);

  const handleLoadVisor = (visorCompleto) => {
    const configJson = typeof visorCompleto.config.json === 'string'
      ? JSON.parse(visorCompleto.config.json)
      : visorCompleto.config.json;

    visorCompleto.config.json = configJson;
    localStorage.setItem('visorMetadata', JSON.stringify(visorCompleto));
    updateVisorConfigJson(configJson);
    setLoadedVisor(visorCompleto);
    setData(configJson);
    uploadSchema(configJson);
  };

  return (
    <div className="welcome-screen">
      {isVisorManagerVisible ? (
        <div className="embedded-visor-manager">
          <VisorManagerModal
            isOpen={true} // seguir usándolo para cargar visores al montarse
            onClose={() => setIsVisorManagerVisible(false)}
            onLoad={handleLoadVisor}
          />
        </div>
      ) : (
        <div className="welcome-screen-modal">
          <h2>BIENVENIDO AL EDITOR ARGENMAP</h2>
          <p>
            Esta app hace esto y lo otro. Tambien hace eso. Pero lo otro no.
            Y tambien algunas cosas.
          </p>
          <p style={{ marginTop: '20px' }}>Para ver los visores, entre aquí:</p>

          <button
            className="visor-manager-button"
            onClick={() => setIsVisorManagerVisible(true)}
          >
            <i className="fa-solid fa-eye"></i> Visor Manager
          </button>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
