import { useEffect, useState } from 'react';
import './ShareViewerModal.css';
import { useUser } from '../../context/UserContext';
import { createShareLink } from '../../api/configApi.js';
import currentVisor from '../../api/visorApi.js';


const ShareViewerModal = ({ isOpen, onClose, visor }) => {
  const { isAuth } = useUser();
  const [shareUrl, setShareUrl] = useState('');
  const [iframeCode, setIframeCode] = useState('');

  useEffect(() => {
    const fetchUrl = async () => {
      if (visor && isOpen) {
        const vid = visor.id;
        const vgid = visor.gid;
        try {
          const response = await createShareLink(vid, vgid);
          if (response.success && response.data) {
            const fullUrl = `http://${currentVisor.IP}:${currentVisor.API_PORT}/${response.data}`;
            setShareUrl(fullUrl);
            setIframeCode(
              `<iframe src="${fullUrl}" width="100%" height="500" style="border:0;" allowfullscreen></iframe>`
            );
          } else {
            console.error("Respuesta inesperada al generar el enlace:", response);
            setShareUrl('');
            setIframeCode('');
          }
        } catch (error) {
          console.error("Error al generar el enlace:", error);
          setShareUrl('');
          setIframeCode('');
        }
      }
    };
    fetchUrl();
  }, [visor, isOpen]);


  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  if (!isOpen || !visor) return null;

  return (
    <div className="share-viewer-modal-overlay">
      <div className="share-viewer-modal">
        <h2 className="share-viewer-title">Compartir {visor.name}</h2>

        <div className="share-viewer-link-container">
          <div className="share-viewer-link">{shareUrl || 'Generando enlace...'}</div>
          <button
            className="share-viewer-copy-button"
            onClick={() => handleCopy(shareUrl)}
            disabled={!shareUrl}
          >
            Copiar
          </button>
        </div>

        {iframeCode && (
          <div className="share-viewer-iframe-section">
            <label className="share-viewer-iframe-label">Insertar en mi sitio</label>
            <div className="share-viewer-iframe-container">
              <textarea
                readOnly
                value={iframeCode}
                className="share-viewer-iframe-code"
                rows={3}
              />
              <button
                className="share-viewer-copy-button"
                onClick={() => handleCopy(iframeCode)}
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        <div className="share-viewer-footer">
          <button className="share-viewer-close-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareViewerModal;