import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePreferences from '../hooks/usePreferences';
import useData from '../hooks/useData';
import { resetPreferences } from '../store/preferencesSlice';
import { resetData } from '../store/dataSlice';
import FormGroupManager from './FormGroupManager';

const formGroupManager = new FormGroupManager();

const Editor = ({ setPreferencesNew, setDataNew, activeGroup }) => {
  const dispatch = useDispatch();
  const { preferences, loading: preferencesLoading, error: preferencesError } = usePreferences();
  const { data, loading: dataLoading, error: dataError } = useData();
  const userPreferences = useSelector((state) => state.preferences);
  const userData = useSelector((state) => state.data);

  const [activeTab, setActiveTab] = useState(formGroupManager.getDefaultTab(activeGroup));

  // Actualiza activeTab cuando activeGroup cambie
  useEffect(() => {
    setActiveTab(formGroupManager.getDefaultTab(activeGroup));
  }, [activeGroup]);

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
      <div className="tabs">
        {formGroupManager.getTabs(activeGroup).map((tab) => (
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
        {formGroupManager.getTabs(activeGroup).map((tab) => {
          const FormComponent = formGroupManager.getFormComponent(tab);
          return (
            <div key={tab} style={{ display: activeTab === tab ? 'block' : 'none' }}>
              {FormComponent && <FormComponent data={getConfig(tab.toLowerCase(), 'preferences')} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Editor;
