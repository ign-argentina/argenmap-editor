// components/Navbar.jsx
import React from 'react';
import Link from 'next/link';

const Navbar = ({ config, language, selectedLang, handleLanguageChange, handleClearStorage, sectionKeys, selectedSection, handleSectionChange, setIsFormShown, isFormShown, handleDownload }) => {
  return (
    <div className='navbar'>
      <div className="logo-container">
        <img src="/logos/logo2.png" alt="Logo" className="logo" />
      </div>
      <div className="version-info">
        <label>EDITOR v{config ? config.app.version : 'Sin versión...'}</label>
      </div>

      <Link href="/dashboard/home">
        <div>Ir a Home</div>
      </Link>

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
          title={
            key.charAt(0).toUpperCase() + key.slice(1)
          }
        >
          {config[key]?.sectionIcon && (
            <span className="icon">
              <i className={config[key].sectionIcon}></i>
            </span>
          )}
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}

      <button className="download-button" onClick={handleDownload} title="Descargar JSON">
        <span className="icon">
          <i className="fa-solid fa-download"></i>
        </span>
        Descargar
      </button>
    </div>
  );
};

export default Navbar;
