import { useState } from 'react';
import Form from './Form';
import usePreferences from '../hooks/usePreferences';

const tabs = ['Tab1', 'Tab2', 'Tab3', 'Tab4'];

export default function TabsForm({ formData, onFormChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const { preferences, loading, error } = usePreferences();

  if (loading) {
    return <div>Loading...</div>; // Puedes mostrar un indicador de carga aquí
  }

  if (error) {
    return <div>{error}</div>; // Muestra el error si ocurrió alguno
  }

  return (
    <div className="tabs-form-container">
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="form-content">
        <Form formData={formData} onFormChange={onFormChange} activeTab={activeTab} preferences={preferences} />
      </div>
    </div>
  );
}
