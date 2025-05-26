import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleClearStorage } from '../utils/HandleClearStorage';
import { fetchVisores } from '../utils/FetchVisors';
import { updateVisorConfigJson } from '../utils/visorStorage';
import HandleDownload from '../utils/HandleDownload';
import { getVisorById } from '../api/configApi';
import useFormEngine from '../hooks/useFormEngine';
import Preview from './Preview';
import './WelcomePage.css';
import './Preview.css';
import { handleFileChange } from '../utils/HandleJsonUpload';

const WelcomePage = () => {
  const [isVisorManagerVisible, setIsVisorManagerVisible] = useState(false);
  const [visores, setVisores] = useState([]);
  const [selectedVisor, setSelectedVisor] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { setData, uploadSchema } = useFormEngine();

  const defaultData = localStorage.getItem('formDataDefault');
  const parsedDefaultData = JSON.parse(defaultData);

  const handleDownload = () => {
    if (!selectedVisor?.config?.json) {
      alert('No hay visor seleccionado con configuración válida');
      return;
    }

    const configJson = typeof selectedVisor.config.json === 'string'
      ? JSON.parse(selectedVisor.config.json)
      : selectedVisor.config.json;

    const { downloadJson } = HandleDownload({ data: configJson, parsedDefaultData });
    downloadJson();
  };

  const handleNewVisor = () => {
    handleClearStorage(setData, uploadSchema);
    navigate('/form');
  };

  const handleFileUpload = (event) => {
    handleFileChange(event, setData, uploadSchema);
    navigate('/form');
  };

  const handleLoadVisor = (visorCompleto) => {
    const configJson = typeof visorCompleto.config.json === 'string'
      ? JSON.parse(visorCompleto.config.json)
      : visorCompleto.config.json;

    visorCompleto.config.json = configJson;
    localStorage.setItem('visorMetadata', JSON.stringify(visorCompleto));
    updateVisorConfigJson(configJson);
  };

  useEffect(() => {
    if (isVisorManagerVisible) {
      fetchVisores(setVisores);
    }
  }, [isVisorManagerVisible]);

  return (
    <div className="welcome-screen-container">
      <div className={`welcome-screen ${showPreview ? 'flex-0' : 'flex-1'}`}>
        {!isVisorManagerVisible ? (
          <div className="welcome-screen-modal">
            <h2>BIENVENIDO AL EDITOR ARGENMAP</h2>
            <p>
              Un editor de archivos JSON fácil de usar para facilitar la creación, edición y validación de la configuración del visor Argenmap.
            </p>
            <p style={{ marginTop: '20px' }}>Para ver los visores, entre aquí:</p>
            <button className="visor-manager-button" onClick={() => setIsVisorManagerVisible(true)}>
              <i className="fa-solid fa-eye"></i> Visor Manager
            </button>
          </div>
        ) : (
          <div className="visor-modal">
            <h2>VISOR MANAGER</h2>
            <div className="visor-modal-container">
              <div className='visor-list-container'>
                <div className="visor-list">
                  {visores.map((visor) => (
                    <div
                      key={visor.id}
                      className={`visor-item ${selectedVisor?.id === visor.id ? 'selected' : ''}`}
                      onClick={async () => {
                        if (selectedVisor?.id === visor.id) {
                          setSelectedVisor(null);
                          setShowPreview(false);
                          return;
                        }
                        try {
                          const visorCompleto = await getVisorById(visor.id);
                          setSelectedVisor(visorCompleto);
                          setShowPreview(true);
                        } catch (error) {
                          console.error('Error al obtener visor completo:', error);
                          alert('No se pudo cargar el visor');
                        }
                      }}
                    >
                      <img
                        src={visor.img || '/assets/no-image.png'}
                        alt="img"
                        className="visor-image"
                      />
                      <div className="visor-info">
                        <h3>{visor.name}</h3>
                        <p>{visor.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="visor-modal-actions">
                <div className="global-buttons">
                  <div className="dropdown">
                    <button className="navbar">Nuevo Visor ▾</button>
                    <div className="dropdown-content">
                      <button className="navbar" onClick={handleNewVisor}>🆕 En Blanco</button>
                      <label className="vmanager-button">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                          title="Subir JSON"
                        />
                        <span className="icon">
                          <i className="fa-solid fa-upload" style={{ cursor: "pointer" }}></i>
                        </span>
                        Subir JSON
                      </label>
                    </div>
                  </div>

                  <button
                    className="navbar"
                    onClick={() => {
                      if (!selectedVisor) return;
                      handleLoadVisor(selectedVisor);
                      navigate('/form');
                    }}
                    disabled={!selectedVisor}
                  >
                    Editar Visor
                  </button>

                  <button className="download" onClick={handleDownload} title="Descargar JSON">
                    <span className="icon">
                      <i className="fa-solid fa-download"></i>
                    </span>
                    Descargar
                  </button>

                  <button
                    className="navbar"
                    onClick={() => {
                      setIsVisorManagerVisible(false);
                      setShowPreview(false);
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <div className='side-panel'>
          <Preview />
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
