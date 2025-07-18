import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';
import { useLocation } from 'react-router-dom';
/* import useFormEngine from '../../hooks/useFormEngine'; */
import ColorPickerControl from '../ColorPickerControl/ColorPickerControl';
import Preview from '../Preview/Preview';
import FormNavbar from '../FormNavbar/FormNavbar';
import HandleDownload from '../../utils/HandleDownload';
import { updateVisorConfigJson } from '../../utils/visorStorage';
import '/src/global.css';
import './Form.css';
import { useToast } from '../../context/ToastContext';
/* import { setViewer } from '../../utils/HandleClearStorage'; */
import defaultConfig from '../../static/config.json';
import language from '../../static/language.json';
import GenerateSchema from '../../utils/GenerateSchema';
import FilterEmptySections from '../../utils/FilterEmptySections';
import TranslateSchema from '../../utils/TranslateSchema';
// import MergeDataWithDefaults from '../utils/MergeDataWithDefaults';

function Form() {
  /*   const {
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
    // el lenguaje, lo traemos de ahi */

  /*   const [defaultViewer, setDefaultViewer] = useState() */

  const location = useLocation();
  const { viewer, editorMode } = location.state || {};
  const [baseConfig, setBaseConfig] = useState()
  const [workingConfig, setWorkingConfig] = useState()
  const [schema, setSchema] = useState({});

  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);

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
    console.log(translatedSchema)
    // const sectionKeys = Object.keys(translatedSchema.properties || {});

    // setSelectedSection((prev) => {
    //   if (!prev || !sectionKeys.includes(prev)) {
    //     return sectionKeys[0] || null;
    //   }
    //   return prev;
    // });

    // return translatedSchema;
  };

  useEffect(() => {
    if (viewer) {
   
      console.log("Llego viewer!! Traeme la config")
      console.log(viewer.config.json)
      setBaseConfig(viewer.config.json)
      setWorkingConfig(viewer.config.json)
    } else {
      console.log("No llego nada, cargamos la default")
      setBaseConfig(defaultConfig)
      setWorkingConfig(defaultConfig)
    }
  }, []);
  
  useEffect(() => {
    uploadSchema(workingConfig)
  }, [workingConfig]);

  const [isFormShown, setIsFormShown] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedVisor, setLoadedVisor] = useState(null);
  const { showToast } = useToast()

  useEffect(() => {
    const savedVisor = localStorage.getItem('visorMetadata');
    if (savedVisor) {
      setLoadedVisor(JSON.parse(savedVisor));
    }

  }, []);

  /*   useEffect(() => {
      if (selectedLang && data) {
        uploadSchema(data);
      }
    }, [selectedLang, data]);
  
    const handleLanguageChange = (e) => {
      const selectedLanguage = e.target.value;
      setSelectedLang(selectedLanguage);
      localStorage.setItem('selectedLang', selectedLanguage);
  
    }; */

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  /*   const colorPickerTester = rankWith(
      3,
      and(uiTypeIs('Control'), schemaMatches((schema) => schema.format === 'color'))
    );
   */
  /*   const customRenderers = [
      ...materialRenderers,
      { tester: colorPickerTester, renderer: ColorPickerControl }
    ];
   */
  /*   const defaultData = localStorage.getItem('formDataDefault');
    const parsedDefaultData = JSON.parse(defaultData);
    const { downloadJson } = HandleDownload({ data, parsedDefaultData }); */

  const handleDownload = () => {
    downloadJson();
  };

  /*   const sectionKeys = schema?.properties ? Object.keys(schema.properties) : []; */

  return (
    <div>
      <div className="editor-container" key={reloadKey}>
        {/*   <FormNavbar
          config={defaultViewer}
          visor={loadedVisor}
          sectionInfo={{ sectionKeys, selectedSection, handleSectionChange }}
          uiControls={{
            handleLanguageChange,
            selectedLang,
            isFormShown,
            setIsFormShown,
          }}
          actions={{
            handleDownload,
          }}
          editorMode={editorMode}
        /> */}

        {/*         {isFormShown && selectedSection && (
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
 */}
        <div className='side-panel'>
          <Preview />
        </div>
      </div>
    </div>
  );
}
export default Form;