'use client'
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Preview from './components/Preview';
import useConfig from '../app/hooks/useConfig';

// // Schema completo del JSON
// const schema =
// {
//   "type": "object",
//   "properties": {
//     "version": { "type": "string" },
//     "app": {
//       "type": "object",
//       "properties": {
//         "logo": {
//           "type": "object",
//           "properties": {
//             "alt": { "type": "string" },
//             "title": { "type": "string" }
//           }
//         },
//         "language": { "type": "string" },
//         "website": { "type": "string" },
//         "favicon": { "type": "string" }
//       }
//     },
//     "plugins": {
//       "type": "object",
//       "properties": {
//         "geoprocesos": {
//           "type": "object",
//           "properties": {
//             "isActive": { "type": "boolean" },
//             "curvas": {
//               "type": "object",
//               "properties": {
//                 "isActive": { "type": "boolean" },
//                 "name": { "type": "string" },
//                 "geoprocess": { "type": "string" },
//                 "namePrefix": { "type": "string" },
//                 "layer": { "type": "string" },
//                 "baseUrl": { "type": "string" },
//                 "styles": {
//                   "type": "object",
//                   "properties": {
//                     "line_color": { "type": "string" },
//                     "line_weight": { "type": "number" },
//                     "d_line_m": { "type": "number" },
//                     "d_line_color": { "type": "string" },
//                     "d_weigth": { "type": "number" },
//                     "smoothFactor": { "type": "number" }
//                   }
//                 }
//               }
//             },
//             "cota": {
//               "type": "object",
//               "properties": {
//                 "isActive": { "type": "boolean" },
//                 "name": { "type": "string" },
//                 "geoprocess": { "type": "string" },
//                 "namePrefix": { "type": "string" },
//                 "layer": { "type": "string" },
//                 "baseUrl": { "type": "string" }
//               }
//             }
//           }
//         }
//       }
//     },
//     "resources": {
//       "type": "object",
//       "properties": {
//         "leaflet": { "type": "string" }
//       }
//     }
//   }
// }
// // `uiSchema` para cada sección
// const uiSchemas = {
//   "version": {
//     "type": "Control",
//     "scope": "#/properties/version",
//     "options": {
//       "label": "Version"
//     }
//   },
//   "app": {
//     "type": "VerticalLayout",
//     "elements": [
//       {
//         "type": "Group",
//         "label": "Logo",
//         "elements": [
//           {
//             "type": "Control",
//             "scope": "#/properties/logo/properties/alt",
//             "options": {
//               "label": "Logo Alt Text"
//             }
//           },
//           {
//             "type": "Control",
//             "scope": "#/properties/logo/properties/title",
//             "options": {
//               "label": "Logo Title"
//             }
//           }
//         ]
//       },
//       {
//         "type": "Control",
//         "scope": "#/properties/language",
//         "options": {
//           "label": "Language"
//         }
//       },
//       {
//         "type": "Control",
//         "scope": "#/properties/website",
//         "options": {
//           "label": "Website"
//         }
//       },
//       {
//         "type": "Control",
//         "scope": "#/properties/favicon",
//         "options": {
//           "label": "Favicon"
//         }
//       }
//     ]
//   },
//   "plugins": {
//     "type": "VerticalLayout",
//     "elements": [
//       {
//         "type": "Group",
//         "label": "Geoprocesos",
//         "elements": [
//           {
//             "type": "Control",
//             "scope": "#/properties/geoprocesos/properties/isActive",
//             "options": {
//               "label": "Active"
//             }
//           },
//           {
//             "type": "Group",
//             "label": "Curvas",
//             "elements": [
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/curvas/properties/isActive",
//                 "options": {
//                   "label": "Active"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/curvas/properties/name",
//                 "options": {
//                   "label": "Name"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/curvas/properties/geoprocess",
//                 "options": {
//                   "label": "Geoprocess"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/curvas/properties/namePrefix",
//                 "options": {
//                   "label": "Name Prefix"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/curvas/properties/layer",
//                 "options": {
//                   "label": "Layer"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/curvas/properties/baseUrl",
//                 "options": {
//                   "label": "Base URL"
//                 }
//               },
//               {
//                 "type": "Group",
//                 "label": "Styles",
//                 "elements": [
//                   {
//                     "type": "Control",
//                     "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/line_color",
//                     "options": {
//                       "label": "Line Color"
//                     }
//                   },
//                   {
//                     "type": "Control",
//                     "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/line_weight",
//                     "options": {
//                       "label": "Line Weight"
//                     }
//                   },
//                   {
//                     "type": "Control",
//                     "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/d_line_m",
//                     "options": {
//                       "label": "D Line M"
//                     }
//                   },
//                   {
//                     "type": "Control",
//                     "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/d_line_color",
//                     "options": {
//                       "label": "D Line Color"
//                     }
//                   },
//                   {
//                     "type": "Control",
//                     "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/d_weigth",
//                     "options": {
//                       "label": "D Weight"
//                     }
//                   },
//                   {
//                     "type": "Control",
//                     "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/smoothFactor",
//                     "options": {
//                       "label": "Smooth Factor"
//                     }
//                   }
//                 ]
//               }
//             ]
//           },
//           {
//             "type": "Group",
//             "label": "Cota",
//             "elements": [
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/cota/properties/isActive",
//                 "options": {
//                   "label": "Active"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/cota/properties/name",
//                 "options": {
//                   "label": "Name"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/cota/properties/geoprocess",
//                 "options": {
//                   "label": "Geoprocess"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/cota/properties/namePrefix",
//                 "options": {
//                   "label": "Name Prefix"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/cota/properties/layer",
//                 "options": {
//                   "label": "Layer"
//                 }
//               },
//               {
//                 "type": "Control",
//                 "scope": "#/properties/geoprocesos/properties/cota/properties/baseUrl",
//                 "options": {
//                   "label": "Base URL"
//                 }
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   "resources": {
//     "type": "VerticalLayout",
//     "elements": [
//       {
//         "type": "Control",
//         "scope": "#/properties/leaflet",
//         "options": {
//           "label": "Leaflet URL"
//         }
//       }
//     ]
//   }
// }


export default function Page() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const [data, setData] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [schema, setSchema] = useState({});
  const [uiSchemas, setUiSchema] = useState({});

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



  // Extraer las claves principales del JSON para generar secciones dinámicamente
// Asegúrate de que schema y sus propiedades estén definidos antes de intentar acceder a ellas
const sectionKeys = schema && schema.properties ? Object.keys(schema.properties) : [];
  // console.log("schema:",schema.properties)

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    console.log("data:", data);
  };

  const handleDownload = () => {
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.json');
    document.body.appendChild(link);
    link.click();
  };



  return (
    <div className="editor-container">

      {/* Botones generados dinámicamente según las claves del JSON */}
      <div className='navbar'>
        <div className="logo-container">
          <img src="/logos/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="version-info">
          <label>Versión: a.b.c </label>
        </div>
        {sectionKeys.map((key) => (
          <button key={key} onClick={() => handleSectionChange(key)} className='navbar-button'>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
      <div className="form-container">


        {/* Renderización dinámica del formulario según la sección seleccionada */}
        <div>
          {selectedSection && (
            <>
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
            </>
          )}
        </div>

        <div className="download-button-container">
          <button onClick={handleDownload}>Download JSON</button>
        </div>
      </div>
      <div className="preview-container">
        <Preview />
      </div>
    </div>
  );
}
