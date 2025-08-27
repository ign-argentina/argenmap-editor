import React, { useState, useEffect } from "react";
import "./DataForm.css";

const crearMapa = (firstMapaBase) => ({
  titulo: firstMapaBase ? "Argenmap" : "",
  nombre: firstMapaBase ? "argenmap": "",
  servicio: "tms",
  version: "1.0.0",
  attribution: "",
  host: firstMapaBase ? "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png" : "",
  legendImg: "",
  peso: firstMapaBase ? 10 : null,
  selected: firstMapaBase ? true : false,
  zoom: {
    min: firstMapaBase ? 3: null,
    max: firstMapaBase ? 19 : null,
    nativeMin: firstMapaBase ? 3: null,
    nativeMax: firstMapaBase ? 19: null,
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
    const firstMapaBase = newItems[0].capas.length == 0
    newItems[0].capas.push(crearMapa(firstMapaBase));
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
      
      <section className="controls">
        <div className="highlight-badge">Mapas Base</div>
      </section>

      <section className="controls">
        <button type="button" className="button-primary" onClick={agregarMapa}>+ Agregar Mapa Base</button>
        <span className="info-text">Tienes cargado {localData.items[0].capas.length} mapa/s</span>
      </section>

      {localData.items[0].capas.length === 0 && <div className="empty-state">No hay mapas base. Agrega uno para comenzar.</div>}

      {localData.items[0].capas.map((capa, index) => (
        <div key={index} className="accordion-item">
          <div
            className="accordion-header"
            onClick={() => toggleMapa(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleMapa(index); }}
          >
            <div className="accordion-title">
              <span>{capa.titulo || '(sin título)'}</span>
            </div>
            <div>
              <span className="accordion-caret">{openMapas.includes(index) ? '▾' : '▸'}</span>
              <button className="button-delete" onClick={(e) => { e.stopPropagation(); eliminarMapa(index); }} title="Eliminar Mapa">🗑️</button>
            </div>
          </div>
          {openMapas.includes(index) && (
            <div className="accordion-content">
              <div className="form-group"><label>Título</label><input placeholder="Título del mapa" value={capa.titulo} onChange={(e) => handleMapaChange(index, "titulo", e.target.value)} /></div>
              <div className="form-group"><label>Nombre</label><input placeholder="Identificador interno" value={capa.nombre} onChange={(e) => handleMapaChange(index, "nombre", e.target.value)} /></div>

              <div className="grid-2">
                <div className="form-group"><label>Versión</label><input placeholder="Versión del servicio" value={capa.version} onChange={(e) => handleMapaChange(index, "version", e.target.value)} /></div>
                <div className="form-group"><label>Attribution</label><input placeholder="Texto de atribución" value={capa.attribution} onChange={(e) => handleMapaChange(index, "attribution", e.target.value)} /></div>
              </div>

              <div className="form-group"><label>Host / URL</label><input placeholder="https://example.com/tiles" value={capa.host} onChange={(e) => handleMapaChange(index, "host", e.target.value)} /></div>

              <div className="grid-2">
                <div className="form-group"><label>Peso</label><input placeholder="Peso (orden)" type="number" value={capa.peso || ""} onChange={(e) => handleMapaChange(index, "peso", Number(e.target.value))} /></div>
                <div className="form-group"><label>Imagen de leyenda (opcional)</label><input placeholder="URL de la imagen de la leyenda" value={capa.legendImg || ""} onChange={(e) => handleMapaChange(index, "legendImg", e.target.value)} /></div>
              </div>

              <strong>Zoom</strong>
              <div className="zoom-inputs">
                <input type="number" placeholder="min" value={capa.zoom.min || ""} onChange={(e) => handleMapaZoomChange(index, "min", e.target.value)} />
                <input type="number" placeholder="max" value={capa.zoom.max || ""} onChange={(e) => handleMapaZoomChange(index, "max", e.target.value)} />
                <input type="number" placeholder="nativeMin" value={capa.zoom.nativeMin || ""} onChange={(e) => handleMapaZoomChange(index, "nativeMin", e.target.value)} />
                <input type="number" placeholder="nativeMax" value={capa.zoom.nativeMax || ""} onChange={(e) => handleMapaZoomChange(index, "nativeMax", e.target.value)} />
              </div>
            </div>
          )}
        </div>
      ))}

      <hr />

      <section className="controls">
        <div className="highlight-badge">Capas</div>
      </section>

      <section className="controls">
        <button type="button" className="button-primary" onClick={agregarCapa}>+ Agregar Capa</button>
        <span className="info-text">Tienes cargado {localData.items.slice(1).length} capa/s</span>
      </section>

      {localData.items.slice(1).length === 0 && <div className="empty-state">No hay capas definidas. Añade capas para que aparezcan en el listado.</div>}

      {localData.items.slice(1).map((capa, index) => (
        <div key={index} className="accordion-item">
          <div className="accordion-header" onClick={() => toggleCapa(index)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleCapa(index); }}>
            <div className="accordion-title"><span>{capa.nombre || '(sin nombre)'}</span><span className="section-badge">{"- " + capa.seccion || 'sin sección'}</span></div>
            <div><span className="accordion-caret">{openCapas.includes(index) ? '▾' : '▸'}</span><button className="button-delete" onClick={(e) => { e.stopPropagation(); eliminarCapa(index); }} title="Eliminar Capa">🗑️</button></div>
          </div>
          {openCapas.includes(index) && (
            <div className="accordion-content">
              <div className="form-group"><label>Nombre</label><input placeholder="Nombre de la capa" value={capa.nombre} onChange={(e) => { const newItems = [...localData.items]; newItems[index + 1].nombre = e.target.value; setLocalData({ ...localData, items: newItems }); }} /></div>
              <div className="form-group"><label>Host / URL</label><input placeholder="https://example.com/wms" value={capa.host} onChange={(e) => { const newItems = [...localData.items]; newItems[index + 1].host = e.target.value; setLocalData({ ...localData, items: newItems }); }} /></div>

              <div className="grid-2">
                <div className="form-group"><label>Versión</label><input placeholder="Versión del servicio" value={capa.version} onChange={(e) => { const newItems = [...localData.items]; newItems[index + 1].version = e.target.value; setLocalData({ ...localData, items: newItems }); }} /></div>
                <div className="form-group"><label>Peso</label><input placeholder="Orden / Peso" value={capa.peso || ""} onChange={(e) => { const newItems = [...localData.items]; newItems[index + 1].peso = e.target.value; setLocalData({ ...localData, items: newItems }); }} /></div>
              </div>

              <div className="form-group"><label>Sección</label><input placeholder="Sección donde aparece la capa" value={capa.seccion} onChange={(e) => { const newItems = [...localData.items]; newItems[index + 1].seccion = e.target.value; setLocalData({ ...localData, items: newItems }); }} /></div>
            </div>
          )}
        </div>
      ))}

      <hr />
    </div>
  );
}

export default DataForm;