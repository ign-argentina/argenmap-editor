import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import { useLocation } from 'react-router-dom';
import ColorPickerControl from '../ColorPickerControl/ColorPickerControl';
import Preview from '../Preview/Preview';
import FormNavbar from '../FormNavbar/FormNavbar';
import '/src/global.css';
import './Form.css';
import { useToast } from '../../context/ToastContext';
import defaultConfig from '../../static/config.json';
import language from '../../static/language.json';
import GenerateSchema from '../../utils/GenerateSchema';
import FilterEmptySections from '../../utils/FilterEmptySections';
import TranslateSchema from '../../utils/TranslateSchema';
import { downloadViewer, mergeViewer } from '../../utils/ViewerHandler';

function Form() {
  const location = useLocation();
  const { viewer, editorMode, externalUpload = false } = location.state || {};
  const [config, setConfig] = useState();
  const [workingConfig, setWorkingConfig] = useState(null);
  const [schema, setSchema] = useState({});
  const [schemaLoaded, setSchemaLoaded] = useState(false)

  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);
  const [selectedSection, setSelectedSection] = useState(null);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // No te vayas!

  const uploadSchema = (config) => {
    if (!config || !language) return;

    const generatedSchema = GenerateSchema({ data: config });
    const filteredSchema = FilterEmptySections(generatedSchema);
    const translatedSchema = TranslateSchema({
      schema: filteredSchema,
      translations: language[selectedLang] || language['default'],
      defaultTranslations: language['default'] || {},
    });

    setSchema(translatedSchema);

    const sectionKeys = Object.keys(translatedSchema.properties || {});

    setSelectedSection((prev) => {
      if (!prev || !sectionKeys.includes(prev)) {
        return sectionKeys[0] || null;
      }
      return prev;
    });
  };

  useEffect(() => {
    if (viewer || externalUpload) {
      setConfig(externalUpload ? externalUpload : viewer.config.json);

      if (workingConfig) {
        setWorkingConfig(workingConfig)
      } else {
        setWorkingConfig(externalUpload ? externalUpload : viewer.config.json);
      }

    } else {
      setConfig(defaultConfig);
      setWorkingConfig(defaultConfig);
    }
    setSchemaLoaded(true)
  }, []);

  useEffect(() => {
    uploadSchema(workingConfig);
  }, [schemaLoaded]);

  // No te vayas! Se pueden borrar los cambios!! (OPTIMIZAR)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  // Fin no te vayas (OPTIMIZAR)

  const { showToast } = useToast();

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

  const handleDownload = () => {
    console.log("Eu tenho que descargar")
    downloadViewer(workingConfig, config)
  };

  const getWorkingConfig = () => {
    return mergeViewer(workingConfig, config)
  }
  
  const handleJsonFormsChange = (updatedData) => {
    setHasUnsavedChanges(true);
    const hasChanged = JSON.stringify(workingConfig[selectedSection]) !== JSON.stringify(updatedData);
    if (hasChanged) {
      setWorkingConfig((prevConfig) => ({
        ...prevConfig,
        [selectedSection]: updatedData,
      }));
    }
  };

  return (
    <div>
      <div className="editor-container">
        <FormNavbar
          config={config}
          viewer={viewer}
          sectionInfo={{ sectionKeys: Object.keys(schema?.properties || {}), selectedSection, handleSectionChange }}
          uiControls={{
            handleLanguageChange,
            selectedLang,
            isFormShown: true,
            setIsFormShown: () => { }
          }}
          actions={{ handleDownload, getWorkingConfig }}
          editorMode={editorMode}
        />
        {selectedSection && (
          <div className="form-container">
            <div className="custom-form-group">
              <JsonForms
                schema={schema.properties?.[selectedSection]}
                data={workingConfig?.[selectedSection]}
                renderers={customRenderers}
                cells={materialCells}
                onChange={({ data: updatedData }) => handleJsonFormsChange(updatedData)} // Usamos la nueva función de manejo
              />
            </div>
          </div>
        )}

        <div className="side-panel">
          <Preview />
        </div>
      </div>
    </div>
  );
}

export default Form;