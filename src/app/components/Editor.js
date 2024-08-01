import React, { useState, useEffect } from 'react';
import usePreferences from '../hooks/usePreferences';
import Theme from './Form/Theme';
import Logo from './Form/Logo';

// Tab activo
const TabPanel = ({ children, isActive }) => {
  return isActive ? <div className="tab-panel">{children}</div> : null;
};

const Editor = ({ setPreferencesNew }) => {
  const { preferences, loading, error } = usePreferences();
  const [localPreferences, setLocalPreferences] = useState({});
  const [activeTab, setActiveTab] = useState('Theme');

  useEffect(() => {
    if (preferences) {
      // Toma valores del localStorage, si existen
      const savedTheme = JSON.parse(localStorage.getItem('theme')) || {};
      const savedLogo = JSON.parse(localStorage.getItem('logo')) || {};

      // Combinar los datos por defecto con los guardados en localStorage
      const newJSON = {
        ...preferences,
        theme: { ...preferences.theme, ...savedTheme },
        logo: { ...preferences.logo, ...savedLogo },
      };

      setLocalPreferences(newJSON);
      setPreferencesNew(newJSON);
    }
  }, [preferences, setPreferencesNew]);

  // Asigna a cada formulario el objeto que le corresponde
  const getConfig = (key) => {
    if (localPreferences && localPreferences[key]) {
      return localPreferences[key];
    } else {
      return null;
    }
  };

  
  const updatePreferences = (key, updatedData) => {
    setLocalPreferences((prevPreferences) => {
      const newJSON = { ...prevPreferences, [key]: updatedData };
      setPreferencesNew(newJSON);
      return newJSON;
    });
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
          className={`tab ${activeTab === 'Logo' ? 'active' : ''}`}
          onClick={() => setActiveTab('Logo')}
        >
          Logo
        </button>
      </div>
      <div className="form-content">
        <TabPanel isActive={activeTab === 'Theme'}>
          <Theme data={getConfig('theme')} updatePreferences={updatePreferences} />
        </TabPanel>
        <TabPanel isActive={activeTab === 'Logo'}>
          <Logo data={getConfig('logo')} updatePreferences={updatePreferences} />
        </TabPanel>
      </div>
    </div>
  );
};

export default Editor;
