import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import useLang from './hooks/useLang';
import useFormEngine from './hooks/useFormEngine';
import ColorPickerControl from './components/ColorPickerControl';
import HandleDownload from './utils/HandleDownload';
import Toast from './components/Toast';
import { updateVisorConfigJson } from './utils/visorStorage';
import { handleClearStorage } from './utils/HandleClearStorage';
import FormNavbar from './components/FormNavbar';
import './global.css';

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
  const clearStorage = () => handleClearStorage(setData, uploadSchema);

  //useEffect para cargar mostrar los datos del visor cargado
  useEffect(() => {
    const savedVisor = localStorage.getItem('visorMetadata');
    if (savedVisor) {
      setLoadedVisor(JSON.parse(savedVisor));
    }
  }, []);

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
