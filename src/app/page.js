'use client'
import { useState } from 'react';
import TabsForm from './components/TabsForm';
import Preview from './components/Preview';

export default function Page() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    anotherField: '',
    fourthField: '',
  });

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  return (
    <div className="editor-container">
      <div className="form-container">
        <TabsForm formData={formData} onFormChange={handleFormChange} />
      </div>
      <div className="preview-container">
        <Preview/>
      </div>
    </div>
  );
}
