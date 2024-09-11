'use client';

import { Provider, useDispatch, useSelector } from 'react-redux';
// import { store } from '../store/store'; // Asegúrate de que la ruta sea correcta
import { useEffect, useState } from 'react';
import Preview from '../components/Preview';
import Navbar from '../components/Navbar';
import SectionTabs from '../components/SectionTabs';
import useConfig from '../hooks/useConfig';
import { resetConfig } from '../store/configSlice'; // Importar resetConfig de Redux

export default function Editor() {
  const [activeSection, setActiveSection] = useState(null); // Controla la sección activa
  const { config, loading: configLoading, error: configError } = useConfig();
  
  const dispatch = useDispatch(); // Asegúrate de que useDispatch esté dentro del Provider
  const configNew = useSelector((state) => state.config.config); // Selecciona el estado de config desde Redux
  console.log('Current Redux state:', configNew);
  useEffect(() => {
    if (config) {
      dispatch(resetConfig(config)); // Despacha la acción para inicializar la configuración
    }
  }, [config, dispatch]);

  // Función para descargar el archivo JSON con las preferencias
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
    // <Provider store={store}> {/* Aquí envuelve todo el componente en el Provider */}
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
    // </Provider>
  );
}
