function OrderJsonUsingSchema(data, jsonSchema) {
    function recurse(data, jsonSchema) {
        const levelCopy = {};
        for (const [key, value] of Object.entries(jsonSchema)) {
            switch (jsonSchema[key].type) {
                case 'object':
                    levelCopy[key] = recurse(data[key], jsonSchema[key].properties);
                    break;
                case 'array':
                    if (data[key]) {
                        levelCopy[key] = data[key].map((item) => {
                            // array object
                            if (jsonSchema[key].items.type === 'object') {
                                return recurse(item, jsonSchema[key].items.properties);
                            }
                            // array strings
                            else if (jsonSchema[key].items.type === 'string') {
                                return item;
                            }
                        });
                    }
                    break;
                default:
                    if (data[key]) {
                        levelCopy[key] = data[key];
                    }
            }
        }
        return levelCopy;
    }
    return recurse(data, jsonSchema.properties);
}
