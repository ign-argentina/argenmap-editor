import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import '/src/global.css';
import './Form.css';
import { useToast } from '../../context/ToastContext';
import defaultConfig from '../../static/config.json';
import ArgenmapForm from '../ArgenmapForm/ArgenmapForm';
import { useUser } from '../../context/UserContext';

function Form() {
  const location = useLocation();
  const { viewer, editorMode, externalUpload = false, isArgenmap = true } = location.state || {}; // Recibe configuraciones
  const { isAuth } = useUser()

  const [config, setConfig] = useState();
  const [workingConfig, setWorkingConfig] = useState(null);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // No te vayas! -> Este va para el formulario

  // Memoizamos para que mergedConfig solo cambie si cambia workingConfig o config
  /*   const mergedConfig = useMemo(() => mergeViewer(workingConfig, config), [workingConfig, config]); */


  useEffect(() => {
    if (viewer || externalUpload) {
      setConfig(externalUpload ? externalUpload : viewer.config.json);

      if (workingConfig) {
        setWorkingConfig(workingConfig)
      } else {
        setWorkingConfig(externalUpload ? externalUpload : viewer.config.json);
      }

    } else {
      setConfig(defaultConfig);
      setWorkingConfig(defaultConfig);
    }
  }, []);


  // No te vayas! Se pueden borrar los cambios!! (OPTIMIZAR)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  // Fin no te vayas (OPTIMIZAR)

/*   const { showToast } = useToast(); */

  return (
    <>
      <div className="page-form">
        <div className="pg-form">
          {isArgenmap ? <ArgenmapForm editorMode={editorMode} config={location.state || {}} /> : <h1>KhartaForm</h1>}
        </div>
      </div>

    </>
  );
}

export default Form;