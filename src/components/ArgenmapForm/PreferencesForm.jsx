import React, { useState } from "react";
import defaultPreferences from "../../static/defaultPreferences";
import language from '../../static/language.json'
import "./PreferencesForm.css";

const lang = language["es"];

// helper
const parseRgba = (rgbaString) => {
  const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/);
  if (!match) return null;
  const [, r, g, b, a] = match;
  return {
    r: parseInt(r, 10),
    g: parseInt(g, 10),
    b: parseInt(b, 10),
    a: a !== undefined ? parseFloat(a) : 1,
  };
};

const rgbaToHex = ({ r, g, b }) =>
  "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");

const emptyLike = (sample) => {
  if (Array.isArray(sample)) return [];
  if (sample === null || typeof sample !== "object") {
    if (typeof sample === "boolean") return false;
    if (typeof sample === "number") return 0;
    return "";
  }
  const out = {};
  for (const [k, v] of Object.entries(sample)) out[k] = emptyLike(v);
  return out;
};

const labelFromPath = (path) => {
  // Primero intentamos un match exacto en el idioma
  if (lang[path]) return lang[path];

  // Luego intentamos con la última clave
  const key = path.split(".").pop();
  if (lang[key]) return lang[key];

  // Por último, fallback automático
  return key.replace(/[_-]/g, " ");
};

function PreferencesForm({ preferences, onPreferencesChange }) {
  const [localPreferences, setLocalPreferences] = useState(
    preferences || defaultPreferences
  );
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (path) => {
    setOpenSections((prev) =>
      prev.includes(path) ? prev.filter((s) => s !== path) : [...prev, path]
    );
  };

  const updateValue = (path, newValue) => {
    const keys = path.split(".");
    const newPrefs = structuredClone(localPreferences);
    let obj = newPrefs;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = newValue;
    setLocalPreferences(newPrefs);
    onPreferencesChange?.(newPrefs);
  };

  // -------- PRIMITIVOS --------
  const renderPrimitiveInline = (path, value) => {
    const label = labelFromPath(path);
    const isNumber = typeof value === "number";
    const isBoolean = typeof value === "boolean";
    const isHexColor = typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);
    const rgba = typeof value === "string" ? parseRgba(value) : null;

    return (
      <div className="form-group" key={path}>
        <label>{label}</label>
        {isBoolean ? (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => updateValue(path, e.target.checked)}
          />
        ) : rgba ? (
          <div className="color-picker-with-alpha">
            <input
              type="color"
              value={rgbaToHex(rgba)}
              onChange={(e) => {
                const hex = e.target.value;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                updateValue(path, `rgba(${r}, ${g}, ${b}, ${rgba.a})`);
              }}
            />
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={rgba.a}
              onChange={(e) => {
                const newAlpha = parseFloat(e.target.value);
                updateValue(path, `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${newAlpha})`);
              }}
            />
          </div>
        ) : isHexColor ? (
          <input
            type="color"
            value={value}
            onChange={(e) => updateValue(path, e.target.value)}
          />
        ) : (
          <input
            type={isNumber ? "number" : "text"}
            value={value}
            onChange={(e) =>
              isNumber
                ? updateValue(path, e.target.value === "" ? 0 : Number(e.target.value))
                : updateValue(path, e.target.value)
            }
          />
        )}
      </div>
    );
  };

  const renderPrimitiveAccordion = (path, value) => {
    const label = labelFromPath(path);
    const isNumber = typeof value === "number";
    const isBoolean = typeof value === "boolean";
    const isHexColor = typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);
    const rgba = typeof value === "string" ? parseRgba(value) : null;

    return (
      <div className="accordion-item" key={path}>
        <div className="accordion-header" onClick={() => toggleSection(path)}>
          <span>{label}</span>
        </div>
        {openSections.includes(path) && (
          <div className="accordion-content">
            <div className="form-group">
              <label>{label}</label>
              {isBoolean ? (
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateValue(path, e.target.checked)}
                />
              ) : rgba ? (
                <div className="color-picker-with-alpha">
                  <input
                    type="color"
                    value={rgbaToHex(rgba)}
                    onChange={(e) => {
                      const hex = e.target.value;
                      const r = parseInt(hex.slice(1, 3), 16);
                      const g = parseInt(hex.slice(3, 5), 16);
                      const b = parseInt(hex.slice(5, 7), 16);
                      updateValue(path, `rgba(${r}, ${g}, ${b}, ${rgba.a})`);
                    }}
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={rgba.a}
                    onChange={(e) => {
                      const newAlpha = parseFloat(e.target.value);
                      updateValue(path, `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${newAlpha})`);
                    }}
                  />
                </div>
              ) : isHexColor ? (
                <input
                  type="color"
                  value={value}
                  onChange={(e) => updateValue(path, e.target.value)}
                />
              ) : (
                <input
                  type={isNumber ? "number" : "text"}
                  value={value}
                  onChange={(e) =>
                    isNumber
                      ? updateValue(path, e.target.value === "" ? 0 : Number(e.target.value))
                      : updateValue(path, e.target.value)
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // -------- ARRAYS (primitivos) --------
  const renderPrimitiveArrayInline = (path, value) => {
    const label = labelFromPath(path);
    return (
      <div className="form-group" key={path}>
        <label>{label}</label>
        {value.map((item, i) => (
          <div key={`${path}.${i}`} style={{ display: "flex", gap: "0.5rem", marginBottom: "8px" }}>
            <input
              className="array-item"
              value={item}
              onChange={(e) => {
                const newArr = [...value];
                newArr[i] = e.target.value;
                updateValue(path, newArr);
              }}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="button-delete"
              onClick={() => {
                const newArr = value.filter((_, idx) => idx !== i);
                updateValue(path, newArr);
              }}
            >
              🗑️
            </button>
          </div>
        ))}
        <button
          type="button"
          className="button-primary"
          onClick={() => updateValue(path, [...value, ""])}
        >
          + Agregar
        </button>
      </div>
    );
  };

  // -------- ARRAYS DE OBJETOS: sin botones (solo edición interna) --------
  const renderObjectArrayInline = (path, arr) => {
    const label = labelFromPath(path);
    return (
      <div className="form-group" key={path}>
        <strong>{label}</strong>
        {arr.map((obj, i) => (
          <div key={`${path}.${i}`} className="geoprocessing-process">
            {Object.entries(obj).map(([k, v]) =>
              renderNode(`${path}.${i}.${k}`, v, false)
            )}
          </div>
        ))}
        {/* NOTA: quitaron los botones de "Eliminar" y "+ Agregar objeto" para arrays de objetos */}
      </div>
    );
  };

  // -------- ROUTER --------
  const renderNode = (path, value, isRoot) => {
    if (["string", "number", "boolean"].includes(typeof value)) {
      return isRoot
        ? renderPrimitiveAccordion(path, value)
        : renderPrimitiveInline(path, value);
    }
    if (Array.isArray(value)) {
      const isArrayOfObjects = value.every((it) => typeof it === "object" && it !== null);
      return isRoot ? (
        <div className="accordion-item" key={path}>
          <div className="accordion-header" onClick={() => toggleSection(path)}>
            <span>{labelFromPath(path)}</span>
          </div>
          {openSections.includes(path) && (
            <div className="accordion-content">
              {isArrayOfObjects
                ? renderObjectArrayInline(path, value)
                : renderPrimitiveArrayInline(path, value)}
            </div>
          )}
        </div>
      ) : isArrayOfObjects
        ? renderObjectArrayInline(path, value)
        : renderPrimitiveArrayInline(path, value);
    }
    if (typeof value === "object" && value !== null) {
      return isRoot ? (
        <div className="accordion-item" key={path}>
          <div className="accordion-header" onClick={() => toggleSection(path)}>
            <span>{labelFromPath(path)}</span>
          </div>
          {openSections.includes(path) && (
            <div className="accordion-content">
              {Object.entries(value).map(([k, v]) => renderNode(`${path}.${k}`, v, false))}
            </div>
          )}
        </div>
      ) : (
        <div key={path} className="nested-object">
          <strong className="nested-label">{labelFromPath(path)}</strong>
          <div className="nested-content">
            {Object.entries(value).map(([k, v]) => renderNode(`${path}.${k}`, v, false))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="preferencesform-container">
      <h2 className="preferencesform-header">Configuraciones Básicas</h2>
      {Object.entries(localPreferences).map(([k, v]) => renderNode(k, v, true))}
    </div>
  );
}

export default PreferencesForm;
