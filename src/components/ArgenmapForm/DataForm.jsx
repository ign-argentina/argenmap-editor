import React, { useState, useEffect } from "react";
import "./DataForm.css";

const crearMapa = () => ({
  titulo: "",
  nombre: "",
  servicio: "tms",
  version: "",
  attribution: "",
  host: "",
  legendImg: "",
  peso: null,
  zoom: {
    min: null,
    max: null,
    nativeMin: null,
    nativeMax: null,
  },
});

const crearCapa = () => ({
  type: "wmslayer",
  peso: null,
  nombre: "",
  short_abstract: "",
  class: "",
  seccion: "",
  servicio: "wms",
  version: "1.3.0",
  host: "",
});

const crearBaseMap = () => ({
  type: "basemap",
  peso: 1,
  nombre: "Mapas base",
  short_abstract: "",
  class: "",
  seccion: "mapasbase",
  capas: [],
});

function DataForm({ data, onDataChange }) {
  const [localData, setLocalData] = useState(() =>
    data || {
      items: [crearBaseMap()],
      template: "ign-geoportal-basic",
    }
  );

  // Actualizar estado local cuando cambien las props externas
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  // Notificar cambios hacia el padre
  useEffect(() => {
    if (onDataChange) {
      onDataChange(localData);
    }
  }, [localData, onDataChange]);

  const [openMapas, setOpenMapas] = useState([]);
  const [openCapas, setOpenCapas] = useState([]);

  const toggleMapa = (index) => {
    setOpenMapas((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleCapa = (index) => {
    setOpenCapas((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleMapaChange = (index, field, value) => {
    const newItems = [...localData.items];
    newItems[0].capas[index][field] = value;
    setLocalData({ ...localData, items: newItems });
  };

  const handleMapaZoomChange = (index, field, value) => {
    const newItems = [...localData.items];
    newItems[0].capas[index].zoom[field] = Number(value);
    setLocalData({ ...localData, items: newItems });
  };

  const agregarMapa = () => {
    const newItems = [...localData.items];
    newItems[0].capas.push(crearMapa());
    setLocalData({ ...localData, items: newItems });
  };

  const eliminarMapa = (index) => {
    const newItems = [...localData.items];
    newItems[0].capas.splice(index, 1);
    setLocalData({ ...localData, items: newItems });
    setOpenMapas((prev) => prev.filter((i) => i !== index));
  };

  const agregarCapa = () => {
    setLocalData((prev) => ({
      ...prev,
      items: [...prev.items, crearCapa()],
    }));
  };

  const eliminarCapa = (index) => {
    const newItems = [...localData.items];
    newItems.splice(index + 1, 1); // +1 porque el index 0 es el mapa base
    setLocalData({ ...localData, items: newItems });
    setOpenCapas((prev) => prev.filter((i) => i !== index));
  };

  return (
    <div className="dataform-container">
      <h2>Formulario Geoportal</h2>

      <h3>Mapas Base</h3>
      <button type="button" className="button-primary" onClick={agregarMapa}>
        + Agregar Mapa
      </button>

      {localData.items[0].capas.map((capa, index) => (
        <div key={index} className="accordion-item">
          <div
            className="accordion-header"
            onClick={() => toggleMapa(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleMapa(index);
            }}
          >
            <span>{capa.titulo || "(sin título)"}</span>
            <button
              className="button-delete"
              onClick={(e) => {
                e.stopPropagation();
                eliminarMapa(index);
              }}
              title="Eliminar Mapa"
              type="button"
            >
              🗑️
            </button>
          </div>
          {openMapas.includes(index) && (
            <div className="accordion-content">
              <input
                placeholder="Título"
                value={capa.titulo}
                onChange={(e) => handleMapaChange(index, "titulo", e.target.value)}
              />
              <input
                placeholder="Nombre"
                value={capa.nombre}
                onChange={(e) => handleMapaChange(index, "nombre", e.target.value)}
              />
              <input
                placeholder="Versión"
                value={capa.version}
                onChange={(e) => handleMapaChange(index, "version", e.target.value)}
              />
              <input
                placeholder="Attribution"
                value={capa.attribution}
                onChange={(e) => handleMapaChange(index, "attribution", e.target.value)}
              />
              <input
                placeholder="Host"
                value={capa.host}
                onChange={(e) => handleMapaChange(index, "host", e.target.value)}
              />
              <input
                placeholder="Peso"
                type="number"
                value={capa.peso || ""}
                onChange={(e) =>
                  handleMapaChange(index, "peso", Number(e.target.value))
                }
              />
              <strong>Zoom:</strong>
              <div className="zoom-inputs">
                <input
                  type="number"
                  placeholder="min"
                  value={capa.zoom.min || ""}
                  onChange={(e) => handleMapaZoomChange(index, "min", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="max"
                  value={capa.zoom.max || ""}
                  onChange={(e) => handleMapaZoomChange(index, "max", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="nativeMin"
                  value={capa.zoom.nativeMin || ""}
                  onChange={(e) =>
                    handleMapaZoomChange(index, "nativeMin", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="nativeMax"
                  value={capa.zoom.nativeMax || ""}
                  onChange={(e) =>
                    handleMapaZoomChange(index, "nativeMax", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <hr />
      <h3>Capas</h3>
      <button type="button" className="button-primary" onClick={agregarCapa}>
        + Agregar Capa
      </button>

      {localData.items.slice(1).map((capa, index) => (
        <div key={index} className="accordion-item">
          <div
            className="accordion-header"
            onClick={() => toggleCapa(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleCapa(index);
            }}
          >
            <span>{capa.nombre || "(sin nombre)"}</span>
            <button
              className="button-delete"
              onClick={(e) => {
                e.stopPropagation();
                eliminarCapa(index);
              }}
              title="Eliminar Capa"
              type="button"
            >
              🗑️
            </button>
          </div>
          {openCapas.includes(index) && (
            <div className="accordion-content">
              <input
                placeholder="Nombre"
                value={capa.nombre}
                onChange={(e) => {
                  const newItems = [...localData.items];
                  newItems[index + 1].nombre = e.target.value;
                  setLocalData({ ...localData, items: newItems });
                }}
              />
              <input
                placeholder="Host"
                value={capa.host}
                onChange={(e) => {
                  const newItems = [...localData.items];
                  newItems[index + 1].host = e.target.value;
                  setLocalData({ ...localData, items: newItems });
                }}
              />
              <input
                placeholder="Version"
                value={capa.version}
                onChange={(e) => {
                  const newItems = [...localData.items];
                  newItems[index + 1].version = e.target.value;
                  setLocalData({ ...localData, items: newItems });
                }}
              />
              <input
                placeholder="peso"
                value={capa.peso}
                onChange={(e) => {
                  const newItems = [...localData.items];
                  newItems[index + 1].peso = e.target.value;
                  setLocalData({ ...localData, items: newItems });
                }}
              />
              <input
                placeholder="seccion"
                value={capa.seccion}
                onChange={(e) => {
                  const newItems = [...localData.items];
                  newItems[index + 1].seccion = e.target.value;
                  setLocalData({ ...localData, items: newItems });
                }}
              />
            </div>
          )}
        </div>
      ))}

      <hr />
    </div>
  );
}

export default DataForm;
