import { useState } from 'react';
import SaveVisorModal from '../SaveVisorModal/SaveVisorModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './FormNavbar.css';
import { useUser } from '../../context/UserContext';
import language from '../../static/language.json'

const FormNavbar = ({
  config,
  viewer,
  sectionInfo,
  uiControls,
  actions,
  editorMode,
}) => {
  const { sectionKeys, selectedSection, handleSectionChange } = sectionInfo;
  const { handleLanguageChange, selectedLang, isFormShown, setIsFormShown } = uiControls;
  const { handleDownload, getWorkingConfig } = actions;
  const [cloneMode, setCloneMode] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { isAuth } = useUser()
  
  return (
    <div className='editor-navbar'>
      <div className="configVersion-info">
        <label>
          {viewer?.name ? `${viewer.name}` : "Nuevo Visor"}
          {config?.configVersion && ` (v${config.configVersion})`}
        </label>
      </div>

      <div className="button-container">
        <div className="select-container">
          <i className="fa-solid fa-earth-americas"></i>
          <select className="lang-select" onChange={handleLanguageChange} value={selectedLang}>
            {language && Object.keys(language).map((langKey) => (
              <option key={langKey} value={langKey}>
                {langKey === 'default' ? 'Predeterminado' : langKey.charAt(0).toUpperCase() + langKey.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button className="showHide-button" onClick={() => setIsFormShown(!isFormShown)} title="Mostrar/Ocultar Formularios">
          <i className={isFormShown ? "fa-solid fa-play" : "fa-solid fa-play fa-flip-horizontal"}></i>
        </button>
      </div>

      <div className="global-buttons">
        {sectionKeys.map((key) => (
          <button
            key={key}
            onClick={() => handleSectionChange(key)}
            className={`common ${selectedSection === key ? 'active' : ''}`}
            title={language[selectedLang]?.[key] || key}
          >
            {config[key]?.sectionIcon && (
              <span className="icon">
                <i className={config[key].sectionIcon}></i>
              </span>
            )}
            {language[selectedLang]?.[key] || key}
          </button>
        ))}

        <button className="download" onClick={handleDownload} title="Descargar JSON">
          <span className="icon">
            <i className="fa-solid fa-download"></i>
          </span>
          Descargar
        </button>

        {showSaveModal && (
          <div className="save-visor-modal-overlay">
            <SaveVisorModal
              editorMode={editorMode}
              cloneMode={cloneMode}
              visor={viewer}
              isOpen={showSaveModal}
              onClose={() => setShowSaveModal(false)}
              getWorkingConfig = {getWorkingConfig}
            />
          </div>
        )}

        {isAuth && <button className="common" onClick={() => {
          setCloneMode(true);
          setShowSaveModal(true);
        }}>
          <i className="fa-solid fa-floppy-disk"></i>
          {editorMode ? ("Crear a partir de este ") : ("Crear nuevo visor")}
        </button>
        }
        {(editorMode && isAuth) && <button className="common" onClick={() => { setCloneMode(false); setShowSaveModal(true) }}>
          <i className="fa-solid fa-floppy-disk"></i>
          Guardar cambios
        </button>}

      </div>
    </div>
  );
};

export default FormNavbar;