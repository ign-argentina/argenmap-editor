import { useState, useEffect, useRef, useCallback } from 'react';
import DataForm from "./DataForm";
import PreferencesForm from "./PreferencesForm";
import ViewerButtonActions from '../ViewerButtonActions/ViewerButtonActions';
import './ArgenmapForm.css';

function ArgenmapForm({ config, editorMode, viewer }) {
  const [data, setData] = useState(config.data || null);
  const [preferences, setPreferences] = useState(config.preferences || null);
  const [debouncedData, setDebouncedData] = useState(null);
  const [debouncedPreferences, setDebouncedPreferences] = useState(null);

  // Memoize the callback functions to prevent unnecessary re-renders
  const handleDataChange = useCallback((newData) => {
    setData(newData);
  }, []);

  const handlePreferencesChange = useCallback((newPreferences) => {
    setPreferences(newPreferences);
  }, []);

  const [activeForm, setActiveForm] = useState('dataform'); // 'dataform' o 'preferences'

  const iframeName = 'previewIframe';
  const formRef = useRef(null);
  const debounceTimer = useRef(null);

  // Debounce mechanism for data and preferences changes
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedData(data);
      setDebouncedPreferences(preferences);
    }, 1000); // 1 second delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [data, preferences]);

  // Submit form only when debounced values change
  useEffect(() => {
    if (debouncedData && formRef.current) {
      formRef.current.submit();
    }
  }, [debouncedData, debouncedPreferences]);

  return (
    <>
      <div className="argenmap-form-container">
        {/* Contenedor con navbar y formularios */}

        <div className="AAA">

          <div className="argenmap-form-sidebar">
            {/* Navbar */}
            <div className="argenmap-form-navbar">
              <button
                className={`tab-btn${activeForm === 'dataform' ? ' active' : ''}`}
                onClick={() => setActiveForm('dataform')}
              >
                Mapas y Capas
              </button>
              <button
                className={`tab-btn${activeForm === 'preferences' ? ' active' : ''}`}
                onClick={() => setActiveForm('preferences')}
              >
                Estilos y Preferencias
              </button>
            </div>

            {/* Mostrar el formulario seleccionado */}
            {activeForm === 'dataform' && <DataForm data={data} onDataChange={handleDataChange} />}
            {activeForm === 'preferences' && <PreferencesForm preferences={preferences} onPreferencesChange={handlePreferencesChange} />}
          </div>

          {/* Footer */}
          <div>
            {viewer?.name ? `${viewer.name}` : "Nuevo Visor"}
          </div>
          <ViewerButtonActions viewer={viewer} editorMode={editorMode} isArgenmap={true} getWorkingConfig={() => ({ data, preferences })}></ViewerButtonActions>
        </div>

        {/* Preview */}
        <div className="argenmap-form-preview">
          <iframe
            name={iframeName}
            title="Preview"
            className="iframe-preview"
          />
        </div>

        {/* Form oculto para enviar data */}
        <form
          ref={formRef}
          method="POST"
          action="http://localhost:4000/argenmap/custom"
          target={iframeName}
          className="hidden-form"
        >
          <input
            type="hidden"
            name="data"
            value={JSON.stringify(debouncedData)}
            readOnly
          />
          <input
            type="hidden"
            name="preferences"
            value={JSON.stringify(debouncedPreferences)}
            readOnly
          />
        </form>
      </div>

    </>
  );
}

export default ArgenmapForm;        