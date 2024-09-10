'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { useState } from 'react';
import Preview from './components/Preview';
import Navbar from './components/Navbar';
import SectionTabs from './components/SectionTabs';
import usePreferences from '../app/hooks/usePreferences';

export default function Page() {
  const [preferencesNew, setPreferencesNew] = useState({});
  const [activeSection, setActiveSection] = useState(null); // Controla la sección activa
  const { preferences, loading: preferencesLoading, error: preferencesError } = usePreferences();

  // Función para descargar el archivo JSON con las preferencias
  const downloadPreferencesFile = () => {
    const json = JSON.stringify(preferencesNew, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    console.log(preferences)
    const link = document.createElement('a');
    link.href = url;
    link.download = 'preferencesNew.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Provider store={store}>
      <div className="editor-container">
        <Navbar setActiveGroup={setActiveSection} /> {/* Navbar cambia la sección activa */}
        
        <div className="form-container">
          {/* Renderizamos SectionTabs solo si hay una sección activa */}
          {activeSection && preferences[activeSection] && (
            <SectionTabs sectionData={preferences[activeSection]} />
          )}
          <div className="download-button-container">
            <button onClick={downloadPreferencesFile} className="download-button">
              Descargar Preferences
            </button>
          </div>
        </div>
        
        <div className="preview-container">
          <Preview />
        </div>
      </div>
    </Provider>
  );
}
