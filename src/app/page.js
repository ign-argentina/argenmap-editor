'use client'
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Preview from './components/Preview';
import useConfig from '../app/hooks/useConfig';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ColorPickerControl from '../app/components/ColorPickerControl';
import { rankWith, schemaMatches, uiTypeIs, and } from '@jsonforms/core';


const NEWschema = {
  "type": "object",
  "properties": {
    "app": {
      "type": "object",
      "properties": {
        "version": { "type": "string" }
      }
    },
    "ui": {
      "type": "object",
      "properties": {
        "theme": {
          "type": "object",
          "properties": {
            "bodyBackground": { "type": "string", "format": "color" },
            "headerBackground": { "type": "string", "format": "color" },
            "menuBackground": { "type": "string", "format": "color" },
            "activeLayer": { "type": "string", "format": "color" },
            "textMenu": { "type": "string" },
            "textMenuStyle": { "type": "string" },
            "textLegendMenu": { "type": "string", "format": "color" },
            "textLegendMenuStyle": { "type": "string" },
            "iconBar": { "type": "string", "format": "color" }
          }
        }
      }
    },
    "resources": {
      "type": "object",
      "properties": {
        "leaflet": { "type": "string" }
      }
    }
  }
}

const NEWuischema =  {
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Group",
      "label": "App Configuration",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties/app/properties/version",
          "label": "App Version"
        }
      ]
    },
    {
      "type": "Group",
      "label": "UI Theme",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/bodyBackground",
          "label": "Body Background Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/headerBackground",
          "label": "Header Background Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/menuBackground",
          "label": "Menu Background Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/activeLayer",
          "label": "Active Layer Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/textMenu",
          "label": "Text Menu Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/textLegendMenu",
          "label": "Text Legend Menu Color"
        },
        {
          "type": "Control",
          "scope": "#/properties/ui/properties/theme/properties/iconBar",
          "label": "Icon Bar Color"
        }
      ]
    },
    {
      "type": "Group",
      "label": "Resources",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties/resources/properties/leaflet",
          "label": "Leaflet URL"
        }
      ]
    }
  ]
}


export default function Page() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const [data, setData] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [schema, setSchema] = useState({});
  const [uiSchemas, setUiSchema] = useState({});
  const [isFormShown, setIsFormShown] = useState(true);  // Asume que inicialmente quieres mostrar algo

   const colorPickerTester = rankWith(
    3,
    and(
      uiTypeIs('Control'),
      schemaMatches((schema) => schema.format === 'color')
    )
  );
  const customRenderers = [
    ...materialRenderers, // Mantén los renderers de Material por defecto
    { tester: colorPickerTester, renderer: ColorPickerControl } // Agrega el control personalizado
  ];
  

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
          // Filtrar la clave 'sectionIcon'
          if (key !== 'sectionIcon') {
            schema.properties[key] = createSchema(obj[key]);
          }
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
      const generatedSchema = NEWschema;
      setSchema(generatedSchema);
    }
  }, [config]);

  const generateUiSchema = (config, title) => {
    const createUiSchema = (obj, title) => {
      if (typeof obj !== 'object' || obj === null) {
        return { type: 'Control', scope: `#/properties/${title}` };
      }

      const elements = [];
      Object.keys(obj).forEach(key => {
        // Filtrar la clave 'sectionIcon'
        if (key !== 'sectionIcon') {
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
        }
      });

      return { type: 'VerticalLayout', elements };
    };

    return createUiSchema(config, 'root');
  };


  useEffect(() => {
    if (config) {
      const generatedUiSchema = NEWuischema;
      setUiSchema(generatedUiSchema);
    }
  }, [config]);

  const sectionKeys = schema && schema.properties ? Object.keys(schema.properties) : [];

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleDownload = () => {
    // Chequeo de campos borrados.
    // Un campo vacío es borrado por JSONForms.
    // Si es borrado se lo crea de nuevo vacío
    const ensureFieldsExist = (obj, reference) => {
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        return obj;
      }
      const result = { ...obj };
      Object.keys(reference).forEach((key) => {
        if (!(key in obj)) {
          // Si la clave no existe en obj, la añadimos con un valor vacío
          result[key] = reference[key] === 'string' ? '' : "";
        } else if (typeof reference[key] === 'object' && reference[key] !== null) {
          // Si la clave existe pero es un objeto, volvemos a aplicar la función recursivamente
          result[key] = ensureFieldsExist(obj[key], reference[key]);
        }
      });
      return result;
    };
    const completeData = ensureFieldsExist(data, config);
    const fileData = JSON.stringify(completeData, null, 2);
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
          <button
            key={key}
            onClick={() => handleSectionChange(key)}
            className={`navbar-button ${selectedSection === key ? 'active' : ''}`}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
          >
            {config[key]?.sectionIcon && (
              <i className={config[key].sectionIcon}></i>
            )}
          </button>
        ))}


        <button className="download-button" onClick={handleDownload} title="Descargar JSON">
          <i className="fa-solid fa-download"></i>
        </button>
      </div>
      {isFormShown && (<div className="form-container">
        <div>
          {selectedSection && (
            <JsonForms
              schema={schema.properties[selectedSection]}
              uischema={uiSchemas[selectedSection]}
              data={data[selectedSection]}
              renderers={customRenderers}
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
