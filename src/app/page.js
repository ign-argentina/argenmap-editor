'use client'
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Preview from './components/Preview';
import useConfig from '../app/hooks/useConfig';
import useLang from '../app/hooks/useLang';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ColorPickerControl from '../app/components/ColorPickerControl';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import Toast from './utils/Toast';
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


  const generateSchema = (config) => {
    const createSchema = (obj) => {
      if (Array.isArray(obj)) {
        return { type: 'array', items: createSchema(obj[0]) };
      } else if (typeof obj === 'object' && obj !== null) {
        const schema = { type: 'object', properties: {} };
        Object.keys(obj).forEach((key) => {
          if (key !== 'sectionIcon') {
            schema.properties[key] = createSchema(obj[key]);
          }
        });
        return schema;
      } else if (typeof obj === 'string' && /^#[0-9A-F]{6}$/i.test(obj)) {
        return { type: 'string', format: 'color' };
      } else {
        return { type: typeof obj };
      }
    };
    return createSchema(config);
  };


  // Applies translations to the schema
  const applyTranslations = (schema, translations, parentKey = '', defaultTranslations = {}) => {
    if (!schema || typeof schema !== 'object') return schema;

    const capitalizeWords = (str) => {
      return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const translatedSchema = { ...schema };

    // If the schema is of type "object", we iterate over its properties and translate the object title
    if (schema.type === 'object' && schema.properties) {
      translatedSchema.title =
        translations[parentKey] || // Translate to selected language
        defaultTranslations[parentKey] || // Translate to "default"
        schema.title || // Original title from schema
        capitalizeWords(parentKey); // Original key as fallback

      translatedSchema.properties = Object.entries(schema.properties).reduce((acc, [key, value]) => {
        acc[key] = applyTranslations(value, translations, key, defaultTranslations); // Pass `defaultTranslations` to each property
        return acc;
      }, {});
    } else if (schema.type === 'string') {
      // We use the `parentKey` as a reference to look up the translation of individual properties
      translatedSchema.title =
        translations[parentKey] ||
        defaultTranslations[parentKey] ||
        schema.title ||
        capitalizeWords(parentKey);
    }
    return translatedSchema;
  };


  // Update the schema whenever config or language changes
  useEffect(() => {
    if (config && language) {
      const sectionKeys = Object.keys(config);
      if (!selectedSection && sectionKeys.length > 0) {
        setSelectedSection(sectionKeys[0]); // Show fist section
      }
      const generatedSchema = generateSchema(config);

      // Apply translations based on the selected language and the default language
      const translatedSchema = applyTranslations(
        generatedSchema,
        language[selectedLang] || language['default'],
        '',
        language['default'] || {}
      );
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

  const handleDownload = () => {
    // Chequeo de campos borrados.
    // Un campo vacío es borrado por JSONForms.
    // Si es borrado se lo crea de nuevo vacío
    const ensureFieldsExist = (obj, reference) => {
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        return obj;
      }
      const result = { ...obj };
      Object.keys(reference).forEach((key) => {
        if (!(key in obj)) {
          // Si la clave no existe en obj, la añadimos con un valor vacío
          result[key] = reference[key] === 'string' ? '' : "";
        } else if (typeof reference[key] === 'object' && reference[key] !== null) {
          // Si la clave existe pero es un objeto, volvemos a aplicar la función recursivamente
          result[key] = ensureFieldsExist(obj[key], reference[key]);
        }
      });
      return result;
    };
    const completeData = ensureFieldsExist(data, config);
    const fileData = JSON.stringify(completeData, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'config.json');
    document.body.appendChild(link);
    link.click();

    return (0
    );
  }

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
