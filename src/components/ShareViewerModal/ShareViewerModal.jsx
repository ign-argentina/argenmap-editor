import './ShareViewerModal.css';
import { useUser } from '../../context/UserContext';

const ShareViewerModal = ({ isOpen, onClose, visor }) => {
  const { checkAuth, isAuth } = useUser();

  if (!isOpen || !visor) return null;

  console.log(visor)
  const visorUrl = `${window.location.origin}/visor/${visor.cid}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(visorUrl);
    alert("Enlace copiado al portapapeles");
  };

  return (
    <div className="save-visor-modal-overlay">
      <div className="save-visor-modal">
        <h2 className="share-title">Compartir “{visor.name}”</h2>

        <div className="share-link-container">
          <div className="share-link">{visorUrl}</div>
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
