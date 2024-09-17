'use client'
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Preview from './components/Preview';
import useConfig from '../app/hooks/useConfig';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import ColorPickerControl from '../app/components/ColorPickerControl';

export default function Page() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const [data, setData] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [schema, setSchema] = useState({});
  const [uiSchemas, setUiSchema] = useState({});
  const [isFormShown, setIsFormShown] = useState(true);  // Asume que inicialmente quieres mostrar algo

  // const customRenderers = [
  //   ...materialRenderers,
  //   { tester: (schema) => (schema && schema.format === 'color'), renderer: ColorPickerControl }
  // ];

  useEffect(() => {
    if (config) {
      setData(config); // Actualiza data cuando config esté disponible
    }
  }, [config]);

  const generateSchema = (config) => {
    const createSchema = (obj) => {
      if (Array.isArray(obj)) {
        return { type: 'array', items: createSchema(obj[0]) }; // Assuming all items are of the same type
      } else if (typeof obj === 'object' && obj !== null) {
        const schema = { type: 'object', properties: {} };

        Object.keys(obj).forEach(key => {
          schema.properties[key] = createSchema(obj[key]);
        });

        return schema;
      } else if (typeof obj === 'string' && /^#[0-9A-F]{6}$/i.test(obj)) {
        return { type: 'string', format: 'color' }; // Detecta campos de tipo color
      } else {
        return { type: typeof obj };
      }
    };

    return createSchema(config);
  };

  useEffect(() => {
    if (config) {
      const generatedSchema = generateSchema(config);
      setSchema(generatedSchema);
    }
  }, [config]);

  const generateUiSchema = (config) => {
    const createUiSchema = (obj, title) => {
      if (typeof obj !== 'object' || obj === null) {
        return { type: 'Control', scope: `#/properties/${title}` };
      }

      const elements = [];
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          elements.push({
            type: 'Group',
            label: key.charAt(0).toUpperCase() + key.slice(1),
            elements: [createUiSchema(obj[key], key)]
          });
        } else {
          elements.push({
            type: 'Control',
            scope: `#/properties/${key}`,
            options: { label: key.charAt(0).toUpperCase() + key.slice(1) }
          });
        }
      });

      return { type: 'VerticalLayout', elements };
    };

    return createUiSchema(config, 'root');
  };

  useEffect(() => {
    if (config) {
      const generatedUiSchema = generateUiSchema(config);
      setUiSchema(generatedUiSchema);
    }
  }, [config]);

  const sectionKeys = schema && schema.properties ? Object.keys(schema.properties) : [];

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleDownload = () => {
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'config.json');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="editor-container">
      <div className='navbar'>
        <div className="logo-container">
          <img src="/logos/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="version-info">
          <label>Versión de Config: {config ? config.app.version : 'Sin versión...'}</label>
        </div>

        <button className="showHide-button" onClick={() => setIsFormShown(!isFormShown)} title="Mostrar/Ocultar Formularios">
          <i className={isFormShown ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
        </button>

        {sectionKeys.map((key) => (
          <button key={key} onClick={() => handleSectionChange(key)} className='navbar-button' title={key.charAt(0).toUpperCase() + key.slice(1)}>
            {config[key]?.sectionIcon && (
              <i className={config[key].sectionIcon}></i>
            )}
          </button>
        ))}

        <div className="download-button">
          <button onClick={handleDownload} title="Descargar JSON">
            <i class="fa-solid fa-download"></i>
          </button>
        </div>
      </div>
      {isFormShown && (<div className="form-container">
        <div>
          {selectedSection && (
            <JsonForms
              schema={schema.properties[selectedSection]}
              uischema={uiSchemas[selectedSection]}
              data={data[selectedSection]}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ data: updatedData }) => setData(prevData => ({
                ...prevData,
                [selectedSection]: updatedData
              }))}
            />
          )}
        </div>
      </div>)}
      <div className="preview-container">
        <Preview />
      </div>
    </div>
  );
}
