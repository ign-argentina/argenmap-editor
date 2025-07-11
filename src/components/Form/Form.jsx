import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import { useLocation } from 'react-router-dom';
import useFormEngine from '../../hooks/useFormEngine';
import ColorPickerControl from '../ColorPickerControl/ColorPickerControl';
import Preview from '../Preview/Preview';
import FormNavbar from '../FormNavbar/FormNavbar';
import HandleDownload from '../../utils/HandleDownload';
import { updateVisorConfigJson } from '../../utils/visorStorage';
import { handleClearStorage } from '../../utils/HandleClearStorage';
import '/src/global.css';
import './Form.css';
import { useToast } from '../../context/ToastContext';

function Form() {
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

  const location = useLocation();
  const [isFormShown, setIsFormShown] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedVisor, setLoadedVisor] = useState(null);
  const clearStorage = () => handleClearStorage(setData, uploadSchema);
  const { showToast } = useToast()

  useEffect(() => {
    const savedVisor = localStorage.getItem('visorMetadata');
    if (savedVisor) {
      setLoadedVisor(JSON.parse(savedVisor));
    }

  }, []);

  useEffect(() => {
    if (selectedLang && data) {
      uploadSchema(data);
    }
  }, [selectedLang, data]);

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

  const { editorMode } = location.state || {};

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
          editorMode={editorMode}
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

        <div className='side-panel'>
          <Preview />
        </div>
      </div>
    </div>
  );
}
export default Form;