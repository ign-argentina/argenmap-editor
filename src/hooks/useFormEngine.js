import { useState, useEffect } from 'react';
import GenerateSchema from '../utils/GenerateSchema';
import FilterEmptySections from '../utils/FilterEmptySections';
import TranslateSchema from '../utils/TranslateSchema';
import MergeDataWithDefaults from '../utils/MergeDataWithDefaults';
import useLang from './useLang';

import defaultConfig from '../config/config.json' // Kharta cuando corresponda

const useFormEngine = () => {
  const { language, loading: langLoading, error: langError } = useLang();

  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);

  const [data, setData] = useState({});
  const [schema, setSchema] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);

  // Esta función genera y traduce el schema
  const uploadSchema = (newData = data) => {
    if (!newData || !language) return;

    const generatedSchema = GenerateSchema({ data: newData });
    const filteredSchema = FilterEmptySections(generatedSchema);
    const translatedSchema = TranslateSchema({
      schema: filteredSchema,
      translations: language[selectedLang] || language['default'],
      defaultTranslations: language['default'] || {},
    });

    setSchema(translatedSchema);

    const sectionKeys = Object.keys(translatedSchema.properties || {});
    if (sectionKeys.length > 0) {
      setSelectedSection(sectionKeys[0]);
    } else {
      setSelectedSection(null);
    }

    return translatedSchema;
  };

  // Inicialización de datos desde config o localStorage
  useEffect(() => {
    if (!language) return;

    let storedData = null;
    try {
      const storedJSON = localStorage.getItem('visorMetadata');
      const parsed = storedJSON ? JSON.parse(storedJSON) : null;
      if (parsed?.config?.json) {
        storedData = JSON.stringify(parsed.config.json);
      }
    } catch (e) {
      console.warn('Error parsing visorMetadata:', e);
    }

    let parsedStoredData = {};
    try {
      parsedStoredData = storedData ? JSON.parse(storedData) : {};
    } catch (e) {
      console.warn('Error parsing storedData:', e);
    }

    let parsedDefaultData = {};
    try {
      const defaultData = localStorage.getItem('formDataDefault');
      parsedDefaultData = defaultData ? JSON.parse(defaultData) : {};
    } catch (e) {
      console.warn('Error parsing formDataDefault:', e);
    }

    const mergedData = MergeDataWithDefaults(parsedStoredData, parsedDefaultData);
    const finalData = storedData ? mergedData : defaultConfig;

    if (!storedData) {
      localStorage.setItem('formDataDefault', JSON.stringify(defaultConfig));
    }

    setData(finalData);
    console.log(finalData)
    uploadSchema(finalData);
  }, [language]);


  // Se ejecuta cada vez que cambia el idioma retraduciendo el formulario.
  useEffect(() => {
    if (language && data) {
      uploadSchema(data);
    }
  }, [selectedLang]);


  // Cambio de idioma persistente
  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    localStorage.setItem('selectedLang', newLang);
    uploadSchema(data); // Se actualiza el schema traducido al nuevo idioma
  };

  return {
    data,
    setData,
    schema,
    selectedSection,
    setSelectedSection,
    uploadSchema,
    selectedLang,
    setSelectedLang: handleLanguageChange,
    langLoading,
    langError
  };
};

export default useFormEngine;
