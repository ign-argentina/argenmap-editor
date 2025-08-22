import React, { useState, useEffect } from "react";

const defaultPreferences = {
  table: {
    isActiva: false,
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
    bodyBackground: "#FFA500",
    headerBackground: "#FFA500",
    menuBackground: "#00000",
    activeLayer: "#FFA500",
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
    content: "EL EDITOR EDITA",
    title: "EDITA EL EDITOR",
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

function PreferencesForm({ preferences: externalPreferences, onPreferencesChange }) {

  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    if (onPreferencesChange) onPreferencesChange(preferences);
  }, [preferences, onPreferencesChange]);

  useEffect(() => {
  if (externalPreferences) setPreferences(externalPreferences);
}, [externalPreferences]);

  // Cambiar valor en path, soporta profundidad y arrays básicos
  const handleChange = (path, value) => {
    setPreferences((prev) => {
      const updated = JSON.parse(JSON.stringify(prev)); // clonar profundo simple (sin funciones)
      const keys = path.split(".");
      let current = updated;

      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          current[key] = value;
        } else {
          if (!(key in current)) current[key] = {};
          current = current[key];
        }
      });
      return updated;
    });
  };

  // Manejar array de strings (agregar/quitar) para campos como analytics_ids, excluded_plugins, hillshade.addTo
  const handleArrayChange = (path, index, value) => {
    setPreferences((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const arr = path.split(".").reduce((obj, key) => obj[key], updated);
      arr[index] = value;
      return updated;
    });
  };

  const handleArrayAdd = (path) => {
    setPreferences((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const arr = path.split(".").reduce((obj, key) => obj[key], updated);
      arr.push("");
      return updated;
    });
  };

  const handleArrayRemove = (path, index) => {
    setPreferences((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const arr = path.split(".").reduce((obj, key) => obj[key], updated);
      arr.splice(index, 1);
      return updated;
    });
  };

  // Para editar availableProcesses, cambiar nombre y geoprocess básico, styles no editable aquí para simplificar.
  const handleAvailableProcessChange = (index, key, value) => {
    setPreferences((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.geoprocessing.availableProcesses[index][key] = value;
      return updated;
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onPreferencesChange) onPreferencesChange(preferences);
      }}
      style={{ maxWidth: 700, margin: "auto", fontFamily: "Arial, sans-serif" }}
    >
      <h2>Editar Preferences</h2>

      {/* Table */}
      <fieldset>
        <legend>Table</legend>
        <label>
          isActiva:
          <input
            type="checkbox"
            checked={preferences.table.isActiva}
            onChange={(e) => handleChange("table.isActiva", e.target.checked)}
          />
        </label>
        <br />
        <label>
          rowsLimit:
          <input
            type="number"
            min={1}
            value={preferences.table.rowsLimit}
            onChange={(e) =>
              handleChange("table.rowsLimit", parseInt(e.target.value) || 1)
            }
          />
        </label>
      </fieldset>

      <br />

      {/* Charts */}
      <fieldset>
        <legend>Charts</legend>
        <label>
          isActive:
          <input
            type="checkbox"
            checked={preferences.charts.isActive}
            onChange={(e) => handleChange("charts.isActive", e.target.checked)}
          />
        </label>
      </fieldset>

      <br />

      {/* Layer options */}
      <fieldset>
        <legend>Layer Options</legend>
        <label>
          isActive:
          <input
            type="checkbox"
            checked={preferences.layer_options.isActive}
            onChange={(e) =>
              handleChange("layer_options.isActive", e.target.checked)
            }
          />
        </label>
      </fieldset>

      <br />

      {/* Meta Tags */}
      <fieldset>
        <legend>Meta Tags</legend>
        <label>
          Title:
          <input
            type="text"
            value={preferences.metaTags.title}
            onChange={(e) => handleChange("metaTags.title", e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            value={preferences.metaTags.description}
            onChange={(e) => handleChange("metaTags.description", e.target.value)}
          />
        </label>
        <br />
        <label>
          Image:
          <input
            type="text"
            value={preferences.metaTags.image}
            onChange={(e) => handleChange("metaTags.image", e.target.value)}
          />
        </label>
      </fieldset>

      <br />

      {/* Analytics IDs (array de strings) */}
      <fieldset>
        <legend>Analytics IDs</legend>
        {preferences.analytics_ids.map((id, i) => (
          <div key={i}>
            <input
              type="text"
              value={id}
              onChange={(e) => handleArrayChange("analytics_ids", i, e.target.value)}
            />
            <button type="button" onClick={() => handleArrayRemove("analytics_ids", i)}>
              ❌
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleArrayAdd("analytics_ids")}>
          Añadir ID
        </button>
      </fieldset>

      <br />

      {/* Excluded Plugins (array de strings) */}
      <fieldset>
        <legend>Excluded Plugins</legend>
        {preferences.excluded_plugins.map((plugin, i) => (
          <div key={i}>
            <input
              type="text"
              value={plugin}
              onChange={(e) =>
                handleArrayChange("excluded_plugins", i, e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => handleArrayRemove("excluded_plugins", i)}
            >
              ❌
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleArrayAdd("excluded_plugins")}>
          Añadir Plugin
        </button>
      </fieldset>

      <br />

      {/* MapConfig */}
      <fieldset>
        <legend>Map Config</legend>
        <label>
          Center Latitude:
          <input
            type="number"
            step="0.0001"
            value={preferences.mapConfig.center.latitude}
            onChange={(e) =>
              handleChange("mapConfig.center.latitude", parseFloat(e.target.value))
            }
          />
        </label>
        <br />
        <label>
          Center Longitude:
          <input
            type="number"
            step="0.0001"
            value={preferences.mapConfig.center.longitude}
            onChange={(e) =>
              handleChange("mapConfig.center.longitude", parseFloat(e.target.value))
            }
          />
        </label>
        <br />
        <label>
          Zoom Initial:
          <input
            type="number"
            min={preferences.mapConfig.zoom.min}
            max={preferences.mapConfig.zoom.max}
            value={preferences.mapConfig.zoom.initial}
            onChange={(e) =>
              handleChange("mapConfig.zoom.initial", parseInt(e.target.value) || 1)
            }
          />
        </label>
        <br />
        <label>
          Zoom Min:
          <input
            type="number"
            min={1}
            value={preferences.mapConfig.zoom.min}
            onChange={(e) =>
              handleChange("mapConfig.zoom.min", parseInt(e.target.value) || 1)
            }
          />
        </label>
        <br />
        <label>
          Zoom Max:
          <input
            type="number"
            min={1}
            value={preferences.mapConfig.zoom.max}
            onChange={(e) =>
              handleChange("mapConfig.zoom.max", parseInt(e.target.value) || 1)
            }
          />
        </label>
      </fieldset>

      <br />

      {/* Service */}
      <fieldset>
        <legend>Service</legend>
        <label>
          WMTS maxZoom:
          <input
            type="number"
            min={1}
            value={preferences.service.wmts.maxZoom}
            onChange={(e) =>
              handleChange("service.wmts.maxZoom", parseInt(e.target.value) || 1)
            }
          />
        </label>
      </fieldset>

      <br />

      {/* Show Search Bar */}
      <fieldset>
        <legend>Show Search Bar</legend>
        <label>
          Mostrar barra de búsqueda:
          <input
            type="checkbox"
            checked={preferences.showSearchBar}
            onChange={(e) => handleChange("showSearchBar", e.target.checked)}
          />
        </label>
      </fieldset>

      <br />

      {/* Searchbar */}
      <fieldset>
        <legend>Searchbar</legend>
        <label>
          isActive:
          <input
            type="checkbox"
            checked={preferences.searchbar.isActive}
            onChange={(e) => handleChange("searchbar.isActive", e.target.checked)}
          />
        </label>
        <br />
        <label>
          Top:
          <input
            type="text"
            value={preferences.searchbar.top}
            onChange={(e) => handleChange("searchbar.top", e.target.value)}
          />
        </label>
        <br />
        <label>
          Left:
          <input
            type="text"
            value={preferences.searchbar.left}
            onChange={(e) => handleChange("searchbar.left", e.target.value)}
          />
        </label>
        <br />
        <label>
          Color focus:
          <input
            type="color"
            value={preferences.searchbar.color_focus}
            onChange={(e) => handleChange("searchbar.color_focus", e.target.value)}
          />
        </label>
        <br />
        <label>
          Background color:
          <input
            type="color"
            value={preferences.searchbar.background_color}
            onChange={(e) =>
              handleChange("searchbar.background_color", e.target.value)
            }
          />
        </label>
        <br />
        <label>
          Placeholder:
          <input
            type="text"
            value={preferences.searchbar.strings.placeholder}
            onChange={(e) =>
              handleChange("searchbar.strings.placeholder", e.target.value)
            }
          />
        </label>
      </fieldset>

      <br />

      {/* Geocoder */}
      <fieldset>
        <legend>Geocoder</legend>
        <label>
          URL:
          <input
            type="text"
            value={preferences.geocoder.url}
            onChange={(e) => handleChange("geocoder.url", e.target.value)}
          />
        </label>
        <br />
        <label>
          Search:
          <input
            type="text"
            value={preferences.geocoder.search}
            onChange={(e) => handleChange("geocoder.search", e.target.value)}
          />
        </label>
        <br />
        <label>
          URL by ID:
          <input
            type="text"
            value={preferences.geocoder.url_by_id}
            onChange={(e) => handleChange("geocoder.url_by_id", e.target.value)}
          />
        </label>
        <br />
        <label>
          Query:
          <input
            type="text"
            value={preferences.geocoder.query}
            onChange={(e) => handleChange("geocoder.query", e.target.value)}
          />
        </label>
        <br />
        <label>
          Language:
          <input
            type="text"
            value={preferences.geocoder.lang}
            onChange={(e) => handleChange("geocoder.lang", e.target.value)}
          />
        </label>
        <br />
        <label>
          Limit:
          <input
            type="number"
            min={1}
            value={preferences.geocoder.limit}
            onChange={(e) =>
              handleChange("geocoder.limit", parseInt(e.target.value) || 1)
            }
          />
        </label>
        <br />
        <label>
          Key:
          <input
            type="text"
            value={preferences.geocoder.key}
            onChange={(e) => handleChange("geocoder.key", e.target.value)}
          />
        </label>
      </fieldset>

      <br />

      {/* Referencias */}
      <fieldset>
        <legend>Referencias</legend>
        <label>
          Show:
          <input
            type="checkbox"
            checked={preferences.referencias.show}
            onChange={(e) => handleChange("referencias.show", e.target.checked)}
          />
        </label>
        <br />
        <label>
          Icon:
          <input
            type="text"
            value={preferences.referencias.icon}
            onChange={(e) => handleChange("referencias.icon", e.target.value)}
          />
        </label>
        <br />
        <label>
          Width:
          <input
            type="text"
            value={preferences.referencias.width}
            onChange={(e) => handleChange("referencias.width", e.target.value)}
          />
        </label>
        <br />
        <label>
          Height:
          <input
            type="text"
            value={preferences.referencias.height}
            onChange={(e) => handleChange("referencias.height", e.target.value)}
          />
        </label>
      </fieldset>

      <br />

      {/* Theme */}
      <fieldset>
        <legend>Theme</legend>
        {Object.entries(preferences.theme).map(([key, val]) => (
          <div key={key}>
            <label>
              {key}:
              {val.startsWith("#") ? (
                <input
                  type="color"
                  value={val}
                  onChange={(e) => handleChange(`theme.${key}`, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleChange(`theme.${key}`, e.target.value)}
                />
              )}
            </label>
          </div>
        ))}
      </fieldset>

      <br />

      {/* Logo */}
      <fieldset>
        <legend>Logo</legend>
        {Object.entries(preferences.logo).map(([key, val]) => (
          <div key={key}>
            <label>
              {key}:
              <input
                type="text"
                value={val}
                onChange={(e) => handleChange(`logo.${key}`, e.target.value)}
              />
            </label>
          </div>
        ))}
      </fieldset>

      <br />

      {/* LogoText */}
      <fieldset>
        <legend>LogoText</legend>
        {Object.entries(preferences.logoText).map(([key, val]) => (
          <div key={key}>
            <label>
              {key}:
              <input
                type="text"
                value={val}
                onChange={(e) => handleChange(`logoText.${key}`, e.target.value)}
              />
            </label>
          </div>
        ))}
      </fieldset>

      <br />

      {/* Title y Website */}
      <fieldset>
        <legend>General</legend>
        <label>
          Title:
          <input
            type="text"
            value={preferences.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </label>
        <br />
        <label>
          Website:
          <input
            type="text"
            value={preferences.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </label>
        <br />
        <label>
          Favicon:
          <input
            type="text"
            value={preferences.favicon}
            onChange={(e) => handleChange("favicon", e.target.value)}
          />
        </label>
      </fieldset>

      <br />

      {/* Geoprocessing */}
      <fieldset>
        <legend>Geoprocessing</legend>
        <label>
          isActive:
          <input
            type="checkbox"
            checked={preferences.geoprocessing.isActive}
            onChange={(e) =>
              handleChange("geoprocessing.isActive", e.target.checked)
            }
          />
        </label>
        <br />
        <label>
          Button Title:
          <input
            type="text"
            value={preferences.geoprocessing.buttonTitle}
            onChange={(e) => handleChange("geoprocessing.buttonTitle", e.target.value)}
          />
        </label>
        <br />
        <label>
          Button Icon:
          <input
            type="text"
            value={preferences.geoprocessing.buttonIcon}
            onChange={(e) => handleChange("geoprocessing.buttonIcon", e.target.value)}
          />
        </label>
        <br />
        <label>
          Dialog Title:
          <input
            type="text"
            value={preferences.geoprocessing.dialogTitle}
            onChange={(e) => handleChange("geoprocessing.dialogTitle", e.target.value)}
          />
        </label>
        <br />
        <label>
          Strings Bounds:
          <input
            type="text"
            value={preferences.geoprocessing.strings.bounds}
            onChange={(e) => handleChange("geoprocessing.strings.bounds", e.target.value)}
          />
        </label>
        <br />

        {/* Available processes - lista editable de name y geoprocess */}
        <fieldset style={{ border: "1px solid #ccc", marginTop: 10 }}>
          <legend>Available Processes</legend>
          {preferences.geoprocessing.availableProcesses.map((proc, i) => (
            <div
              key={i}
              style={{
                padding: 5,
                borderBottom: "1px solid #ddd",
                marginBottom: 5,
              }}
            >
              <label>
                Name:
                <input
                  type="text"
                  value={proc.name}
                  onChange={(e) =>
                    handleAvailableProcessChange(i, "name", e.target.value)
                  }
                />
              </label>
              <br />
              <label>
                Geoprocess:
                <input
                  type="text"
                  value={proc.geoprocess}
                  onChange={(e) =>
                    handleAvailableProcessChange(i, "geoprocess", e.target.value)
                  }
                />
              </label>
              {/* Para simplificar no edito styles y baseUrl aquí */}
            </div>
          ))}
        </fieldset>
      </fieldset>

      <br />

      {/* Hillshade */}
      <fieldset>
        <legend>Hillshade</legend>
        <label>
          Name:
          <input
            type="text"
            value={preferences.hillshade.name}
            onChange={(e) => handleChange("hillshade.name", e.target.value)}
          />
        </label>
        <br />
        <label>
          Attribution (HTML):
          <input
            type="text"
            value={preferences.hillshade.attribution}
            onChange={(e) => handleChange("hillshade.attribution", e.target.value)}
          />
        </label>
        <br />
        <label>
          URL:
          <input
            type="text"
            value={preferences.hillshade.url}
            onChange={(e) => handleChange("hillshade.url", e.target.value)}
          />
        </label>
        <br />

        {/* addTo array */}
        <label>Agregar a capas:</label>
        {preferences.hillshade.addTo.map((layer, i) => (
          <div key={i}>
            <input
              type="text"
              value={layer}
              onChange={(e) => handleArrayChange("hillshade.addTo", i, e.target.value)}
            />
            <button type="button" onClick={() => handleArrayRemove("hillshade.addTo", i)}>
              ❌
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleArrayAdd("hillshade.addTo")}>
          Añadir capa
        </button>

        <br />
        <label>
          Icon:
          <input
            type="text"
            value={preferences.hillshade.icon}
            onChange={(e) => handleChange("hillshade.icon", e.target.value)}
          />
        </label>
        <br />
        <label>
          Switch Label:
          <input
            type="text"
            value={preferences.hillshade.switchLabel}
            onChange={(e) => handleChange("hillshade.switchLabel", e.target.value)}
          />
        </label>
      </fieldset>

      <br />

      {/* Strings */}
      <fieldset>
        <legend>Strings</legend>
        <label>
          basemap_min_zoom:
          <input
            type="text"
            value={preferences.strings.basemap_min_zoom}
            onChange={(e) => handleChange("strings.basemap_min_zoom", e.target.value)}
          />
        </label>
        <br />
        <label>
          basemap_max_zoom:
          <input
            type="text"
            value={preferences.strings.basemap_max_zoom}
            onChange={(e) => handleChange("strings.basemap_max_zoom", e.target.value)}
          />
        </label>
        <br />
        <label>
          basemap_legend_button_text:
          <input
            type="text"
            value={preferences.strings.basemap_legend_button_text}
            onChange={(e) =>
              handleChange("strings.basemap_legend_button_text", e.target.value)
            }
          />
        </label>
        <br />
        <label>
          delete_geometry:
          <input
            type="text"
            value={preferences.strings.delete_geometry}
            onChange={(e) => handleChange("strings.delete_geometry", e.target.value)}
          />
        </label>
      </fieldset>

      <br />

      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#008dc9",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Guardar preferencias
      </button>
    </form>
  );
}

export default PreferencesForm;
