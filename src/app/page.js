'use client'
import { useState } from 'react';
import TabsForm from './components/TabsForm';
import Preview from './components/Preview';

export default function Page() {
  const [formData, setFormData] = useState({
    example: '',
    datos: '',
  });

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const downloadJsonFile = () => {
    const json = JSON.stringify(formData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'formData.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="editor-container">
      <div className="form-container">
        <TabsForm formData={formData} onFormChange={handleFormChange} />
        <button onClick={downloadJsonFile}>Download JSON</button>
      </div>
      <div className="preview-container">
        <Preview/>
      </div>
    </div>
  );
}
