import { useState } from 'react';
import Form, { formComponents } from './Form/Form';
import usePreferences from '../hooks/usePreferences';

export default function TabsForm({ formData, onFormChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const { preferences, loading, error } = usePreferences();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Muestra el error si ocurrió alguno
  }

  return (
    <div className="tabs-form-container">
      <div className="tabs">
        {formComponents.map(({ name }, index) => (
          <button
            key={index}
            className={`tab ${index === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="form-content">
        <Form formData={formData} onFormChange={onFormChange} activeTab={activeTab} preferences={preferences} />
      </div>
    </div>
  );
}
