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
  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
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


  const uploadData = () => {
    if (data && language) {
      const generatedSchema = GenerateSchema({ data });
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
    
  }

  // Load saved data from localStorage on startup.
  useEffect(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      const parsedStoredData = JSON.parse(storedData);
      setData(parsedStoredData);
      uploadData();
      console.log("setData localStorage")

    } else if (config) {
      setData(config);
      uploadData();
      console.log("setData config")

    }
  }, [config, language, selectedLang]);

  

  const handleJsonUpload = (parsedData) => {
    setData(parsedData);
    uploadData();
    window.location.reload();
    showToast('JSON cargado exitosamente', 'success');
    console.log("setData upload")
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

  const handleClearStorage = () => {
    const formData = JSON.parse(localStorage.getItem("formData"));

    const clearValues = (data) => {
      for (const key in data) {
        if (typeof data[key] === "object" && data[key] !== null) {
          clearValues(data[key]);
        } else {
          data[key] = "";
        }
      }
    };
    clearValues(formData);
    localStorage.setItem("formData", JSON.stringify(formData));

    setData(config);
    window.location.reload();
    showToast("¡Los valores del formData se han limpiado con éxito!", "success");
  };


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
          setIsFormShown={setIsFormShown}
        />
        {/* <Welcome onJsonUpload={handleJsonUpload}/> */}

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
    </div>
  );
}
