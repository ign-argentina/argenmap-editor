/* import { useState, useEffect } from 'react';
import GenerateSchema from '../utils/GenerateSchema';
import FilterEmptySections from '../utils/FilterEmptySections';
import TranslateSchema from '../utils/TranslateSchema';
import MergeDataWithDefaults from '../utils/MergeDataWithDefaults';

import defaultConfig from '../static/config.json'; // Kharta cuando corresponda
import language from '../static/language.json';

const useFormEngine = () => {
  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);

  const [data, setData] = useState({});
  // const [schema, setSchema] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);

  // const uploadSchema = (newData = data) => {
  //   if (!newData || !language) return;

  //   const generatedSchema = GenerateSchema({ data: newData });
  //   const filteredSchema = FilterEmptySections(generatedSchema);
  //   const translatedSchema = TranslateSchema({
  //     schema: filteredSchema,
  //     translations: language[selectedLang] || language['default'],
  //     defaultTranslations: language['default'] || {},
  //   });

  //   setSchema(translatedSchema);

  //   const sectionKeys = Object.keys(translatedSchema.properties || {});

  //   setSelectedSection((prev) => {
  //     if (!prev || !sectionKeys.includes(prev)) {
  //       return sectionKeys[0] || null;
  //     }
  //     return prev;
  //   });

  //   return translatedSchema;
  // };

  useEffect(() => {
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
    uploadSchema(finalData);
  }, []);

  useEffect(() => {
    if (data) {
      uploadSchema(data);
    }
  }, [selectedLang]);

  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    localStorage.setItem('selectedLang', newLang);
    uploadSchema(data);
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
  };
};

export default useFormEngine; */