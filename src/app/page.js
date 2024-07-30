'use client'
import { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import newPreferences from './utils/newPreferences';

export default function Page() {
  const [formData, setFormData] = useState({
    ...newPreferences,
    // Asegúrate de que `formData` comience con campos vacíos en lugar de valores por defecto.
    theme: { bodyBackground: '' },
  });

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const downloadPreferencesFile = () => {
    // Copiar `formData` para no mutar el estado original
    const finalFormData = { ...formData };

    // Establecer el valor por defecto si el campo está vacío
    if (!finalFormData.theme.bodyBackground) {
      finalFormData.theme.bodyBackground = newPreferences.theme.bodyBackground;
    }

    const json = JSON.stringify(finalFormData, null, 2);
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
        <Editor formData={formData} onFormChange={handleFormChange} />
        <button onClick={downloadPreferencesFile}>Download JSON</button>
      </div>
      <div className="preview-container">
        <Preview />
      </div>
    </div>
  );
}
