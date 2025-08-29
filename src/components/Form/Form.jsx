import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '/src/global.css';
import './Form.css';
import { useUser } from '../../context/UserContext';
import ArgenmapForm from '../ArgenmapForm/ArgenmapForm';
import defaultConfig from '../../static/config.json';

function Form() {
  const location = useLocation();
  const { viewer, editorMode, externalUpload = null, isArgenmap } = location.state || {}; 
  const { isAuth } = useUser();

  // ---- Unificamos config ----
  const viewerConfig = viewer?.config;
  const externalConfig = externalUpload?.files;

  const data = viewerConfig?.data || externalConfig?.data || null;
  const preferences = viewerConfig?.preferences || externalConfig?.preferences || null;

  // Si viene flag o si detectamos que tiene data+preferences => argeanmap
  const argenmap = isArgenmap || (data && preferences);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

  // No te vayas! Se pueden borrar los cambios!!
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

  return (
    <div>
      {argenmap ? (
        <ArgenmapForm
          viewer={viewer}
          editorMode={editorMode}
          config={{ data, preferences }}
        />
      ) : (
        <h1>KhartaForm</h1>
      )}
    </div>
  );
}

export default Form;