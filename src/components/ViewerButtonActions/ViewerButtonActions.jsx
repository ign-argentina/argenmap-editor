
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
        <i className="fa-solid fa-download icon"></i>
        <span className="label">Descargar</span>
      </button>

      {isAuth && (
        <button
          className="btn-share"
          title={editorMode ? "Crear visor a partir de este" : "Crear nuevo visor"}
          onClick={() => {
            setCloneMode(true);
            setShowSaveModal(true);
          }}
        >
          <i className="fa-solid fa-square-plus icon"></i>
          <span className="label">{editorMode ? "Clonar" : "Nuevo"}</span>
        </button>
      )}

      {(editorMode && isAuth) && (
        <button
          className="btn-common"
          title="Guardar cambios"
          onClick={() => {
            setCloneMode(false);
            setShowSaveModal(true);
          }}
        >
          <i className="fa-solid fa-floppy-disk icon"></i>
          <span className="label">Guardar</span>
        </button>
      )}

      <button className="btn-cancel" onClick={() => navigate("/visores")} title="Cancelar">
        <i className="fa-solid fa-close icon"></i>
        <span className="label">Cancelar</span>
      </button>
    </div>

  )
}

export default ViewerButtonActions