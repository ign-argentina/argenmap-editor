import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePreferences from '../hooks/usePreferences';
import useData from '../hooks/useData';
import Theme from './Form/Theme';
import Logo from './Form/Logo';
import Geoprocessing from './Form/Geoprocessing';
import Searchbar from './Form/Searchbar';
import Data from './Form/Data';
import { resetPreferences } from '../store/preferencesSlice';
import { resetData } from '../store/dataSlice';

// Panel de grupo activo
const GroupPanel = ({ children, isActive }) => {
  return isActive ? <div>{children}</div> : null;
};

// Panel de pestañas
const TabPanel = ({ children, isActive }) => {
  return isActive ? <div>{children}</div> : null;
};

const Editor = ({ setPreferencesNew, setDataNew, activeGroup }) => {
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
      if (JSON.stringify(userPreferences) !== JSON.stringify(combinedPreferences)) {
        dispatch(resetPreferences(combinedPreferences));
      }
    }
  }, [preferences, userPreferences, dispatch, setPreferencesNew]);

  useEffect(() => {
    if (data) {
      const combinedData = { ...data, ...userData };
      setDataNew(combinedData);
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
    <div>
      {activeGroup === 'themeGroup' && (
        <div>
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
              <Theme data={getConfig('theme', 'preferences')} />
            </TabPanel>
            <TabPanel isActive={activeTab === 'Logo'}>
              <Logo data={getConfig('logo', 'preferences')} />
            </TabPanel>
          </div>
        </div>
      )}

      {activeGroup === 'logoGroup' && (
        <div>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'Geoprocessing' ? 'active' : ''}`}
              onClick={() => setActiveTab('Geoprocessing')}
            >
              Geoprocesos
            </button>
            <button
              className={`tab ${activeTab === 'Searchbar' ? 'active' : ''}`}
              onClick={() => setActiveTab('Searchbar')}
            >
              Buscador
            </button>
          </div>
          <div className="form-content">
            <TabPanel isActive={activeTab === 'Geoprocessing'}>
              <Geoprocessing data={getConfig('geoprocessing', 'preferences')} />
            </TabPanel>
            <TabPanel isActive={activeTab === 'Searchbar'}>
              <Searchbar data={getConfig('searchbar', 'preferences')} />
            </TabPanel>
          </div>
        </div>
      )}

      {activeGroup === 'dataGroup' && (
        <div>
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
              <Theme data={getConfig('theme', 'preferences')} />
            </TabPanel>
            <TabPanel isActive={activeTab === 'Logo'}>
              <Logo data={getConfig('logo', 'preferences')} />
            </TabPanel>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
