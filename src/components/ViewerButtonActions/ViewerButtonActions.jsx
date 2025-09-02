
import SaveViewerModal from "../SaveViewerModal/SaveViewerModal";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { downloadViewer, mergeViewer } from '../../utils/ViewerHandler';
import { useNavigate } from "react-router-dom";

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
    <div className="global-buttons">

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

      {isAuth && <button className="btn-common" onClick={() => {
        setCloneMode(true);
        setShowSaveModal(true);
      }}>
        <i className="fa-solid fa-floppy-disk"></i>
        {editorMode ? ("Crear a partir de este ") : ("Crear nuevo visor")}
      </button>
      }
      {(editorMode && isAuth) && <button className="btn-common" onClick={() => { setCloneMode(false); setShowSaveModal(true) }}>
        <i className="fa-solid fa-floppy-disk"></i>
        Guardar cambios
      </button>}

      <button
        className="btn-cancel"
        onClick={() => navigate("/visores")}
        title="Cancelar"
      >
        <span className="icon">
          <i className="fa-solid fa-close"></i>
        </span>
        Cancelar
      </button>

    </div>
  )
}

export default ViewerButtonActions