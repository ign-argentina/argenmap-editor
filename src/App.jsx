import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import useConfig from './hooks/useConfig';
import useLang from './hooks/useLang';
import useFormEngine from './hooks/useFormEngine';
import Preview from './components/Preview';
import Navbar from './components/Navbar';
import VisorManagerModal from './components/VisorManagerModal';
import ColorPickerControl from './utils/ColorPickerControl';
import HandleDownload from './utils/HandleDownload';
import Toast from './utils/Toast';
import './global.css';

function App() {
  const { config } = useConfig();
  const { language } = useLang();
  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);

  const {
    data,
    setData,
    schema,
    selectedSection,
    setSelectedSection,
    ajv,
    uploadData
  } = useFormEngine({ config, language, selectedLang });

  const [isFormShown, setIsFormShown] = useState(true);
  const [isVisorModalOpen, setIsVisorModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setSelectedLang(selectedLanguage);
    localStorage.setItem('selectedLang', selectedLanguage);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const colorPickerTester = rankWith(
    3,
    and(uiTypeIs('Control'), schemaMatches((schema) => schema.format === 'color'))
  );

  const customRenderers = [
    ...materialRenderers,
    { tester: colorPickerTester, renderer: ColorPickerControl }
  ];

  const handleJsonUpload = (parsedData) => {
    localStorage.setItem('formDataDefault', JSON.stringify(parsedData));
    localStorage.setItem('formData', JSON.stringify(parsedData));
    setData(parsedData);
    uploadData(parsedData);
    window.location.reload();
    showToast('JSON cargado exitosamente', 'success');
  };

  const handleClearStorage = () => {
    localStorage.removeItem("formData");
    const defaultData = localStorage.getItem('formDataDefault');
    const parsedDefaultData = JSON.parse(defaultData);
    setData(parsedDefaultData);
    setReloadKey(prev => prev + 1);
    showToast('¡El storage se ha limpiado con éxito!', 'success');
  };

  const defaultData = localStorage.getItem('formDataDefault');
  const parsedDefaultData = JSON.parse(defaultData);
  const { downloadJson } = HandleDownload({ data, parsedDefaultData });

  const handleDownload = () => {
    downloadJson();
  };

  const handleLoadVisor = (visor) => {
    const configJson = typeof visor.json === 'string' ? JSON.parse(visor.json) : visor.json;
    localStorage.setItem('formData', JSON.stringify(configJson));
    window.location.reload();
  };

  const sectionKeys = schema?.properties ? Object.keys(schema.properties) : [];

  return (
    <div>
      <div className="editor-container" key={reloadKey}>
        <Navbar
          config={data}
          sectionInfo={{ sectionKeys, selectedSection, handleSectionChange }}
          uiControls={{
            handleLanguageChange,
            selectedLang,
            isFormShown,
            setIsFormShown,
            handleClearStorage
          }}
          actions={{
            handleDownload,
            handleJsonUpload,
          }}
          language={language}
          openVisorManager={() => setIsVisorModalOpen(true)}
        />

        {isFormShown && selectedSection && (
          <div className="form-container">
            <div className="custom-form-group">
              <JsonForms
                schema={schema.properties[selectedSection]}
                data={data[selectedSection]}
                renderers={customRenderers}
                cells={materialCells}
                ajv={ajv}
                onChange={({ data: updatedData }) => {
                  setData(prevData => {
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
          </div>
        )}

        <VisorManagerModal
          isOpen={isVisorModalOpen}
          onClose={() => setIsVisorModalOpen(false)}
          onLoad={handleLoadVisor}
          currentJson={data}
        />

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

export default App;
