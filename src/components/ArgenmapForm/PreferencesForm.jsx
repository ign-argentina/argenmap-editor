import React, { useState, useEffect, useRef, useCallback } from "react";
import "./PreferencesForm.css";

const defaultPreferences = {
  table: {
    isActive: false,
    rowsLimit: 5,
  },
  charts: {
    isActive: true,
  },
  layer_options: {
    isActive: false,
  },
  metaTags: {
    title: "",
    description: "",
    image: "",
  },
  analytics_ids: [],
  excluded_plugins: ["minimap"],
  mapConfig: {
    center: {
      latitude: -40,
      longitude: -59,
    },
    zoom: {
      initial: 4,
      min: 3,
      max: 21,
    },
  },
  service: {
    wmts: {
      maxZoom: 21,
    },
  },
  showSearchBar: true,
  searchbar: {
    isActive: true,
    top: "5px",
    left: "40%",
    color_focus: "#008dc9",
    background_color: "rgba(255, 255, 255, 0.7)",
    strings: {
      placeholder: "Buscar lugar...",
    },
  },
  geocoder: {
    url: "https://api.ign.gob.ar/buscador/",
    search: "search",
    url_by_id: "places",
    query: "q",
    lang: "es",
    limit: 5,
    key: "",
  },
  referencias: {
    show: false,
    icon: "src/config/default/styles/images/referencias.png",
    width: "25px",
    height: "31px",
  },
  theme: {
    bodyBackground: "#0db2e0",
    headerBackground: "#0db2e0",
    menuBackground: "#0db2e0",
    activeLayer: "#33b560",
    textMenu: "white",
    textMenuStyle: "",
    textLegendMenu: "#fafafa",
    textLegendMenuStyle: "",
    iconBar: "#4f4f4f",
  },
  logo: {
    title: "Argenmap viewer",
    src: "src/styles/images/argenmap-banner-white.webp",
    height: "",
    width: "",
    style: "background-size: 160px;",
    srcLogoMini: "src/styles/images/argenmap-banner-white.webp",
    miniHeight: "",
    miniWidth: "",
    ministyle: "filter: drop-shadow(1px 1px 1px #103847); width: 128px;",
    link: "https://github.com/ign-argentina/argenmap",
  },
  logoText: {
    content: "Lorem Ipsum",
    title: "Lorem Ipsum",
    link: "#",
  },
  title: "Argenmap",
  website: "https://github.com/ign-argentina/argenmap",
  favicon: "src/styles/images/favicon.ico",
  geoprocessing: {
    isActive: true,
    buttonTitle: "Geoprocesos",
    buttonIcon: "fa fa-cog",
    dialogTitle: "Geoprocesos",
    strings: {
      bounds: "Areas a procesar",
    },
    availableProcesses: [
      {
        name: "Curvas de Nivel",
        geoprocess: "contour",
        baseUrl:
          "https://imagenes.ign.gob.ar/geoserver/geoprocesos/ows?service=WPS&version=1.0.0",
        layer: "alos_unificado",
        namePrefix: "curvas_de_nivel_",
        styles: {
          line_color: "#e0b44c",
          line_weight: 0.8,
          d_line_m: 500,
          d_line_color: "#967529",
          d_weigth: 1,
          smoothFactor: 1.7,
        },
      },
      {
        name: "Cota",
        geoprocess: "waterRise",
        namePrefix: "cota_",
        layer: "geoprocesos:alos_unificado",
        baseUrl:
          "https://imagenes.ign.gob.ar/geoserver/ows?service=WPS&version=1.0.0",
      },
      {
        name: "Área de influencia",
        geoprocess: "buffer",
        namePrefix: "area_de_influencia_",
      },
      {
        name: "Perfil de Elevación",
        geoprocess: "elevationProfile",
        namePrefix: "profile_",
      },
    ],
  },
  hillshade: {
    name: "hillshade",
    attribution:
      "sombra de montaña <a target='_blank' href='https://www.arcgis.com/home/item.html?id=1b243539f4514b6ba35e7d995890db1d'>©Esri</a>",
    url:
      "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png",
    addTo: ["argenmap", "argenmap_gris"],
    icon: "src/styles/images/mountains.svg",
    switchLabel: "Agregar sombra de montaña Esri",
  },
  strings: {
    basemap_min_zoom: "Zoom mínimo de ",
    basemap_max_zoom: " y máximo de ",
    basemap_legend_button_text: "Ver leyenda del mapa",
    delete_geometry: "Eliminar geometría",
  },
};


function PreferencesForm({ preferences, onPreferencesChange }) {
  const [localPreferences, setLocalPreferences] = useState(() =>
    preferences || defaultPreferences
  );
  
  const isFirstRender = useRef(true);
  const colorDebounceRef = useRef(null);

  // Debounced function for color changes
  const debouncedColorChange = useCallback((path, value) => {
    if (colorDebounceRef.current) {
      clearTimeout(colorDebounceRef.current);
    }
    
    colorDebounceRef.current = setTimeout(() => {
      setLocalPreferences(prev => {
        const newPrefs = { ...prev };
        const pathArray = path.split('.');
        let current = newPrefs;
        
        // Navigate to the nested property
        for (let i = 0; i < pathArray.length - 1; i++) {
          current = current[pathArray[i]];
        }
        
        // Set the final value
        current[pathArray[pathArray.length - 1]] = value;
        return newPrefs;
      });
    }, 150); // 150ms debounce
  }, []);

  // Update local state when external props change  
  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  // Notify parent of changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (onPreferencesChange) {
      onPreferencesChange(localPreferences);
    }
  }, [localPreferences]); // Removed onPreferencesChange from dependencies

  // Cleanup color debounce timer on unmount
  useEffect(() => {
    return () => {
      if (colorDebounceRef.current) {
        clearTimeout(colorDebounceRef.current);
      }
    };
  }, []);

  // Simple accordion state arrays like DataForm
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Array management functions
  const handleArrayAdd = (path) => {
    const newPrefs = { ...localPreferences };
    const pathArray = path.split('.');
    let current = newPrefs;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    
    const finalKey = pathArray[pathArray.length - 1];
    current[finalKey] = [...current[finalKey], ""];
    setLocalPreferences(newPrefs);
  };

  const handleArrayRemove = (path, index) => {
    const newPrefs = { ...localPreferences };
    const pathArray = path.split('.');
    let current = newPrefs;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    
    const finalKey = pathArray[pathArray.length - 1];
    current[finalKey] = current[finalKey].filter((_, i) => i !== index);
    setLocalPreferences(newPrefs);
  };

  return (
    <div className="preferencesform-container">
      <h2 className="preferencesform-header">Configuraciones Básicas</h2>

{/*       <h3 className="preferencesform-subtitle">Configuraciones Básicas</h3> */}
      
      {/* Table Settings */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(0);
          }}
        >
          <span>Configuración de Tabla</span>
        </div>
        {openSections.includes(0) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={localPreferences.table.isActiva}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.table.isActiva = e.target.checked;
                    setLocalPreferences(newPrefs);
                  }}
                />
                Tabla Activa
              </label>
            </div>
            <div className="form-group">
              <label>Límite de filas</label>
              <input
                type="number"
                placeholder="Límite de filas"
                value={localPreferences.table.rowsLimit}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.table.rowsLimit = Number(e.target.value);
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Charts Settings */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(1);
          }}
        >
          <span>Configuración de Gráficos</span>
        </div>
        {openSections.includes(1) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={localPreferences.charts.isActive}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.charts.isActive = e.target.checked;
                    setLocalPreferences(newPrefs);
                  }}
                />
                Gráficos Activos
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Layer Options */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(2)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(2);
          }}
        >
          <span>Opciones de Capas</span>
        </div>
        {openSections.includes(2) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={localPreferences.layer_options.isActive}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.layer_options.isActive = e.target.checked;
                    setLocalPreferences(newPrefs);
                  }}
                />
                Opciones de Capas Activas
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Service Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(3)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(3);
          }}
        >
          <span>Configuración de Servicios</span>
        </div>
        {openSections.includes(3) && (
          <div className="accordion-content">
            <strong>WMTS:</strong>
            <div className="form-group">
              <label>Zoom máximo</label>
              <input
                type="number"
                placeholder="Zoom máximo"
                value={localPreferences.service.wmts.maxZoom}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.service.wmts.maxZoom = Number(e.target.value);
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* General Settings */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(4)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(4);
          }}
        >
          <span>Configuración General</span>
        </div>
        {openSections.includes(4) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>Título de la aplicación</label>
              <input
                placeholder="Título de la aplicación"
                value={localPreferences.title}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.title = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Sitio web</label>
              <input
                placeholder="Sitio web"
                value={localPreferences.website}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.website = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Favicon</label>
              <input
                placeholder="Favicon"
                value={localPreferences.favicon}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.favicon = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={localPreferences.showSearchBar}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.showSearchBar = e.target.checked;
                    setLocalPreferences(newPrefs);
                  }}
                />
                Mostrar barra de búsqueda
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Meta Tags */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(5)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(5);
          }}
        >
          <span>Meta Tags</span>
        </div>
        {openSections.includes(5) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>Título</label>
              <input
                placeholder="Título"
                value={localPreferences.metaTags.title}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.metaTags.title = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <input
                placeholder="Descripción"
                value={localPreferences.metaTags.description}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.metaTags.description = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>URL de imagen</label>
              <input
                placeholder="URL de imagen"
                value={localPreferences.metaTags.image}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.metaTags.image = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Searchbar Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(6)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(6);
          }}
        >
          <span>Configuración de Barra de Búsqueda</span>
        </div>
        {openSections.includes(6) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={localPreferences.searchbar.isActive}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.searchbar.isActive = e.target.checked;
                    setLocalPreferences(newPrefs);
                  }}
                />
                Barra de búsqueda activa
              </label>
            </div>
            <div className="form-group">
              <label>Posición superior (ej: 5px)</label>
              <input
                placeholder="Posición superior (ej: 5px)"
                value={localPreferences.searchbar.top}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.searchbar.top = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Posición izquierda (ej: 40%)</label>
              <input
                placeholder="Posición izquierda (ej: 40%)"
                value={localPreferences.searchbar.left}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.searchbar.left = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Color de foco</label>
              <input
                type="color"
                value={localPreferences.searchbar.color_focus}
                onChange={(e) => debouncedColorChange('searchbar.color_focus', e.target.value)}
                title="Color de foco"
              />
            </div>
            <div className="form-group">
              <label>Color de fondo (ej: rgba(255,255,255,0.7))</label>
              <input
                placeholder="Color de fondo (ej: rgba(255,255,255,0.7))"
                value={localPreferences.searchbar.background_color}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.searchbar.background_color = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Placeholder</label>
              <input
                placeholder="Placeholder"
                value={localPreferences.searchbar.strings.placeholder}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.searchbar.strings.placeholder = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Geocoder Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(7)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(7);
          }}
        >
          <span>Configuración de Geocodificador</span>
        </div>
        {openSections.includes(7) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>URL del geocodificador</label>
              <input
                placeholder="URL del geocodificador"
                value={localPreferences.geocoder.url}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geocoder.url = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Endpoint de búsqueda</label>
              <input
                placeholder="Endpoint de búsqueda"
                value={localPreferences.geocoder.search}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geocoder.search = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>URL por ID</label>
              <input
                placeholder="URL por ID"
                value={localPreferences.geocoder.url_by_id}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geocoder.url_by_id = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Parámetro de consulta</label>
              <input
                placeholder="Parámetro de consulta"
                value={localPreferences.geocoder.query}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geocoder.query = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Idioma</label>
              <input
                placeholder="Idioma"
                value={localPreferences.geocoder.lang}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geocoder.lang = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Límite de resultados</label>
              <input
                type="number"
                placeholder="Límite de resultados"
                value={localPreferences.geocoder.limit}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geocoder.limit = Number(e.target.value);
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Clave API</label>
              <input
                placeholder="Clave API"
                value={localPreferences.geocoder.key}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geocoder.key = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Referencias Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(8)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(8);
          }}
        >
          <span>Configuración de Referencias</span>
        </div>
        {openSections.includes(8) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={localPreferences.referencias.show}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.referencias.show = e.target.checked;
                    setLocalPreferences(newPrefs);
                  }}
                />
                Mostrar referencias
              </label>
            </div>
            <div className="form-group">
              <label>Icono</label>
              <input
                placeholder="Icono"
                value={localPreferences.referencias.icon}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.referencias.icon = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Ancho</label>
              <input
                placeholder="Ancho"
                value={localPreferences.referencias.width}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.referencias.width = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Alto</label>
              <input
                placeholder="Alto"
                value={localPreferences.referencias.height}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.referencias.height = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analytics IDs */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(9)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(9);
          }}
        >
          <span>Analytics IDs ({localPreferences.analytics_ids.length})</span>
        </div>
        {openSections.includes(9) && (
          <div className="accordion-content">
            {localPreferences.analytics_ids.map((id, index) => (
              <div key={index} className="form-group" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  className="array-item"
                  placeholder="Analytics ID"
                  value={id}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.analytics_ids[index] = e.target.value;
                    setLocalPreferences(newPrefs);
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  className="button-delete"
                  onClick={() => handleArrayRemove('analytics_ids', index)}
                  type="button"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              type="button"
              className="button-primary"
              onClick={() => handleArrayAdd('analytics_ids')}
            >
              + Agregar Analytics ID
            </button>
          </div>
        )}
      </div>

      {/* Excluded Plugins */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(10)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(10);
          }}
        >
          <span>Plugins Excluidos ({localPreferences.excluded_plugins.length})</span>
        </div>
        {openSections.includes(10) && (
          <div className="accordion-content">
            {localPreferences.excluded_plugins.map((plugin, index) => (
              <div key={index} className="form-group" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  className="array-item"
                  placeholder="Nombre del plugin"
                  value={plugin}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.excluded_plugins[index] = e.target.value;
                    setLocalPreferences(newPrefs);
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  className="button-delete"
                  onClick={() => handleArrayRemove('excluded_plugins', index)}
                  type="button"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              type="button"
              className="button-primary"
              onClick={() => handleArrayAdd('excluded_plugins')}
            >
              + Agregar Plugin
            </button>
          </div>
        )}
      </div>

      {/* Map Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(11)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(11);
          }}
        >
          <span>Configuración del Mapa</span>
        </div>
        {openSections.includes(11) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>Centro del Mapa: Latitud</label>
              <input
                type="number"
                placeholder="Latitud"
                value={localPreferences.mapConfig.center.latitude}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.mapConfig.center.latitude = Number(e.target.value);
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Centro del Mapa: Longitud</label>
              <input
                type="number"
                placeholder="Longitud"
                value={localPreferences.mapConfig.center.longitude}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.mapConfig.center.longitude = Number(e.target.value);
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <strong>Zoom:</strong>
            <div className="zoom-inputs">
              <input
                type="number"
                placeholder="Inicial"
                value={localPreferences.mapConfig.zoom.initial}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.mapConfig.zoom.initial = Number(e.target.value);
                  setLocalPreferences(newPrefs);
                }}
              />
              <input
                type="number"
                placeholder="Mínimo"
                value={localPreferences.mapConfig.zoom.min}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.mapConfig.zoom.min = Number(e.target.value);
                  setLocalPreferences(newPrefs);
                }}
              />
              <input
                type="number"
                placeholder="Máximo"
                value={localPreferences.mapConfig.zoom.max}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.mapConfig.zoom.max = Number(e.target.value);
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Theme Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(12)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(12);
          }}
        >
          <span>Configuración de Tema</span>
        </div>
        {openSections.includes(12) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>Color de fondo del cuerpo:</label>
              <input
                type="color"
                value={localPreferences.theme.bodyBackground}
                onChange={(e) => debouncedColorChange('theme.bodyBackground', e.target.value)}
                title="Selecciona el color de fondo principal de la aplicación"
              />
            </div>
            <div className="form-group">
              <label>Color de fondo del encabezado:</label>
              <input
                type="color"
                value={localPreferences.theme.headerBackground}
                onChange={(e) => debouncedColorChange('theme.headerBackground', e.target.value)}
                title="Color de fondo de la barra superior"
              />
            </div>
            <div className="form-group">
              <label>Color de fondo del menú:</label>
              <input
                type="color"
                value={localPreferences.theme.menuBackground}
                onChange={(e) => debouncedColorChange('theme.menuBackground', e.target.value)}
                title="Color de fondo del panel de capas y menús laterales"
              />
            </div>
            <div className="form-group">
              <label>Color de capa activa:</label>
              <input
                type="color"
                value={localPreferences.theme.activeLayer}
                onChange={(e) => debouncedColorChange('theme.activeLayer', e.target.value)}
                title="Color de resaltado para la capa seleccionada"
              />
            </div>
            <div className="form-group">
              <label>Color de texto del menú:</label>
              <input
                type="color"
                value={localPreferences.theme.textMenu}
                onChange={(e) => debouncedColorChange('theme.textMenu', e.target.value)}
                title="Color del texto en los menús laterales"
              />
            </div>
            <div className="form-group">
              <label>Estilo CSS del texto del menú:</label>
              <input
                type="text"
                placeholder="Ej: font-weight: bold; text-shadow: 1px 1px 1px rgba(0,0,0,0.5);"
                value={localPreferences.theme.textMenuStyle}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.theme.textMenuStyle = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
                title="Estilos CSS adicionales para el texto del menú"
              />
            </div>
            <div className="form-group">
              <label>Color de texto de leyenda:</label>
              <input
                type="color"
                value={localPreferences.theme.textLegendMenu}
                onChange={(e) => debouncedColorChange('theme.textLegendMenu', e.target.value)}
                title="Color del texto en las leyendas de capas"
              />
            </div>
            <div className="form-group">
              <label>Estilo CSS del texto de leyenda:</label>
              <input
                type="text"
                placeholder="Ej: font-size: 12px; font-style: italic;"
                value={localPreferences.theme.textLegendMenuStyle}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.theme.textLegendMenuStyle = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
                title="Estilos CSS adicionales para el texto de leyendas"
              />
            </div>
            <div className="form-group">
              <label>Color de barra de iconos:</label>
              <input
                type="color"
                value={localPreferences.theme.iconBar}
                onChange={(e) => debouncedColorChange('theme.iconBar', e.target.value)}
                title="Color de fondo de la barra de herramientas con iconos"
              />
            </div>
          </div>
        )}
      </div>

      {/* Logo Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(13)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(13);
          }}
        >
          <span>Configuración de Logo</span>
        </div>
        {openSections.includes(13) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>Título del logo</label>
              <input
                placeholder="Título del logo"
                value={localPreferences.logo.title}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.title = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>URL de la imagen del logo</label>
              <input
                placeholder="URL de la imagen del logo"
                value={localPreferences.logo.src}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.src = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Alto del logo</label>
              <input
                placeholder="Alto del logo"
                value={localPreferences.logo.height}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.height = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Ancho del logo</label>
              <input
                placeholder="Ancho del logo"
                value={localPreferences.logo.width}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.width = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Estilo del logo</label>
              <input
                placeholder="Estilo del logo"
                value={localPreferences.logo.style}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.style = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>URL del logo mini</label>
              <input
                placeholder="URL del logo mini"
                value={localPreferences.logo.srcLogoMini}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.srcLogoMini = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Alto del logo mini</label>
              <input
                placeholder="Alto del logo mini"
                value={localPreferences.logo.miniHeight}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.miniHeight = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Ancho del logo mini</label>
              <input
                placeholder="Ancho del logo mini"
                value={localPreferences.logo.miniWidth}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.miniWidth = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Estilo del logo mini</label>
              <input
                placeholder="Estilo del logo mini"
                value={localPreferences.logo.ministyle}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.ministyle = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Enlace del logo</label>
              <input
                placeholder="Enlace del logo"
                value={localPreferences.logo.link}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logo.link = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Logo Text Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(14)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(14);
          }}
        >
          <span>Configuración de Texto del Logo</span>
        </div>
        {openSections.includes(14) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>Titulo del Mapa</label>
              <input
                placeholder="Titulo del Mapa"
                value={localPreferences.logoText.content}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logoText.content = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Ver que hace</label>
              <input
                placeholder="Ver que hace"
                value={localPreferences.logoText.title}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logoText.title = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>URL</label>
              <input
                placeholder="URL"
                value={localPreferences.logoText.link}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.logoText.link = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Geoprocessing Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(15)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(15);
          }}
        >
          <span>Configuración de Geoprocesamiento</span>
        </div>
        {openSections.includes(15) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={localPreferences.geoprocessing.isActive}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.geoprocessing.isActive = e.target.checked;
                    setLocalPreferences(newPrefs);
                  }}
                />
                Geoprocesamiento activo
              </label>
            </div>
            <div className="form-group">
              <label>Título del botón</label>
              <input
                placeholder="Título del botón"
                value={localPreferences.geoprocessing.buttonTitle}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geoprocessing.buttonTitle = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Icono del botón</label>
              <input
                placeholder="Icono del botón"
                value={localPreferences.geoprocessing.buttonIcon}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geoprocessing.buttonIcon = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Título del diálogo</label>
              <input
                placeholder="Título del diálogo"
                value={localPreferences.geoprocessing.dialogTitle}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geoprocessing.dialogTitle = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Texto de límites</label>
              <input
                placeholder="Texto de límites"
                value={localPreferences.geoprocessing.strings.bounds}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.geoprocessing.strings.bounds = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <strong>Procesos Disponibles:</strong>
            {localPreferences.geoprocessing.availableProcesses.map((process, index) => (
              <div key={index} className="form-group geoprocessing-process">
                <label>Nombre del proceso</label>
                <input
                  placeholder="Nombre del proceso"
                  value={process.name}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.geoprocessing.availableProcesses[index].name = e.target.value;
                    setLocalPreferences(newPrefs);
                  }}
                />
                <label>Geoproceso</label>
                <input
                  placeholder="Geoproceso"
                  value={process.geoprocess}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.geoprocessing.availableProcesses[index].geoprocess = e.target.value;
                    setLocalPreferences(newPrefs);
                  }}
                />
                <label>Base URL</label>
                <input
                  placeholder="Base URL"
                  value={process.baseUrl || ""}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.geoprocessing.availableProcesses[index].baseUrl = e.target.value;
                    setLocalPreferences(newPrefs);
                  }}
                />
                <label>Capa</label>
                <input
                  placeholder="Capa"
                  value={process.layer || ""}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.geoprocessing.availableProcesses[index].layer = e.target.value;
                    setLocalPreferences(newPrefs);
                  }}
                />
                <label>Prefijo del nombre</label>
                <input
                  placeholder="Prefijo del nombre"
                  value={process.namePrefix}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.geoprocessing.availableProcesses[index].namePrefix = e.target.value;
                    setLocalPreferences(newPrefs);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hillshade Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(16)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(16);
          }}
        >
          <span>Configuración de Hillshade</span>
        </div>
        {openSections.includes(16) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>Nombre</label>
              <input
                placeholder="Nombre"
                value={localPreferences.hillshade.name}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.hillshade.name = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Atribución</label>
              <input
                placeholder="Atribución"
                value={localPreferences.hillshade.attribution}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.hillshade.attribution = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>URL</label>
              <input
                placeholder="URL"
                value={localPreferences.hillshade.url}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.hillshade.url = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Icono</label>
              <input
                placeholder="Icono"
                value={localPreferences.hillshade.icon}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.hillshade.icon = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Etiqueta del switch</label>
              <input
                placeholder="Etiqueta del switch"
                value={localPreferences.hillshade.switchLabel}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.hillshade.switchLabel = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <strong>Agregar a mapas:</strong>
            {localPreferences.hillshade.addTo.map((mapName, index) => (
              <div key={index} className="form-group hillshade-map" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  className="array-item"
                  placeholder="Nombre del mapa"
                  value={mapName}
                  onChange={(e) => {
                    const newPrefs = { ...localPreferences };
                    newPrefs.hillshade.addTo[index] = e.target.value;
                    setLocalPreferences(newPrefs);
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  className="button-delete"
                  onClick={() => handleArrayRemove('hillshade.addTo', index)}
                  type="button"
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              type="button"
              className="button-primary"
              onClick={() => handleArrayAdd('hillshade.addTo')}
            >
              + Agregar Mapa
            </button>
          </div>
        )}
      </div>

      {/* Strings Configuration */}
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={() => toggleSection(17)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleSection(17);
          }}
        >
          <span>Configuración de Textos</span>
        </div>
        {openSections.includes(17) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>Texto zoom mínimo</label>
              <input
                placeholder="Texto zoom mínimo"
                value={localPreferences.strings.basemap_min_zoom}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.strings.basemap_min_zoom = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Texto zoom máximo</label>
              <input
                placeholder="Texto zoom máximo"
                value={localPreferences.strings.basemap_max_zoom}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.strings.basemap_max_zoom = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Texto del botón de leyenda</label>
              <input
                placeholder="Texto del botón de leyenda"
                value={localPreferences.strings.basemap_legend_button_text}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.strings.basemap_legend_button_text = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
            <div className="form-group">
              <label>Texto eliminar geometría</label>
              <input
                placeholder="Texto eliminar geometría"
                value={localPreferences.strings.delete_geometry}
                onChange={(e) => {
                  const newPrefs = { ...localPreferences };
                  newPrefs.strings.delete_geometry = e.target.value;
                  setLocalPreferences(newPrefs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <hr />
    </div>
  );
}

export default PreferencesForm;