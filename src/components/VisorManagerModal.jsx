import React, { useEffect, useState } from 'react';
import SaveVisorModal from './SaveVisorModal';
import { getVisorById, saveVisor } from '../api/configApi'
import { fetchVisores } from '../utils/FetchVisors';
import './VisorManagerModal.css';


const VisorManagerModal = ({ isOpen, onClose, onLoad, currentJson }) => {
  const [visores, setVisores] = useState([]);
  const [selectedVisor, setSelectedVisor] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);


  useEffect(() => {
    if (isOpen) {
      fetchVisores(setVisores);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
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
          <button className="vmanager-button" >Nuevo Visor</button>
          <button className="vmanager-button" onClick={() => setShowPreview(true)}>Abrir</button>

          <button
            className="vmanager-button"
            onClick={async () => {
              if (!selectedVisor) return;
              try {
                const visorCompleto = await getVisorById(selectedVisor.id);
                onLoad(visorCompleto);
                onClose();
              } catch (err) {
                console.error('Error al cargar visor:', err);
                alert('No se pudo cargar el visor');
              }
            }}
            disabled={!selectedVisor}
          >
            Editar Visor
          </button>
          <button className="vmanager-button" onClick={() => setShowSaveModal(true)}>Guardar Visor</button>
          <button className="download-button" >Descargar</button>
          <button className="vmanager-button" onClick={onClose}>Cerrar</button>
        </div>
      </div>

      {showSaveModal && (
        <SaveVisorModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={({ name, description }) => {
            if (!currentJson) {
              alert('No hay configuración para guardar');
              return;
            }

            saveVisor({ name, description, json: currentJson })
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
  );
};


export default VisorManagerModal;
