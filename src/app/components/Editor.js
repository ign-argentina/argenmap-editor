import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConfig from '../hooks/useConfig';
import { resetConfig } from '../store/configSlice';
import FormGroupManager from '../utils/FormGroupManager';

const formGroupManager = new FormGroupManager();

const Editor = ({ setConfigNew, activeGroup }) => {
  const dispatch = useDispatch();
  const { config, loading: configLoading, error: configError } = useConfig();
  const userConfig = useSelector((state) => state.config);
  const userData = useSelector((state) => state.data);

  const [activeTab, setActiveTab] = useState(formGroupManager.getDefaultTab(activeGroup));

  // Actualiza activeTab cuando activeGroup cambie
  useEffect(() => {
    setActiveTab(formGroupManager.getDefaultTab(activeGroup));
  }, [activeGroup]);

  // Actualiza config
  useEffect(() => {
    if (config) {
      const combinedConfig = { ...config, ...userConfig };
      setConfigNew(combinedConfig);
      if (JSON.stringify(userConfig) !== JSON.stringify(combinedConfig)) {
        dispatch(resetConfig(combinedConfig));
      }
    }
  }, [config, userConfig, dispatch, setConfigNew]);

  const getConfig = (key, source = 'config') => {
    if (source === 'config') {
      return userConfig[key] || config[key];
    }
  };

  if (configLoading) return <div>Loading...</div>;

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
              {FormComponent && <FormComponent data={getConfig(tab.toLowerCase(), 'config')} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Editor;
