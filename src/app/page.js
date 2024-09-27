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
  const [selectedLang, setSelectedLang] = useState('es'); // Idioma predeterminado
  const ajv = new Ajv();
  ajv.addFormat('color', /^#[0-9A-Fa-f]{6}$/); // Agregando el formato personalizado "color"

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Limpiar el toast después de mostrarlo
  };

  const colorPickerTester = rankWith(
    3,
    and(uiTypeIs('Control'), schemaMatches((schema) => schema.format === 'color'))
  );
  
  const customRenderers = [
    ...materialRenderers,
    { tester: colorPickerTester, renderer: ColorPickerControl }
  ];

  // Cargar datos guardados desde localStorage al inicio
  useEffect(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else if (config) {
      setData(config);
    }
  }, [config]);

  // Genera el schema base en función de la estructura de config
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

  const applyTranslations = (schema, translations, parentKey = '', defaultTranslations = {}) => {
    if (!schema || typeof schema !== 'object') return schema;
  
    // Función para capitalizar las palabras de una cadena camelCase
    const capitalizeWords = (str) => {
      return str
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Inserta un espacio antes de cada letra mayúscula en camelCase
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Maneja secuencias de letras mayúsculas (ejemplo: "HTMLParser" -> "HTML Parser")
        .split(' ') // Divide la cadena en palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
        .join(' '); // Une nuevamente con un espacio entre palabras
    };
  
    const translatedSchema = { ...schema };
  
    // Si el esquema es de tipo "object", iteramos sobre sus propiedades y traducimos el título del objeto
    if (schema.type === 'object' && schema.properties) {
      translatedSchema.title =
        translations[parentKey] || // Traducción en el idioma seleccionado
        defaultTranslations[parentKey] || // Traducción en "default"
        schema.title || // Título original en el schema
        capitalizeWords(parentKey); // Clave original con capitalización como fallback
  
      translatedSchema.properties = Object.entries(schema.properties).reduce((acc, [key, value]) => {
        acc[key] = applyTranslations(value, translations, key, defaultTranslations); // Pasar `defaultTranslations` a cada propiedad
        return acc;
      }, {});
    } else if (schema.type === 'string') {
      // Usamos el `parentKey` como referencia para buscar la traducción de propiedades individuales
      translatedSchema.title =
        translations[parentKey] || // Traducción en el idioma seleccionado
        defaultTranslations[parentKey] || // Traducción en "default"
        schema.title || // Título original en el schema
        capitalizeWords(parentKey); // Clave original con capitalización como fallback
    }
  
    return translatedSchema;
  };
  
  
  

  // Actualiza el schema cada vez que config o el idioma cambian
  useEffect(() => {
    if (config && language) {
      const sectionKeys = Object.keys(config);
      if (!selectedSection && sectionKeys.length > 0) {
        setSelectedSection(sectionKeys[0]); // Selecciona la primera sección
      }
      const generatedSchema = generateSchema(config);
  
      // Aplicar traducciones basadas en el idioma seleccionado y el idioma por defecto
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
    setSelectedLang(e.target.value);
  };

  const handleClearStorage = () => {
    localStorage.removeItem("formData");
    showToast('¡El storage se ha limpiado con exito!', 'success')
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
          <img src="/logos/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="version-info">
          <label>v{config ? config.app.version : 'Sin versión...'}</label>
        </div>

        <select onChange={handleLanguageChange} value={selectedLang}>
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>

        {sectionKeys.map((key) => (
          <button
            key={key}
            onClick={() => handleSectionChange(key)}
            className={`navbar-button ${selectedSection === key ? 'active' : ''}`}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
          >
            {config[key]?.sectionIcon && (
              <i className={config[key].sectionIcon}></i>
            )}
          </button>
        ))}
        <button className="clear-storage" onClick={handleClearStorage} title="Limpiar Memoria">
          <i className="fa-solid fa-trash-can"></i>
        </button>

        <button className="download-button" onClick={handleDownload} title="Descargar JSON">
          <i className="fa-solid fa-download"></i>
        </button>
      </div>

      {isFormShown && (
        <div className="form-container">
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
