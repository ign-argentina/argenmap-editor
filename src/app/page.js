'use client'
import { useState, useCallback } from 'react';
import TabsForm from './components/TabsForm';
import Preview from './components/Preview';

export default function Page() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    anotherField: '',
    fourthField: '',
  });

  const [key, setKey] = useState(0);

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const forceRenderPreview = useCallback(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  return (
    <div className="editor-container">
      <div className="form-container">
        <TabsForm formData={formData} onFormChange={handleFormChange} />
        <button onClick={forceRenderPreview}>Actualizar Preview</button>
      </div>
      <div className="preview-container">
        <Preview key={key} />
      </div>
    </div>
  );
}