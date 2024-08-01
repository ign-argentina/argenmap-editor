'use client'
import { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';

export default function Page() {
  const [preferencesNew, setPreferencesNew] = useState({});

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const downloadPreferencesFile = () => {
    const json = JSON.stringify(preferencesNew, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'preferencesNew.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="editor-container">
      <div className="form-container">
        <Editor setPreferencesNew={setPreferencesNew} />
        <button onClick={downloadPreferencesFile}>Download JSON</button>
      </div>
      <div className="preview-container">
        <Preview />
      </div>
    </div>
  );
}
