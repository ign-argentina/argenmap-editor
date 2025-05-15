// context/FormEngineProvider.js
import React, { useState } from 'react';
import useFormEngine from '../hooks/useFormEngine';
import FormEngineContext from './FormEngineContext';
import useConfig from '../hooks/useConfig';
import useLang from '../hooks/useLang';

const FormEngineProvider = ({ children }) => {
  const { config } = useConfig();
  const { language } = useLang();
  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);

  const formEngine = useFormEngine({ config, language, selectedLang });

  return (
    <FormEngineContext.Provider value={{ ...formEngine, selectedLang, setSelectedLang, language }}>
      {children}
    </FormEngineContext.Provider>
  );
};

export default FormEngineProvider;
