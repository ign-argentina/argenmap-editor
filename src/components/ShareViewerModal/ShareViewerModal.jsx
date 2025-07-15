import './ShareViewerModal';
import { useUser } from '../../context/UserContext';
import { createShareLink } from '../../api/configApi.js';

const ShareViewerModal = ({ isOpen, onClose, visor }) => {
  const { checkAuth, isAuth } = useUser();

  if (!isOpen || !visor) return null;

  const getVieweUrl = async () => {
    console.log(visor)
    const vid = visor.id;
    const vgid = visualViewport.gid;
    const viewerUrl = await createShareLink(vid, vgid);
    return viewerUrl;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(viewerUrl);
    alert("Enlace copiado al portapapeles");
  };

  return (
    <div className="save-visor-modal-overlay">
      <div className="save-visor-modal">
        <h2 className="share-title">Compartir “{visor.name}”</h2>

        <div className="share-link-container">
          <div className="share-link">{getVieweUrl()}</div>
          <button className="copy-button" onClick={handleCopy}>Copiar</button>
        </div>

        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ShareViewerModal;
