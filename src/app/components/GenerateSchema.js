import React from 'react';

const GenerateSchema = ({ config }) => {
  const createSchema = (obj) => {
    if (Array.isArray(obj)) {
      return { type: 'array', items: createSchema(obj[0]) };
    } else if (typeof obj === 'object' && obj !== null) {
      const schema = { type: 'object', properties: {} };
      Object.keys(obj).forEach((key) => {
        if (key !== 'sectionIcon') {
          schema.properties[key] = createSchema(obj[key]);
        }
      });
      return schema;
    } else if (typeof obj === 'string' && /^#[0-9A-F]{6}$/i.test(obj)) {
      return { type: 'string', format: 'color' };
    } else {
      return { type: typeof obj };
    }
  };

  return createSchema(config);
};

export default GenerateSchema;
