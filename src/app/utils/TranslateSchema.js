import React from 'react';

const TranslateSchema = ({ schema, translations, defaultTranslations }) => {
  const applyTranslations = (schema, translations, parentKey = '') => {
    if (!schema || typeof schema !== 'object') return schema;

    const capitalizeWords = (str) => {
      return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const translatedSchema = { ...schema };

    if (schema.type === 'object' && schema.properties) {
      translatedSchema.title =
        translations[parentKey] || 
        defaultTranslations[parentKey] || 
        schema.title || 
        capitalizeWords(parentKey);

      translatedSchema.properties = Object.entries(schema.properties).reduce((acc, [key, value]) => {
        acc[key] = applyTranslations(value, translations, key, defaultTranslations);
        return acc;
      }, {});
    } else if (schema.type === 'string') {
      translatedSchema.title =
        translations[parentKey] ||
        defaultTranslations[parentKey] ||
        schema.title ||
        capitalizeWords(parentKey);
    }
    
    return translatedSchema;
  };

  return applyTranslations(schema, translations, '', defaultTranslations);
};

export default TranslateSchema;
