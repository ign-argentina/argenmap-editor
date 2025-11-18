import { useEffect, useRef } from 'react';
import currentViewer from '../../api/viewerServer';
function Preview({ config }) {
  const iframeName = 'previewIframe';
  const formRef = useRef(null);

  useEffect(() => {
    if (config && formRef.current) {
      formRef.current.submit();
    }
  }, [config]);

  return (
    <>
      <form
        ref={formRef}
        method="POST"
        action={`http://${currentViewer.IP}:${currentViewer.API_PORT}`}
        target={iframeName}
        style={{ display: 'none' }}
      >
        <input
          type="hidden"
          name="config"
          value={JSON.stringify(config)}
          readOnly
        />
      </form>
      <iframe
        name={iframeName}
        title="Preview"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </>
  );
}

export default Preview;