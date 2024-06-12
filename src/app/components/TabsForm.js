import { useState } from 'react';
import Form from './Form';

const tabs = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'];

export default function TabsForm({ formData, onFormChange }) {
  const [activeTab, setActiveTab] = useState(0);

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
        <Form formData={formData} onFormChange={onFormChange} activeTab={activeTab} />
      </div>
    </div>
  );
}
