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
  const { viewer, editorMode, externalUpload = {}, isArgenmap } = location.state || {}; // Recibe configuraciones
  const { isAuth } = useUser()

  const { data, preferences } = viewer?.config || false
  const argenmap = (isArgenmap || (data && preferences))

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true); // No te vayas! -> Este va para el formulario

  useEffect(() => {
    if (viewer || externalUpload) {
      /*       setConfig(externalUpload ? externalUpload : viewer.config.json); */

      if (true) {
        /*         setWorkingConfig(workingConfig) */
      } else {
        /*         setWorkingConfig(externalUpload ? externalUpload : viewer.config.json); */
      }

    } else {
      /*       setConfig(defaultConfig);
            setWorkingConfig(defaultConfig); */
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
        {argenmap ? <ArgenmapForm viewer={viewer} editorMode={editorMode} config={{ data, preferences }} /> : <h1>KhartaForm</h1>}
      </div>
    </>
  );
}

export default Form;