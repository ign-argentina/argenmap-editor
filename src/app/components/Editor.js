import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePreferences from '../hooks/usePreferences';
import { resetPreferences } from '../store/preferencesSlice';
import FormGroupManager from '../utils/FormGroupManager';

const formGroupManager = new FormGroupManager();

const Editor = ({ setPreferencesNew, activeGroup }) => {
  const dispatch = useDispatch();
  const { preferences, loading: preferencesLoading, error: preferencesError } = usePreferences();
  const userPreferences = useSelector((state) => state.preferences);
  const userData = useSelector((state) => state.data);

  const [activeTab, setActiveTab] = useState(formGroupManager.getDefaultTab(activeGroup));

  // Actualiza activeTab cuando activeGroup cambie
  useEffect(() => {
    setActiveTab(formGroupManager.getDefaultTab(activeGroup));
  }, [activeGroup]);

  // Actualiza preferences
  useEffect(() => {
    if (preferences) {
      const combinedPreferences = { ...preferences, ...userPreferences };
      setPreferencesNew(combinedPreferences);
      if (JSON.stringify(userPreferences) !== JSON.stringify(combinedPreferences)) {
        dispatch(resetPreferences(combinedPreferences));
      }
    }
  }, [preferences, userPreferences, dispatch, setPreferencesNew]);

  const getConfig = (key, source = 'preferences') => {
    if (source === 'preferences') {
      return userPreferences[key] || preferences[key];
    }
  };

  if (preferencesLoading) return <div>Loading...</div>;

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
