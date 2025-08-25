import { useState, useEffect, useRef, useCallback } from 'react';
import DataForm from "./DataForm";
import PreferencesForm from "./PreferencesForm"; // Asegurate que exista este componente

function ArgenmapForm() {
  const [data, setData] = useState(null);
  const [preferences, setPreferences] = useState(null);
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
    <div className="argenmap-form-container" style={{ display: 'flex', gap: '1rem' }}>
      {/* Contenedor con navbar y formularios */}
      <div style={{ flex: '0 0 33%', borderRight: '1px solid #ccc', paddingRight: '1rem', overflowY: 'auto', maxHeight: '80vh' }}>
        {/* Navbar */}
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => setActiveForm('dataform')}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              backgroundColor: activeForm === 'dataform' ? '#007acc' : '#f0f0f0',
              color: activeForm === 'dataform' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            DataForm
          </button>
          <button
            onClick={() => setActiveForm('preferences')}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              backgroundColor: activeForm === 'preferences' ? '#007acc' : '#f0f0f0',
              color: activeForm === 'preferences' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            PreferencesForm
          </button>
        </div>

        {/* Mostrar el formulario seleccionado */}
        {activeForm === 'dataform' && <DataForm data={data} onDataChange={handleDataChange} />}
        {activeForm === 'preferences' && <PreferencesForm preferences={preferences} onPreferencesChange={handlePreferencesChange} />}
      </div>

      {/* Preview */}
      <div style={{ flex: '0 0 66%', display: 'flex', flexDirection: 'column' }}>
        <iframe
          name={iframeName}
          title="Preview"
          className="iframe-preview"
          style={{ flex: 1, border: '1px solid #ccc', borderRadius: '6px', minHeight: '600px' }}
        />
      </div>

      {/* Form oculto para enviar data */}
      <form
        ref={formRef}
        method="POST"
        action="http://localhost:4000/argenmap/custom"
        target={iframeName}
        style={{ display: 'none' }}
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
  );
}

export default ArgenmapForm;
