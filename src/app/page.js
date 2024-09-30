'use client'
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import Preview from './components/Preview';
import ColorPickerControl from './components/ColorPickerControl';
import TranslateSchema from './components/TranslateSchema';
import GenerateSchema from './components/GenerateSchema';
import HandleDownload from './components/HandleDownload';
import useConfig from '../app/hooks/useConfig';
import useLang from '../app/hooks/useLang';
import Toast from './utils/Toast';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Ajv from 'ajv';

export default function Page() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const { lang: language, loading: langLoading, error: langError } = useLang();
  const [data, setData] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [schema, setSchema] = useState({});
  const [isFormShown, setIsFormShown] = useState(true);
  const [toast, setToast] = useState(null);

  // Loads lang from localStorage, if it doesnt exists, use a default
  const savedLanguage = localStorage.getItem('selectedLang') || 'default';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);

  const ajv = new Ajv();
  ajv.addFormat('color', /^#[0-9A-Fa-f]{6}$/); // Custom format "color" added to JSONForms

  const showToast = (message, type) => { // Toast (message)
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const colorPickerTester = rankWith(
    3,
    and(uiTypeIs('Control'), schemaMatches((schema) => schema.format === 'color'))
  );
  const customRenderers = [
    ...materialRenderers,
    { tester: colorPickerTester, renderer: ColorPickerControl }
  ];

  // Load saved data from localStorage on startup
  useEffect(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else if (config) {
      setData(config);
    }
  }, [config]);


  // Update the schema whenever config or language changes
  useEffect(() => {
    if (config && language) {
      const sectionKeys = Object.keys(config);
      if (!selectedSection && sectionKeys.length > 0) {
        setSelectedSection(sectionKeys[0]); // Show fist section
      }
      const generatedSchema = GenerateSchema({ config });

      // Apply translations based on the selected language and the default language
      const translatedSchema = TranslateSchema({
        schema: generatedSchema,
        translations: language[selectedLang] || language['default'],
        defaultTranslations: language['default'] || {}
      });
      setSchema(translatedSchema);
    }
  }, [config, selectedSection, selectedLang, language]);


  const sectionKeys = schema && schema.properties ? Object.keys(schema.properties) : [];

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setSelectedLang(selectedLanguage);
    localStorage.setItem('selectedLang', selectedLanguage);
  };

  const [reloadKey, setReloadKey] = useState(0);
  const handleClearStorage = () => {
    localStorage.removeItem("formData");
    setData(config);
    setReloadKey(prev => prev + 1);
    showToast('¡El storage se ha limpiado con éxito!', 'success');
  }

  const { downloadJson } = HandleDownload({ data, config });
  const handleDownload = () => {
    downloadJson();
  };

  return (
    <div className="editor-container">
      <div className='navbar'>
        <div className="logo-container">
          <img src="/logos/logo2.png" alt="Logo" className="logo" />
        </div>
        <div className="version-info">
          <label>EDITOR v{config ? config.app.version : 'Sin versión...'}</label>
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
              schema.properties[key]?.title ||
              key.charAt(0).toUpperCase() + key.slice(1)
            }
          >
            {config[key]?.sectionIcon && (
              <span className="icon">
                <i className={config[key].sectionIcon}></i>
              </span>
            )}

            {schema.properties[key]?.title || key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}

        <button className="download-button" onClick={handleDownload} title="Descargar JSON">
          <span className="icon">
            <i className="fa-solid fa-download"></i>
          </span>
          Descargar
        </button>
      </div>

      {isFormShown && (
        <div className="form-container" key={reloadKey}>
          {selectedSection && (
            <div className="custom-form-group">
              <JsonForms
                schema={schema.properties[selectedSection]}
                data={data[selectedSection]}
                renderers={customRenderers}
                cells={materialCells}
                ajv={ajv}
                onChange={({ data: updatedData }) => {
                  setData((prevData) => {
                    const newData = {
                      ...prevData,
                      [selectedSection]: updatedData
                    };
                    localStorage.setItem('formData', JSON.stringify(newData));
                    return newData;
                  });
                }}
              />
            </div>
          )}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="preview-container">
        <Preview />
      </div>
    </div>
  );
}
