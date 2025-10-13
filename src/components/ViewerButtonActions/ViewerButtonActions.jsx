
import SaveViewerModal from "../SaveViewerModal/SaveViewerModal";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { downloadViewer, mergeViewer } from '../../utils/ViewerHandler';
import { useNavigate } from "react-router-dom";
import './ViewerButtonActions.css';

function ViewerButtonActions({ editorMode, viewer = {}, getWorkingConfig, isArgenmap = false }) {

  const [cloneMode, setCloneMode] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { isAuth } = useUser()
  const navigate = useNavigate();

  const handleDownload = () => {
    const config = getWorkingConfig()
    if (isArgenmap) {
      downloadViewer(config, isArgenmap, viewer?.name)
    } else {
      downloadViewer(config, false, viewer?.name)
    }
  };

  return (
    <div className="form-options-buttons">

      <button className="btn-download" onClick={handleDownload} title="Descargar JSON">
        <span className="icon">
          <i className="fa-solid fa-download"></i>
        </span>
        Descargar
      </button>

      {showSaveModal && (
        <div className="save-viewer-modal-overlay">
          <SaveViewerModal
            editorMode={editorMode}
            cloneMode={cloneMode}
            viewer={viewer}
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            getWorkingConfig={getWorkingConfig}
          />
        </div>
      )}

      {isAuth && (
        <button
          className="btn-common"
          title={editorMode ? "Crear Visor a Partir de Este" : "Crear Nuevo Visor"}
          onClick={() => {
            setCloneMode(true);
            setShowSaveModal(true);
          }}
        >
          <i className="fa-solid fa-square-plus"></i>
        </button>
      )}

      {(editorMode && isAuth) &&
        <button
          className="btn-common"
          title="Guardar Cambios"
          onClick={() => { setCloneMode(false); setShowSaveModal(true) }}
        >
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
      }

      <button
        className="btn-cancel"
        onClick={() => navigate("/visores")}
        title="Cancelar"
      >
        <span className="icon">
          <i className="fa-solid fa-close"></i>
        </span>
      </button>

    </div>
  )
}

export default ViewerButtonActions