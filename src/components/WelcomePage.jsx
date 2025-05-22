import React, { useEffect, useState } from 'react';
import SaveVisorModal from './SaveVisorModal';
import Preview from './Preview';
import { getVisorById, saveVisor } from '../api/configApi';
import { fetchVisores } from '../utils/FetchVisors';
import './WelcomePage.css'; // Asegurate de incluir los estilos de VisorManagerModal aquí
import { updateVisorConfigJson } from '../utils/visorStorage';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const [isVisorManagerVisible, setIsVisorManagerVisible] = useState(false);
  const [visores, setVisores] = useState([]);
  const [selectedVisor, setSelectedVisor] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleLoadVisor = (visorCompleto) => {
    const configJson = typeof visorCompleto.config.json === 'string'
      ? JSON.parse(visorCompleto.config.json)
      : visorCompleto.config.json;

    visorCompleto.config.json = configJson;
    localStorage.setItem('visorMetadata', JSON.stringify(visorCompleto));
    // Asegúrate de definir estas funciones globalmente o importarlas si no están declaradas
    updateVisorConfigJson(configJson);

    //INVESTIGAR SI ESTO ESTA DE MAS 
    // setLoadedVisor(visorCompleto);
    // setData(configJson);
    // uploadSchema(configJson);
  };

  useEffect(() => {
    if (isVisorManagerVisible) {
      fetchVisores(setVisores);
    }
  }, [isVisorManagerVisible]);

  return (
    <div className="welcome-screen-container">
      <div className="welcome-screen">
        {!isVisorManagerVisible ? (
          <div className="welcome-screen-modal">
            <h2>BIENVENIDO AL EDITOR ARGENMAP</h2>
            <p>
              Esta app hace esto y lo otro. También hace eso. Pero lo otro no. Y también algunas cosas.
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
                      onClick={() => setSelectedVisor(visor)}
                    >
                      {visor.img && <img src={visor.img} alt="img" className="visor-image" />}
                      <div className="visor-info">
                        <h3>{visor.name}</h3>
                        <p>{visor.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="visor-modal-actions">
                <button className="vmanager-button">Nuevo Visor</button>
                <button
                  className="vmanager-button"
                  onClick={() => setShowPreview(true)}
                  disabled={!selectedVisor}
                >
                  Visualizar
                </button>
                <button
                  className="vmanager-button"
                  onClick={async () => {
                    if (!selectedVisor) return;
                    try {
                      const visorCompleto = await getVisorById(selectedVisor.id);
                      navigate('/editor')
                      handleLoadVisor(visorCompleto);
                      // setIsVisorManagerVisible(false);
                      // console.log("Llegué")
                    } catch (err) {
                      console.error('Error al cargar visor:', err);
                      alert('No se pudo cargar el visor');
                    }
                  }}
                  disabled={!selectedVisor}
                >
                  Editar Visor
                </button>



                <button className="vmanager-button" onClick={() => setShowSaveModal(true)}>
                  Guardar Visor
                </button>
                <button className="download-button">Descargar</button>
                <button className="vmanager-button" onClick={() => setIsVisorManagerVisible(false)}>
                  Cerrar
                </button>
              </div>
            </div>

            {showSaveModal && (
              <SaveVisorModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={({ name, description }) => {
                  const currentJson = localStorage.getItem('visorConfig'); // O como lo estés manejando
                  if (!currentJson) {
                    alert('No hay configuración para guardar');
                    return;
                  }

                  saveVisor({ name, description, json: JSON.parse(currentJson) })
                    .then(() => {
                      alert('Visor guardado correctamente');
                      setShowSaveModal(false);
                      fetchVisores(setVisores);
                    })
                    .catch((err) => {
                      console.error('Error al guardar visor:', err);
                      alert('Error al guardar visor');
                    });
                }}
              />
            )}
          </div>
        )}
      </div>

      {showPreview && (
        <div style={{ width: '100%', height: '500px', marginTop: '20px' }}>
          <Preview />
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
