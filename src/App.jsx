import Ajv from 'ajv';
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import Preview from './components/Preview';
import Navbar from './components/Navbar';
import ColorPickerControl from './utils/ColorPickerControl';
import TranslateSchema from './utils/TranslateSchema';
import GenerateSchema from './utils/GenerateSchema';
import FilterEmptySections from './utils/FilterEmptySections';
import HandleDownload from './utils/HandleDownload';
import HandleSaveConfig from './utils/HandleSaveConfig';
import MergeDataWithDefaults from './utils/MergeDataWithDefaults';
import Toast from './utils/Toast';
import useConfig from './hooks/useConfig';
import useLang from './hooks/useLang';
import './global.css'

function App() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const { language, loading: langLoading, error: langError } = useLang();
  const [data, setData] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [schema, setSchema] = useState({});
  const [isFormShown, setIsFormShown] = useState(true);
  const [toast, setToast] = useState(null);
  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);  // Loads lang from localStorage, if it doesnt exists, use a default

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
      return translatedSchema
    }
  }
  
  // Load saved data from localStorage on startup.
  useEffect(() => {
    const storedData = localStorage.getItem('formData');
    const defaultData = localStorage.getItem('formDataDefault');

    const parsedStoredData = storedData ? JSON.parse(storedData) : {};
    const parsedDefaultData = defaultData ? JSON.parse(defaultData) : {};

    const mergedData = MergeDataWithDefaults(parsedStoredData, parsedDefaultData);
    if (storedData) {
      setData(mergedData);
      uploadData();
    } else if (config) {
      localStorage.setItem('formDataDefault', JSON.stringify(config));
      setData(config);
      uploadData();
    }
  }, [config, language, selectedLang]);


  const handleJsonUpload = (parsedData) => {
    localStorage.setItem('formDataDefault', JSON.stringify(parsedData));
    localStorage.setItem('formData', JSON.stringify(parsedData));
    setData(parsedData);
    const uploadedSchema = uploadData();
    setSchema(uploadedSchema)
    window.location.reload();
    showToast('JSON cargado exitosamente', 'success');
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
    const defaultData = localStorage.getItem('formDataDefault')
    const parsedDefaultData = JSON.parse(defaultData);
    setData(parsedDefaultData);
    setReloadKey(prev => prev + 1);
    showToast('¡El storage se ha limpiado con éxito!', 'success');
  };

  const defaultData = localStorage.getItem('formDataDefault')
  const parsedDefaultData = JSON.parse(defaultData);
  const { downloadJson } = HandleDownload({ data, parsedDefaultData });
  const handleDownload = () => {
    downloadJson();
  };

  const { saveConfigJson } = HandleSaveConfig({data});
  const handleSaveConfig = () => {
    saveConfigJson();
  };

  
  return (
    <div>
      <div className="editor-container" key={reloadKey}>
        <Navbar
          config={data}
          language={language}
          selectedLang={selectedLang}
          handleLanguageChange={handleLanguageChange}
          handleClearStorage={handleClearStorage}
          sectionKeys={sectionKeys}
          selectedSection={selectedSection}
          handleSectionChange={handleSectionChange}
          isFormShown={isFormShown}
          handleDownload={handleDownload}
          handleSaveConfig={handleSaveConfig}
          handleJsonUpload={handleJsonUpload}
          setIsFormShown={setIsFormShown}
        />

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

export default App


