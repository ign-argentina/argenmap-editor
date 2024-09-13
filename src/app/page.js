'use client'
import { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Preview from './components/Preview';
import useConfig from '../app/hooks/useConfig';

// Schema completo del JSON
const schema = 
{
  "type": "object",
  "properties": {
    "version": { "type": "string" },
    "app": {
      "type": "object",
      "properties": {
        "logo": {
          "type": "object",
          "properties": {
            "alt": { "type": "string" },
            "title": { "type": "string" }
          }
        },
        "language": { "type": "string" },
        "website": { "type": "string" },
        "favicon": { "type": "string" }
      }
    },
    "plugins": {
      "type": "object",
      "properties": {
        "geoprocesos": {
          "type": "object",
          "properties": {
            "isActive": { "type": "boolean" },
            "curvas": {
              "type": "object",
              "properties": {
                "isActive": { "type": "boolean" },
                "name": { "type": "string" },
                "geoprocess": { "type": "string" },
                "namePrefix": { "type": "string" },
                "layer": { "type": "string" },
                "baseUrl": { "type": "string" },
                "styles": {
                  "type": "object",
                  "properties": {
                    "line_color": { "type": "string" },
                    "line_weight": { "type": "number" },
                    "d_line_m": { "type": "number" },
                    "d_line_color": { "type": "string" },
                    "d_weigth": { "type": "number" },
                    "smoothFactor": { "type": "number" }
                  }
                }
              }
            },
            "cota": {
              "type": "object",
              "properties": {
                "isActive": { "type": "boolean" },
                "name": { "type": "string" },
                "geoprocess": { "type": "string" },
                "namePrefix": { "type": "string" },
                "layer": { "type": "string" },
                "baseUrl": { "type": "string" }
              }
            }
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


// `uiSchema` para cada sección
const uiSchemas = {
  "version": {
    "type": "Control",
    "scope": "#/properties/version",
    "options": {
      "label": "Version"
    }
  },
  "app": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Group",
        "label": "Logo",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/logo/properties/alt",
            "options": {
              "label": "Logo Alt Text"
            }
          },
          {
            "type": "Control",
            "scope": "#/properties/logo/properties/title",
            "options": {
              "label": "Logo Title"
            }
          }
        ]
      },
      {
        "type": "Control",
        "scope": "#/properties/language",
        "options": {
          "label": "Language"
        }
      },
      {
        "type": "Control",
        "scope": "#/properties/website",
        "options": {
          "label": "Website"
        }
      },
      {
        "type": "Control",
        "scope": "#/properties/favicon",
        "options": {
          "label": "Favicon"
        }
      }
    ]
  },
  "plugins": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Group",
        "label": "Geoprocesos",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/geoprocesos/properties/isActive",
            "options": {
              "label": "Active"
            }
          },
          {
            "type": "Group",
            "label": "Curvas",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/curvas/properties/isActive",
                "options": {
                  "label": "Active"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/curvas/properties/name",
                "options": {
                  "label": "Name"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/curvas/properties/geoprocess",
                "options": {
                  "label": "Geoprocess"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/curvas/properties/namePrefix",
                "options": {
                  "label": "Name Prefix"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/curvas/properties/layer",
                "options": {
                  "label": "Layer"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/curvas/properties/baseUrl",
                "options": {
                  "label": "Base URL"
                }
              },
              {
                "type": "Group",
                "label": "Styles",
                "elements": [
                  {
                    "type": "Control",
                    "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/line_color",
                    "options": {
                      "label": "Line Color"
                    }
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/line_weight",
                    "options": {
                      "label": "Line Weight"
                    }
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/d_line_m",
                    "options": {
                      "label": "D Line M"
                    }
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/d_line_color",
                    "options": {
                      "label": "D Line Color"
                    }
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/d_weigth",
                    "options": {
                      "label": "D Weight"
                    }
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/geoprocesos/properties/curvas/properties/styles/properties/smoothFactor",
                    "options": {
                      "label": "Smooth Factor"
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "Group",
            "label": "Cota",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/cota/properties/isActive",
                "options": {
                  "label": "Active"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/cota/properties/name",
                "options": {
                  "label": "Name"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/cota/properties/geoprocess",
                "options": {
                  "label": "Geoprocess"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/cota/properties/namePrefix",
                "options": {
                  "label": "Name Prefix"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/cota/properties/layer",
                "options": {
                  "label": "Layer"
                }
              },
              {
                "type": "Control",
                "scope": "#/properties/geoprocesos/properties/cota/properties/baseUrl",
                "options": {
                  "label": "Base URL"
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "resources": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Control",
        "scope": "#/properties/leaflet",
        "options": {
          "label": "Leaflet URL"
        }
      }
    ]
  }
}



// Datos iniciales
const initialData = {
  version: "1.0.0",
  app: {
    logo: {
      alt: "Viewer logo image",
      title: "Logo image"
    },
    language: "en",
    website: "https://github.com/ign-argentina/argenmap",
    favicon: "src/styles/images/favicon.ico"
  },
  plugins: {
    geoprocesos: {
      isActive: false,
      curvas: {
        isActive: false,
        name: "Curvas de Nivel"
      },
      cota: {
        isActive: false,
        name: "Cota"
      }
    }
  },
  resources: {
    leaflet: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  }
};

export default function Page() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const [data, setData] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    if (config) {
      setData(config); // Actualiza data cuando config esté disponible
    }
  }, [config]);

  // Extraer las claves principales del JSON para generar secciones dinámicamente
  const sectionKeys = Object.keys(schema.properties);

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
