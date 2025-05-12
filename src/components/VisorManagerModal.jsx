import React, { useEffect, useState } from 'react';
import SaveVisorModal from './SaveVisorModal';
import { getConfigById, saveVisor } from '../api/configApi'
import { fetchVisores } from '../utils/FetchVisors';
import './VisorManagerModal.css';
import { useFormEngineContext } from '../context/FormEngineContext';

const VisorManagerModal = ({ isOpen, onClose, onLoad, currentJson }) => {
  const [visores, setVisores] = useState([]);
  const [selectedVisor, setSelectedVisor] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  // const { setData, uploadData } = useFormEngineContext();

  useEffect(() => {
    if (isOpen) {
      fetchVisores(setVisores);
    }
  }, [isOpen]);


  function preservarOrden(jsonOriginal) {
    if (!jsonOriginal || typeof jsonOriginal !== 'object') return jsonOriginal;

    // Convertimos el objeto en un array de pares clave-valor
    const entries = Object.entries(jsonOriginal);

    // Volvemos a ordenar las entradas (opcionalmente, pero generalmente lo dejamos igual)
    // Puedes aplicar alguna lógica extra de ordenamiento si es necesario.

    const ordenado = Object.fromEntries(entries);

    return ordenado;
  }


  return (
    isOpen && (
      <div className="visor-modal-backdrop">
        <div className="modal-wrapper">
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
                <button
                  className="vmanager-button"
                  onClick={async () => {
                    if (!selectedVisor) return;
                    try {
                      const config = await getConfigById(selectedVisor.cid); // obtené la config asociada
                      // localStorage.removeItem('formData');
                      console.log("VisorManagerConfig", config.json)

                      const configOrdenada = preservarOrden(config.json);
                      console.log("configOrdenada", configOrdenada)

                      onLoad(config);       // si querés también hacer algo más con el visor
                      onClose();
                    } catch (err) {
                      console.error('Error al cargar configuración del visor:', err);
                      alert('No se pudo cargar la configuración del visor');
                    }
                  }}
                  disabled={!selectedVisor}
                >
                  Abrir
                </button>

                <button className="vmanager-button" onClick={() => setShowSaveModal(true)}>Guardar Visor</button>
                <button className="vmanager-button" >Boton</button>
                <button className="vmanager-button" >Boton</button>
                <button className="vmanager-button" >Boton</button>
                <button className="vmanager-button" >Boton</button>
                <button className="vmanager-button" onClick={onClose}>Cerrar</button>
              </div>
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
      </div>
    )
  );
};

export default VisorManagerModal;
