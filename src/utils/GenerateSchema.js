const GenerateSchema = (data) => {
  const detectType = (value) => {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    if (typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value)) return 'color';
    return typeof value;
  };

  const createSchema = (obj) => {
    const type = detectType(obj);

    if (type === 'array') {
      return {
        type: 'array',
        items: obj.length > 0 ? createSchema(obj[0]) : {}
      };
    }

    if (type === 'object') {
      const schema = {
        type: 'object',
        properties: {}
      };

      for (const key in obj) {
        if (obj[key] !== undefined) {
          schema.properties[key] = createSchema(obj[key]);
        }
      }

      return schema;
    }

    if (type === 'color') {
      return { type: 'string', format: 'color' };
    }

    return { type };
  };

  return {
    type: 'object',
    properties: createSchema(data).properties
  };
};

export default GenerateSchema;
