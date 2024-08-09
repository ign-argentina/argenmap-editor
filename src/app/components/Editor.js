import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePreferences from '../hooks/usePreferences';
import Theme from './Form/Theme';
import Logo from './Form/Logo';
import Data from './Form/Data';
import { resetPreferences } from '../store/preferencesSlice';

// Tab activo
const TabPanel = ({ children, isActive }) => {
  return isActive ? <div className="tab-panel">{children}</div> : null;
};

const Editor = ({ setPreferencesNew, setDataNew }) => {
  const dispatch = useDispatch();
  const { preferences, loading, error } = usePreferences();
  const userPreferences = useSelector((state) => state.preferences);
  const [activeTab, setActiveTab] = useState('Theme');

  useEffect(() => {
    if (preferences) {
      const combinedPreferences = { ...preferences, ...userPreferences };
      setPreferencesNew(combinedPreferences);
      // Solo actualiza el estado global si realmente hay cambios
      if (JSON.stringify(userPreferences) !== JSON.stringify(combinedPreferences)) {
        dispatch(resetPreferences(combinedPreferences));
      }
    }
  }, [preferences, userPreferences, dispatch, setPreferencesNew]);

  const getConfig = (key) => {
    return userPreferences[key] || preferences[key];
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
        <button
          className={`tab ${activeTab === 'Data' ? 'active' : ''}`}
          onClick={() => setActiveTab('Data')}
        >
          Data
        </button>
      </div>
      <div className="form-content">
        <TabPanel isActive={activeTab === 'Theme'}>
          <Theme data={getConfig('theme')} />
        </TabPanel>
        <TabPanel isActive={activeTab === 'Logo'}>
          <Logo data={getConfig('logo')} />
        </TabPanel>
        <TabPanel isActive={activeTab === 'Data'}>
          <Data data={getConfig('items')} />
        </TabPanel>
      </div>
    </div>
  );
};

export default Editor;
