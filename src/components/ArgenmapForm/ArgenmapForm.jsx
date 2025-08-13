import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
function ArgenmapForm() {
  const [data, setData] = useState('Data default')
  const [preferences, setPreferences] = useState('Default para empezar')

  const iframeName = 'previewIframe';
  const formRef = useRef(null);

  useEffect(() => {
    if (data && formRef.current) {
      formRef.current.submit();
    }
  }, [data]);

  return (
    <>
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
          value={JSON.stringify(data)}
          readOnly
        />
        <input
          type="hidden"
          name="preferences"
          value={JSON.stringify(preferences)}
          readOnly
        />
      </form>
      <button onClick={() => setData(!data)}>Enviar</button>
      <iframe
        name={iframeName}
        title="Preview"
        style={{ width: '100%', height: '600px', border: 'none' }}
      />
    </>
  )
}

export default ArgenmapForm;