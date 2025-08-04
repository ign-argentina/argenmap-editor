import React from 'react';

const TranslateSchema = ({ schema, translations, defaultTranslations }) => {
  const applyTranslations = (schema, translations, parentKey = '', defaultTranslations = {}) => {
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

    const lookupKey = parentKey.split('.').pop();

    if (schema.type === 'object' && schema.properties) {
      translatedSchema.title =
        translations[lookupKey] ||
        defaultTranslations[lookupKey] ||
        schema.title ||
        capitalizeWords(lookupKey);

      translatedSchema.properties = Object.entries(schema.properties).reduce((acc, [key, value]) => {
        const newPath = parentKey ? `${parentKey}.${key}` : key;
        acc[key] = applyTranslations(value, translations, newPath, defaultTranslations);
        return acc;
      }, {});
    } else if (schema.type === 'array' && schema.items) {
      translatedSchema.title =
        translations[lookupKey] ||
        defaultTranslations[lookupKey] ||
        schema.title ||
        capitalizeWords(lookupKey);

      translatedSchema.items = applyTranslations(schema.items, translations, parentKey + '[]', defaultTranslations);

    } else if (schema.type === 'string' || schema.type === 'number') {
      translatedSchema.title =
        translations[lookupKey] ||
        defaultTranslations[lookupKey] ||
        schema.title ||
        capitalizeWords(lookupKey);
    }

    return translatedSchema;
  };


  return applyTranslations(schema, translations, '', defaultTranslations);
};

export default TranslateSchema;
