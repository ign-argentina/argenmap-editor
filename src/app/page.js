'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { useState } from 'react';
import Preview from './components/Preview';
import Navbar from './components/Navbar';
import SectionTabs from './components/SectionTabs';
import useConfig from '../app/hooks/useConfig';

export default function Page() {
  const [configNew, setConfigNew] = useState({});
  const [activeSection, setActiveSection] = useState(null); // Controla la sección activa
  const { config, loading: configLoading, error: configError } = useConfig();

  // Función para descargar el archivo JSON con las preferencias
  const downloadConfigFile = () => {
    const json = JSON.stringify(configNew, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    console.log(config)
    const link = document.createElement('a');
    link.href = url;
    link.download = 'configNew.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Provider store={store}>
      <div className="editor-container">
        <Navbar setActiveGroup={setActiveSection} config={config} /> {/* Pasar config a Navbar */}
        <div className="form-container">
          {/* Renderizamos SectionTabs solo si hay una sección activa */}
          {activeSection && config[activeSection] && (
            <SectionTabs sectionData={config[activeSection]} />
          )}
          <div className="download-button-container">
            <button onClick={downloadConfigFile} className="download-button">
              Descargar Configuración
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
