import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateViewerModal.css';
import logoArgenmap from '../../assets/logoArgenmap.png';
import logoKharta from '../../assets/logoKharta.png';

const CreateViewerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [hoverText, setHoverText] = useState("");
  const modalRef = useRef(null);

  // Cerrar modal al hacer click fuera o presionar Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="create-viewer-modal-overlay">
      <div className="create-viewer-modal" ref={modalRef}>
        <h2 className="create-viewer-title">
          <i className="fa-solid fa-solid fa-plus create-title-icon"></i>
          Crear nuevo visor
        </h2>

        <h2 className="create-viewer-subtitle">
          Seleccione un tipo de visor para su proyecto
        </h2>

        <div className="create-viewer-options">
          <button
            onMouseEnter={() => setHoverText("Argenmap: Visor tradicional")}
            onMouseLeave={() => setHoverText("")}
            className="create-option"
            title="Crear visor Argenmap"
            onClick={() => {
              navigate('/form', { state: { isArgenmap: true } });
            }}
          >
            <img src={logoArgenmap} alt="Argenmap" />
            <span>Argenmap</span>
          </button>

          <div className="create-separator"></div>

          <button
            onMouseEnter={() => setHoverText("Kharta [En Desarrollo]")}
            onMouseLeave={() => setHoverText("")}
            className="create-option kharta-option"
            title="Crear visor Kharta"
  /*           onClick={() => {
              navigate('/form', { state: { isArgenmap: false } });
            }} */
          >
            <img src={logoKharta} alt="Kharta" />
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
