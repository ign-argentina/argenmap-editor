'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Preview from '../components/Preview';
import Navbar from '../components/Navbar';
import SectionTabs from '../components/SectionTabs';
import useConfig from '../hooks/useConfig';
import { setConfig } from '../store/configSlice'; // Importar setConfig de Redux

export default function Editor() {
  const [activeSection, setActiveSection] = useState(null); // Controla la sección activa
  const { config, loading: configLoading, error: configError } = useConfig();
  
  const dispatch = useDispatch();
  const configNew = useSelector((state) => state.config);

  useEffect(() => {
    if (config) {
      dispatch(setConfig(config));
    }
  }, [config, dispatch]);

  // Función para descargar el archivo JSON con la conf
  const downloadConfigFile = () => {
    const json = JSON.stringify(configNew, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'configNew.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
      <div className="editor-container">
        <Navbar setActiveGroup={setActiveSection} config={config} />
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
  );
}
