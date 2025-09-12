import { useEffect, useState, useRef } from 'react';
import { createShareLink } from '../../api/configApi.js';
import currentVisor from '../../api/visorApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import './ShareViewerModal.css';



const ShareViewerModal = ({ isOpen, onClose, viewer }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [dropdownValue, setDropdownValue] = useState(60);
  const [isEnabled, setIsEnabled] = useState(true);
  const linkRef = useRef(null);
  const iframeRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUrl = async () => {
      if (viewer && isOpen) {
        try {
          const { id: vid, gid: vgid } = viewer;
          const response = await createShareLink(vid, vgid);
          if (response.success && response.data) {
            const fullUrl = `http://${currentVisor.IP}:${currentVisor.API_PORT}/map?view=${response.data}`;
            setShareUrl(fullUrl);
            setIframeCode(
              `<iframe src="${fullUrl}" width="100%" height="500" style="border:0;" allowfullscreen></iframe>`
            );
          } else {
            setShareUrl('');
            setIframeCode('');
          }
        } catch (error) {
          console.error('Error al generar el enlace:', error);
          setShareUrl('');
          setIframeCode('');
        }
      }
    };
    fetchUrl();
  }, [viewer, isOpen]);

  const handleCopy = (ref) => {
    if (!ref?.current) return;
    
    const el = ref.current;
    const text = 'value' in el ? el.value : el.textContent;

    if (text) {
      navigator.clipboard.writeText(text.trim());
      showToast('Link Copiado!', 'info', 1000);
    }
  };

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    // Prevent selecting permanent when disabled
    if (!isEnabled && value === "x") {
      showToast('Habilita el visor para usar enlaces permanentes', 'warning', 2000);
      return;
    }
    setDropdownValue(value === "x" ? "x" : Number(value));
  };

  const handleDropdownButtonClick = () => {
    // Prevent permanent link generation when disabled
    if (!isEnabled && dropdownValue === "x") {
      showToast('Habilita el visor para generar enlaces permanentes', 'warning', 2000);
      return;
    }
    
    if (dropdownValue === "x") {
      console.log('Valor seleccionado: Permanente (sin expiración)');
      showToast('Generando enlace permanente...', 'info', 2000);
    } else {
      console.log('Valor seleccionado:', dropdownValue);
      const timeText = getTimeText(dropdownValue);
      showToast(`Generando enlace por ${timeText}...`, 'info', 2000);
    }
  };

  const getTimeText = (value) => {
    switch(value) {
      case 60: return '1 minuto';
      case 600: return '10 minutos';
      case 3600: return '1 hora';
      case 86400: return '24 horas';
      default: return `${value} segundos`;
    }
  };

  const handleToggleEnabled = () => {
    setIsEnabled(!isEnabled);
    const message = !isEnabled 
      ? 'Visor habilitado para compartir' 
      : 'Visor deshabilitado para compartir';
    showToast(message, 'info', 2000);
    
    // When disabling, switch to temporal link if permanent was selected
    if (isEnabled && dropdownValue === "x") {
      setDropdownValue(60); // Default to 1 minute
      showToast('Cambiado a enlace temporal', 'info', 1000);
    }
    
    // Clear URLs when disabling, but keep them when enabling
    if (isEnabled) {
      setShareUrl('');
      setIframeCode('');
    }
  };

  if (!isOpen || !viewer) return null;

  return (
    <div className="share-viewer-modal-overlay">
      <div className="share-viewer-modal">
        <h2 className="share-viewer-title">Compartir {viewer.name}</h2>

        {/* Dropdown + botón */}
        <div className="share-viewer-dropdown-container">
          <div className="time-selection-label">
            <i className="fas fa-clock"></i>
            Tiempo de acceso:
          </div>
          <select
            value={dropdownValue}
            onChange={handleDropdownChange}
            className="share-viewer-dropdown"
            disabled={!isEnabled && dropdownValue === "x"}
          >
            <option value={60}>1 minuto</option>
            <option value={600}>10 minutos</option>
            <option value={3600}>1 hora</option>
            <option value={86400}>24 horas</option>
            <option value="x" disabled={!isEnabled}>
              Permanente {!isEnabled ? '(Deshabilitado)' : ''}
            </option>
          </select>
          <button 
            className={`generate-link-button ${dropdownValue === "x" ? 'permanent' : ''}`} 
            onClick={handleDropdownButtonClick}
            disabled={!isEnabled && dropdownValue === "x"}
          >
            <i className={`fas ${dropdownValue === "x" ? 'fa-infinity' : 'fa-magic'}`}></i>
            {dropdownValue === "x" ? 'Generar Link Permanente' : 'Generar Link Temporal'}
          </button>
        </div>

        {/* Link compartido - Always visible and functional */}
        <div className="share-viewer-section">
          <label className="share-viewer-label">
            <i className="fas fa-link"></i>
            Compartir link de acceso
          </label>
          <div className="share-viewer-link-container">
            <div className="share-viewer-link" ref={linkRef}>
              {shareUrl || (
                <div className="loading-placeholder">
                  <i className="fas fa-info-circle"></i>
                  Presiona "Generar Link" para crear un enlace de acceso...
                </div>
              )}
            </div>
            <button
              className="share-viewer-copy-button"
              onClick={() => handleCopy(linkRef)}
              disabled={!shareUrl}
            >
              <i className="fas fa-copy"></i>
              Copiar
            </button>
          </div>
        </div>

        {/* iFrame section - Always visible, content based on enabled state */}
        <div className={`share-viewer-section ${!isEnabled ? 'disabled-section' : ''}`}>
          <label className="share-viewer-label">
            <i className="fas fa-code"></i>
            Insertar iFrame en mi sitio
            {!isEnabled && <i className="fas fa-lock disabled-icon"></i>}
          </label>
          {!isEnabled ? (
            <div className="disabled-message">
              <i className="fas fa-info-circle"></i>
              <p>El visor no está habilitado para compartirse permanentemente. Habilitelo para desbloquear la sección.</p>
            </div>
          ) : (
            <div className="share-viewer-iframe-container">
              <textarea
                readOnly
                value={iframeCode}
                className="share-viewer-iframe-code"
                rows={4}
                ref={iframeRef}
                placeholder="El código HTML aparecerá aquí..."
              />
              <button
                className="iframe-copy-button"
                onClick={() => handleCopy(iframeRef)}
              >
                <i className="fas fa-copy"></i>
                Copiar
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer-buttons">
          <button 
            className={`toggle-button ${isEnabled ? 'disable-button' : 'enable-button'}`}
            onClick={handleToggleEnabled}
          >
            <i className={`fas ${isEnabled ? 'fa-ban' : 'fa-check-circle'}`}></i>
            {isEnabled ? 'Deshabilitar' : 'Habilitar'}
          </button>
          <button className="share-viewer-close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareViewerModal;
