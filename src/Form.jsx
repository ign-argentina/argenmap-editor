import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import useLang from './hooks/useLang';
import useFormEngine from './hooks/useFormEngine';
import FormNavbar from './components/FormNavbar';
import ColorPickerControl from './utils/ColorPickerControl';
import HandleDownload from './utils/HandleDownload';
import Toast from './utils/Toast';
import './global.css';
import { updateVisorConfigJson } from './utils/visorStorage';


function Form() {

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
    // window.location.reload();
    showToast('JSON cargado exitosamente', 'success');
  };


  //DESHABILITADO HASTA REALIZARLE UN REWORK
  const handleClearStorage = () => {
    localStorage.removeItem("visorMetadata");
    const defaultData = localStorage.getItem('formDataDefault');
    const parsedDefaultData = JSON.parse(defaultData);
    setData(parsedDefaultData);
    uploadSchema(parsedDefaultData);
    // showToast('¡El storage se ha limpiado con éxito!', 'success');
  };

  const defaultData = localStorage.getItem('formDataDefault');
  const parsedDefaultData = JSON.parse(defaultData);
  const { downloadJson } = HandleDownload({ data, parsedDefaultData });

  const handleDownload = () => {
    downloadJson();
  };





  const sectionKeys = schema?.properties ? Object.keys(schema.properties) : [];

  return (
    <div>
      <div className="editor-container" key={reloadKey}>
        <FormNavbar
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
                    updateVisorConfigJson(newData);

                    return newData;
                  });
                }}

              />
            </div>
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


      </div>
    </div>
  );
}

export default Form;
