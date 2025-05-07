import React, { useEffect, useState } from 'react';
import SaveVisorModal from './SaveVisorModal';
import './VisorManagerModal.css';
import { getAllVisors, saveVisor } from '../api/configApi'

const VisorManagerModal = ({ isOpen, onClose, onLoad, currentJson }) => {
  const [visores, setVisores] = useState([]);
  const [selectedVisor, setSelectedVisor] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getAllVisors()
        .then((data) => {
          setVisores(data); // directamente seteás lo que devuelve .json()
        })
        .catch((err) => console.error('Error al obtener visores:', err));
    }
  }, [isOpen]);


  const handleSave = async ({ name, description }) => {
    try {
      const response = await fetch('http://localhost:3001/api/visores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          json: JSON.stringify(currentJson),
        }),
      });

      if (!response.ok) throw new Error('Error al guardar visor');
      setShowSaveModal(false);
      alert('Plantilla guardada correctamente');
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al guardar');
    }
  };

  return (
    isOpen && (
      <div className="visor-modal-backdrop">
        <div className="visor-modal">
          <h2>Visor Manager</h2>
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
          <div className="visor-modal-actions">
            <button onClick={() => onLoad(selectedVisor)} disabled={!selectedVisor}>
              CARGAR EN EDITOR
            </button>
            <button onClick={() => setShowSaveModal(true)}>Guardar Visor</button>
            <button onClick={() => alert('Crear grupo (próximamente)')}>Crear Grupo</button>
            <button onClick={onClose}>Cerrar</button>
          </div>

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
                })
                .catch((err) => {
                  console.error('Error al guardar visor:', err);
                  alert('Error al guardar visor');
                });
            }}
          />

        </div>
      </div>
    )
  );
};

export default VisorManagerModal;
