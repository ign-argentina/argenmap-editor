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

  /*   Esto ya lo estamos manejando en el hook. Asi que está de mas
    const savedLanguage = localStorage.getItem('selectedLang') || 'es';
    const [selectedLang, setSelectedLang] = useState(savedLanguage); */

  const {
    data,
    setData,
    schema,
    selectedSection,
    setSelectedSection,
    ajv,
    uploadSchema,
    selectedLang,
    setSelectedLang
  } = useFormEngine(); // Antes era useFormEngine({ config, language, selectedLang }); Use Form Engine no acepta parametros, estan de mas. Y como el hook ya maneja
  // el lenguaje, lo traemos de ahi

  const [isFormShown, setIsFormShown] = useState(true);
  const [isVisorModalOpen, setIsVisorModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedVisor, setLoadedVisor] = useState(null);

  //useEffect para cargar mostrar los datos del visor cargado
  useEffect(() => {
    const savedVisor = localStorage.getItem('visorMetadata');
    if (savedVisor) {
      setLoadedVisor(JSON.parse(savedVisor));
    }
  }, []);


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
    // Guardar parsedData como formDataDefault
    localStorage.setItem('formDataDefault', JSON.stringify(parsedData));

    // Actualizar visorMetadata
    try {
      const rawMetadata = localStorage.getItem('visorMetadata');
      const metadata = rawMetadata ? JSON.parse(rawMetadata) : {};

      // Asegurarse de que existan los objetos necesarios
      metadata.config = metadata.config || {};
      metadata.config.json = parsedData;

      // Guardar visorMetadata actualizado
      localStorage.setItem('visorMetadata', JSON.stringify(metadata));
    } catch (e) {
      console.error('Error actualizando visorMetadata:', e);
    }

    // Aplicar cambios
    setData(parsedData);
    uploadSchema(parsedData);
    window.location.reload();
    showToast('JSON cargado exitosamente', 'success');
  };


  //DESHABILITADO HASTA REALIZARLE UN REWORK
  // const handleClearStorage = () => {
  //   localStorage.removeItem("formData");
  //   const defaultData = localStorage.getItem('formDataDefault');
  //   const parsedDefaultData = JSON.parse(defaultData);
  //   setData(parsedDefaultData);
  //   setReloadKey(prev => prev + 1);
  //   showToast('¡El storage se ha limpiado con éxito!', 'success');
  // };

  const defaultData = localStorage.getItem('formDataDefault');
  const parsedDefaultData = JSON.parse(defaultData);
  const { downloadJson } = HandleDownload({ data, parsedDefaultData });

  const handleDownload = () => {
    downloadJson();
  };

  const handleLoadVisor = (visorCompleto) => {
    const configJson = typeof visorCompleto.config.json === 'string'
      ? JSON.parse(visorCompleto.config.json)
      : visorCompleto.config.json;

    // Actualizar visorMetadata con visorCompleto y su config.json
    try {
      visorCompleto.config.json = configJson;
      localStorage.setItem('visorMetadata', JSON.stringify(visorCompleto));
    } catch (e) {
      console.error('Error guardando visorMetadata:', e);
    }

    setLoadedVisor(visorCompleto);
    window.location.reload();
  };


  const sectionKeys = schema?.properties ? Object.keys(schema.properties) : [];

  return (
    <div>
      <div className="editor-container" key={reloadKey}>
        <Navbar
          config={data}
          visor={loadedVisor}
          sectionInfo={{ sectionKeys, selectedSection, handleSectionChange }}
          uiControls={{
            handleLanguageChange,
            selectedLang,
            isFormShown,
            setIsFormShown,
            // handleClearStorage
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

                    // Guardar en visorMetadata.config.json
                    try {
                      const rawMetadata = localStorage.getItem('visorMetadata');
                      const metadata = rawMetadata ? JSON.parse(rawMetadata) : {};
                      metadata.config = metadata.config || {};
                      metadata.config.json = newData;
                      localStorage.setItem('visorMetadata', JSON.stringify(metadata));
                    } catch (e) {
                      console.error('Error actualizando visorMetadata:', e);
                    }

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
