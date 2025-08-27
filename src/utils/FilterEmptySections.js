// If a section has no elements, then it is not displayed.
const FilterEmptySections = (schema) => {
  if (!schema || typeof schema !== 'object') return schema;
  const filteredProperties = Object.entries(schema.properties || {}).reduce((acc, [key, value]) => {
    const hasValidProperties = Object.keys(value.properties || {}).length > 0;

    if (hasValidProperties || value.sectionIcon) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return { ...schema, properties: filteredProperties };
};

export default FilterEmptySections;