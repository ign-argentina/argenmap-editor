import React from 'react';
import { useState } from 'react';
import LatestRelease from "../components/LatestRelease";
import ConfigActionsMenu from './ConfigActionsMenu';
import SaveVisorModal from './SaveVisorModal';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = ({
  config,
  language,
  sectionInfo,
  uiControls,
  actions
}) => {
  const { sectionKeys, selectedSection, handleSectionChange } = sectionInfo;
  const { handleLanguageChange, selectedLang, handleClearStorage, isFormShown, setIsFormShown } = uiControls;
  const { handleDownload, handleSaveConfig, handleJsonUpload } = actions;
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        handleJsonUpload(jsonData);
      };
      reader.readAsText(file);
    }
  };

  const handleSaveVisor = async ({ name, description }) => {
    try {
      const storedData = localStorage.getItem('formData');
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const res = await fetch('http://localhost:3001/visores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, json: parsedData })
      });
      const result = await res.json();
      alert('Guardado con éxito: ' + result.id);
    } catch (err) {
      console.error('Error al guardar visor:', err);
      alert('Error al guardar visor');
    }
  };

  return (
    <div className='navbar'>
      <div className="logo-container">
        <img src="/assets/logo.png" alt="Logo" className="logo" />
      </div>
      <div className="configVersion-info">
        <label>
          {config?.configVersion ? `Usando config v${config.configVersion}` : "Config sin versión"}
        </label>
      </div>
      <label className="navbar-button">
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: "none" }}
          title="Subir JSON"
        />
        <span className="icon">
          <i className="fa-solid fa-upload" style={{ cursor: "pointer" }}></i>
        </span>

        Subir JSON
      </label>

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

        <button className="clear-storage" onClick={handleClearStorage} title="Limpiar Memoria">
          <i className="fa-solid fa-trash-can"></i>
        </button>

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

      <ConfigActionsMenu handleSaveConfig={handleSaveConfig} />

      {showSaveModal && (
        <SaveVisorModal
          onSave={handleSaveVisor}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      <button onClick={() => setShowSaveModal(true)} title="Guardar como Visor">
        <i className="fa-solid fa-save"></i> Guardar Visor
      </button>

      <div className="version-info">
        <LatestRelease />
      </div>
    </div>
  );
};

export default Navbar;
