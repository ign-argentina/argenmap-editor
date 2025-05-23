import { useState } from 'react';
import SaveVisorModal from './SaveVisorModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserProvider } from '../context/UserContext';
import './FormNavbar.css';
import { saveVisor } from '../api/configApi';

const FormNavbar = ({
  config,
  visor,
  language,
  sectionInfo,
  uiControls,
  actions,
}) => {
  const { sectionKeys, selectedSection, handleSectionChange } = sectionInfo;
  const { handleLanguageChange, selectedLang, isFormShown, setIsFormShown } = uiControls;
  const { handleDownload } = actions;
  const [showSaveModal, setShowSaveModal] = useState(false);

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

        {sectionKeys.map((key) => (
          <button
            key={key}
            onClick={() => handleSectionChange(key)}
            className={`navbar-button ${selectedSection === key ? 'active' : ''}`}
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

        <button className="download-button" onClick={handleDownload} title="Descargar JSON">
          <span className="icon">
            <i className="fa-solid fa-download"></i>
          </span>
          Descargar
        </button>

        {showSaveModal && (
          <SaveVisorModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={({ name, description }) => {
              const currentJsonRaw = localStorage.getItem('visorMetadata');
              const currentJsonParsed = currentJsonRaw ? JSON.parse(currentJsonRaw) : {};
              const configOnly = currentJsonParsed.config;

              if (!currentJsonRaw) {
                alert('No hay configuración para guardar');
                return;
              }
              saveVisor({ name, description, json: configOnly.json })
                .then(() => {
                  alert('Visor guardado correctamente');
                  setShowSaveModal(false);
                  // fetchVisores(setVisores);
                })
                .catch((err) => {
                  console.error('Error al guardar visor:', err);
                  alert('Error al guardar visor');
                });
            }}
          />
        )}


        <button className="navbar-button" onClick={() => setShowSaveModal(true)}>
          Guardar como
        </button>

      </div>
    </UserProvider>
  );
};

export default FormNavbar;