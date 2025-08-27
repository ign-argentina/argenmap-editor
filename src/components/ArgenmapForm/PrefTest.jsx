import React, { useState, useRef } from "react";
import defaultPreferences from "./defaultPreferences";
import "./PreferencesForm.css";

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
  const key = path.split(".").pop();
  return key.replace(/[_-]/g, " ");
};

// Detecta si un string es un color válido
const isColorString = (value) => {
  if (typeof value !== "string") return false;
  const hex = /^#([0-9A-Fa-f]{3,8})$/;
  const rgba = /^rgba?\(\s*(\d+\s*,){2,3}\s*[\d.]+\s*\)$/;
  return hex.test(value) || rgba.test(value);
};

function PrefTest({ preferences, onPreferencesChange }) {
  const [localPreferences, setLocalPreferences] = useState(
    preferences || defaultPreferences
  );
  const [openSections, setOpenSections] = useState([]);
  const colorTimeouts = useRef({});

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

  // Debounced para cambios de color
  const debouncedColorChange = (path, value) => {
    clearTimeout(colorTimeouts.current[path]);
    colorTimeouts.current[path] = setTimeout(() => {
      updateValue(path, value);
    }, 150);
  };

  // -------- PRIMITIVOS --------
  const renderPrimitiveInline = (path, value) => {
    const label = labelFromPath(path);
    const isNumber = typeof value === "number";
    const isBoolean = typeof value === "boolean";

    // Input de color si detecta un color válido
    if (isColorString(value)) {
      return (
        <div className="form-group" key={path}>
          <label>{label}</label>
          {/* <input
            type="text"
            value={value}
            onChange={(e) => debouncedColorChange(path, e.target.value)}
            placeholder="ej: #ffffff o rgba(255,255,255,0.7)"
          /> */}
          <input
            type="color"
            value={value.startsWith("rgba") ? "#ffffff" : value} // fallback para rgba
            onChange={(e) => debouncedColorChange(path, e.target.value)}
            title={label}
          />
        </div>
      );
    }

    return (
      <div className="form-group" key={path}>
        <label>{label}</label>
        {isBoolean ? (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => updateValue(path, e.target.checked)}
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

  const renderPrimitiveAccordion = (path, value) => (
    <div className="accordion-item" key={path}>
      <div className="accordion-header" onClick={() => toggleSection(path)}>
        <span>{labelFromPath(path)}</span>
      </div>
      {openSections.includes(path) && (
        <div className="accordion-content">{renderPrimitiveInline(path, value)}</div>
      )}
    </div>
  );

  // -------- ARRAYS --------
  const renderPrimitiveArrayInline = (path, value) => {
    const label = labelFromPath(path);
    return (
      <div className="form-group" key={path}>
        <label>{label}</label>
        {value.map((item, i) => (
          <div key={`${path}.${i}`} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              className="array-item"
              value={item}
              onChange={(e) => {
                const newArr = [...value];
                newArr[i] = e.target.value;
                updateValue(path, newArr);
              }}
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

  const renderObjectArrayInline = (path, arr) => {
    const label = labelFromPath(path);
    const template = arr[0] ? emptyLike(arr[0]) : {};
    return (
      <div className="form-group" key={path}>
        <strong>{label}</strong>
        {arr.map((obj, i) => (
          <div key={`${path}.${i}`} className="geoprocessing-process">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span><b>Item {i + 1}</b></span>
              <button
                type="button"
                className="button-delete"
                onClick={() => {
                  const newArr = arr.filter((_, idx) => idx !== i);
                  updateValue(path, newArr);
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
            {Object.entries(obj).map(([k, v]) =>
              renderNode(`${path}.${i}.${k}`, v, false)
            )}
          </div>
        ))}
        <button
          type="button"
          className="button-primary"
          onClick={() => updateValue(path, [...arr, emptyLike(template)])}
        >
          + Agregar objeto
        </button>
      </div>
    );
  };

  // -------- ROUTER --------
  const renderNode = (path, value, isRoot) => {
    if (["string", "number", "boolean"].includes(typeof value)) {
      return isRoot ? renderPrimitiveAccordion(path, value) : renderPrimitiveInline(path, value);
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
        <div key={path}>
          {Object.entries(value).map(([k, v]) => renderNode(`${path}.${k}`, v, false))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="preferencesform-container">
      <h2 className="preferencesform-header">Preferencias</h2>
      {Object.entries(localPreferences).map(([k, v]) => renderNode(k, v, true))}
    </div>
  );
}

export default PrefTest;
