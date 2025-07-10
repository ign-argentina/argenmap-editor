import { useState } from 'react';
import useFormEngine from '../hooks/useFormEngine';
import FormEngineContext from './FormEngineContext';
import language from '../static/language.json'

const FormEngineProvider = ({ children }) => {

  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);

  const formEngine = useFormEngine({ language, selectedLang });

  return (
    <FormEngineContext.Provider value={{ ...formEngine, selectedLang, setSelectedLang, language }}>
      {children}
    </FormEngineContext.Provider>
  );
};

export default FormEngineProvider