'use client'
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import Preview from './components/Preview';
import ColorPickerControl from './components/ColorPickerControl';
import TranslateSchema from './components/TranslateSchema';
import GenerateSchema from './components/GenerateSchema';
import FilterEmptySections from './components/FilterEmptySections';
import Welcome from './components/Welcome';
import Navbar from './components/Navbar';
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
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    } else if (config) {
      setData(config);
    }
  }, [config]);


  // Update the schema whenever config or language changes
  useEffect(() => {
    if (config && language) {
      const generatedSchema = GenerateSchema({ config });
      const filteredSchema = FilterEmptySections(generatedSchema);
      const translatedSchema = TranslateSchema({
        schema: filteredSchema,
        translations: language[selectedLang] || language['default'],
        defaultTranslations: language['default'] || {},
      });

      setSchema(translatedSchema);

      const sectionKeys = Object.keys(translatedSchema.properties);
      if (sectionKeys.length > 0) {
        setSelectedSection(sectionKeys[0]);
      } else {
        setSelectedSection(null);
      }
    }
  }, [config, selectedLang, language]);

  const handleJsonUpload = (parsedData) => {
    // Código existente para manejar el JSON
    setData(parsedData);
    setIsFormShown(true); // Mostrar el formulario
    showToast('JSON cargado exitosamente', 'success');
    
    // Volver a generar el esquema con el nuevo JSON
    const generatedSchema = GenerateSchema({ config: parsedData });
    const filteredSchema = FilterEmptySections(generatedSchema);
    const translatedSchema = TranslateSchema({
      schema: filteredSchema,
      translations: language[selectedLang] || language['default'],
      defaultTranslations: language['default'] || {},
    });
  
    setSchema(translatedSchema);
  
    // Seleccionar la primera sección del nuevo esquema
    const sectionKeys = Object.keys(translatedSchema.properties);
    if (sectionKeys.length > 0) {
      setSelectedSection(sectionKeys[0]);
    } else {
      setSelectedSection(null);
    }
  
    // Limpiar el estado anterior para forzar el re-render
    setIsFormShown(false);
    setTimeout(() => setIsFormShown(true), 0); // Forzar re-render
  };
  


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
    setIsFormShown(false);
    setTimeout(() => setIsFormShown(true), 0); // Force re-render
    showToast('¡El storage se ha limpiado con éxito!', 'success');
  }

  const { downloadJson } = HandleDownload({ data, config });
  const handleDownload = () => {
    downloadJson();
  };

  return (
    <div>
      <div className="editor-container">
        <Navbar
          config={config}
          language={language}
          selectedLang={selectedLang}
          handleLanguageChange={handleLanguageChange}
          handleClearStorage={handleClearStorage}
          sectionKeys={sectionKeys}
          selectedSection={selectedSection}
          handleSectionChange={handleSectionChange}
          isFormShown={isFormShown}
          handleDownload={handleDownload}
          handleJsonUpload={handleJsonUpload}
        />
        {/* <Welcome onJsonUpload={handleJsonUpload}/> */}

        {isFormShown && (
          <div className="form-container" key={reloadKey}>
            {selectedSection && (
              <div className="custom-form-group">
                <JsonForms
                  schema={schema.properties[selectedSection]}
                  data={data[selectedSection] || {}}
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
    </div>
  );
}
