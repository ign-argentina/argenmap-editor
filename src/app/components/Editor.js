import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePreferences from '../hooks/usePreferences';
import useData from '../hooks/useData';
import Theme from './Form/Theme';
import Logo from './Form/Logo';
import Data from './Form/Data';
import { resetPreferences } from '../store/preferencesSlice';
import { resetData } from '../store/dataSlice';

// Tab activo
const TabPanel = ({ children, isActive }) => {
  return isActive ? <div className="tab-panel">{children}</div> : null;
};

const Editor = ({ setPreferencesNew, setDataNew }) => {
  const dispatch = useDispatch();
  const { preferences, loading: preferencesLoading, error: preferencesError } = usePreferences();
  const { data, loading: dataLoading, error: dataError } = useData();
  const userPreferences = useSelector((state) => state.preferences);
  const userData = useSelector((state) => state.data);
  const [activeTab, setActiveTab] = useState('Theme');

  useEffect(() => {
    if (preferences) {
      const combinedPreferences = { ...preferences, ...userPreferences };
      setPreferencesNew(combinedPreferences);
      
      // Solo actualiza el estado global si realmente hay cambios en preferences
      if (JSON.stringify(userPreferences) !== JSON.stringify(combinedPreferences)) {
        dispatch(resetPreferences(combinedPreferences));
      }
    }
  }, [preferences, userPreferences, dispatch, setPreferencesNew]);

  useEffect(() => {
    if (data) {
      const combinedData = { ...data, ...userData };
      setDataNew(combinedData); // Asignar el objeto `data` actualizado

      // Solo actualiza el estado global si realmente hay cambios en data
      if (JSON.stringify(userData) !== JSON.stringify(combinedData)) {
        dispatch(resetData(combinedData));
      }
    }
  }, [data, userData, dispatch, setDataNew]);

  const getConfig = (key, source = 'preferences') => {
    if (source === 'preferences') {
      return userPreferences[key] || preferences[key];
    } else if (source === 'data') {
      return userData[key] || data[key];
    } else {
      throw new Error("Invalid source specified. Use 'preferences' or 'data'.");
    }
  };
  

  if (preferencesLoading || dataLoading) return <div>Loading...</div>;
  if (preferencesError || dataError) return <div>{preferencesError || dataError}</div>;

  return (
    <div className="tabs-form-container">
      <div className="tabs">
        <button
          className={`tab button ${activeTab === 'Theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('Theme')}
        >
          Theme
        </button>
        <button
          className={`tab button ${activeTab === 'Logo' ? 'active' : ''}`}
          onClick={() => setActiveTab('Logo')}
        >
          Logo
        </button>
        {/* <button
          className={`tab ${activeTab === 'Data' ? 'active' : ''}`}
          onClick={() => setActiveTab('Data')}
        >
          Data
        </button> */}
      </div>
      <div className="form-content">
        <TabPanel isActive={activeTab === 'Theme'}>
          <Theme data={getConfig('theme', 'preferences')} />
        </TabPanel>
        <TabPanel isActive={activeTab === 'Logo'}>
          <Logo data={getConfig('logo', 'preferences')} />
        </TabPanel>
        {/* <TabPanel isActive={activeTab === 'Data'}>
          <Data data={getConfig('logo', 'preferences')} />
        </TabPanel> */}
      </div>
    </div>
  );
};

export default Editor;
