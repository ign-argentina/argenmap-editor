import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateViewerModal.css';

const CreateViewerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [hoverText, setHoverText] = useState("");

  if (!isOpen) return null;

  return (
    <div className="create-viewer-modal-overlay">
      <div className="create-viewer-modal">
        <h2 className="create-viewer-title">Crear nuevo visor</h2>
        <h2 className="share-viewer-title">Seleccione un tipo de visor para su proyecto</h2>
        <div className="create-viewer-options">

          <button
            onMouseEnter={() => setHoverText("Argenmap: Visor tradicional")}
            onMouseLeave={() => setHoverText("")}
            className="upload-option"
            title="Crear nuevo visor"
            onClick={() => {
              // setShowCreateViewerModal(true);
            }}
          >
            <img src="/assets/logoArgenmap.png" alt="Argenmap" />
            <span>Argenmap</span>
          </button>

          <div className="create-separator"></div>

          <button
            onMouseEnter={() => setHoverText("Kharta: Visor moderno [En Desarrollo]")}
            onMouseLeave={() => setHoverText("")}
            className="upload-option"
            title="Subir visor"
            onClick={() => {
              navigate('/form');
            }}
          >
            <img src="/assets/logoArgenmap.png" alt="Kharta" />
            <span>Kharta</span>
          </button>
        </div>

        <div className="create-hover-area">
          {hoverText && <p className="create-hover-text">{hoverText}</p>}
        </div>

        <div className="create-viewer-footer">
          <button className="create-viewer-close-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

};

export default CreateViewerModal;
