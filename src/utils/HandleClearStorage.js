import defaultConfig from '../static/config.json';

export function handleClearStorage(setData, uploadSchema) {
  setData(defaultConfig);
  uploadSchema(defaultConfig);
}

export function handleSetConfig(configJson, setData, uploadSchema) {
  setData(configJson);
  uploadSchema(configJson);
}