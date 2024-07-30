import React, { useState } from 'react';
import usePreferences from '../hooks/usePreferences';
import Theme from './Form/Theme';

// Tab activo
const TabPanel = ({ children, isActive }) => {
  return isActive ? <div className="tab-panel">{children}</div> : null;
};

const Editor = () => {
  const { preferences, loading, error } = usePreferences();
  const [activeTab, setActiveTab] = useState('Theme');

  // Obtiene el objeto del preferences necesario
  const getConfig = (key) => {
    if (preferences && preferences[key]) {
      return preferences[key];
    } else {
      return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="tabs-form-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'Theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('Theme')}
        >
          Theme
        </button>
        <button
          className={`tab ${activeTab === 'Example' ? 'active' : ''}`}
          onClick={() => setActiveTab('Example')}
        >
          Logo
        </button>
      </div>
      <div className="form-content">
        <TabPanel isActive={activeTab === 'Theme'}>
          <Theme data={getConfig('theme')} />
        </TabPanel>
        <TabPanel isActive={activeTab === 'Example'}>
          <Theme data={getConfig('logo')} />
        </TabPanel>
      </div>
    </div>
  );
};

export default Editor;
