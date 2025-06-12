import { useEffect, useState } from 'react';
import SaveVisorModal from '../SaveVisorModal/SaveVisorModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserProvider } from '../../context/UserContext';
import './FormNavbar.css';
import { useUser } from '../../context/UserContext';

const FormNavbar = ({
  config,
  visor,
  language,
  sectionInfo,
  uiControls,
  actions,
  editorMode,
}) => {
  const { sectionKeys, selectedSection, handleSectionChange } = sectionInfo;
  const { handleLanguageChange, selectedLang, isFormShown, setIsFormShown } = uiControls;
  const { handleDownload } = actions;
  const [cloneMode, setCloneMode] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { isAuth } = useUser()

  return (
    <UserProvider> {/* ANALIZAR EN UN FUTURO, LLEVAR EL CONTEXTO DE MANERA GLOBAL Y MODULARIZADA  */}

      <div className='editor-navbar'>
        <div className="configVersion-info">
          <label>
            {visor?.name ? `${visor.name}` : "Usando Visor Estándar"}
            {visor?.config?.json.configVersion && ` (v${visor.config.json.configVersion})`}
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
                visor={visor}
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
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
    </UserProvider >
  );
};

export default FormNavbar;