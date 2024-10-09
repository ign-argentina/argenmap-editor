import { useEffect, useState } from 'react';
import useConfig from './useConfig';
import useLang from './useLang';
import TranslateSchema from '../utils/TranslateSchema';
import GenerateSchema from '../utils/GenerateSchema';
import FilterEmptySections from '../utils/FilterEmptySections';

export default function useData() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const { lang: language, loading: langLoading, error: langError } = useLang();
  const [data, setData] = useState({});
  const [schema, setSchema] = useState({});
  const savedLanguage = localStorage.getItem('selectedLang') || 'es';
  const [selectedLang, setSelectedLang] = useState(savedLanguage);

  // Función para generar y traducir el esquema
  const uploadData = (currentData) => {
    if (currentData && language) {
      const generatedSchema = GenerateSchema({ data: currentData });
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
    }
  };

  // Efecto para cargar los datos cuando `config` y `language` estén listos
  useEffect(() => {
    if (config && language) {
      setData(config);
      uploadData(config);
    }
  }, [config, language, selectedLang]);

  // Retornar todos los estados y funciones necesarias
  return { schema, data, config, language, selectedLang};
}
