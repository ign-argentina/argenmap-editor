import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePreferences from '../hooks/usePreferences';
import useData from '../hooks/useData';
import { resetPreferences } from '../store/preferencesSlice';
import { resetData } from '../store/dataSlice';

// Importar todos los formularios
import Theme from './Form/Theme';
import Logo from './Form/Logo';
import Geoprocessing from './Form/Geoprocessing';
import Searchbar from './Form/Searchbar';
import Data from './Form/Data';

// Configuración de grupos y formularios
const formGroups = {
  themeGroup: {
    tabs: ['Theme', 'Logo'],
    components: {
      Theme: Theme,
      Logo: Logo
    }
  },
  logoGroup: {
    tabs: ['Geoprocessing', 'Searchbar'],
    components: {
      Geoprocessing: Geoprocessing,
      Searchbar: Searchbar
    }
  },
  dataGroup: {
    tabs: ['Theme', 'Logo'],
    components: {
      Theme: Theme,
      Logo: Logo
    }
  }
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
  const [activeTab, setActiveTab] = useState('');

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

  useEffect(() => {
    const groupConfig = formGroups[activeGroup];
    if (groupConfig && groupConfig.tabs.length > 0) {
      setActiveTab(groupConfig.tabs[0]);
    }
  }, [activeGroup]);

  if (preferencesLoading || dataLoading) return <div>Loading...</div>;
  if (preferencesError || dataError) return <div>{preferencesError || dataError}</div>;

  const groupConfig = formGroups[activeGroup];
  
  if (!groupConfig) {
    return <div>Invalid group selected.</div>;
  }

  const { tabs, components } = groupConfig;

  return (
    <div>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="form-content">
        {tabs.map(tab => {
          const Component = components[tab];
          return (
            <TabPanel key={tab} isActive={activeTab === tab}>
              <Component data={getConfig(tab.toLowerCase(), 'preferences')} />
            </TabPanel>
          );
        })}
      </div>
    </div>
  );
};

export default Editor;
