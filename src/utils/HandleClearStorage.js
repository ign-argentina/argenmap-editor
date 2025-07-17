import defaultConfig from '../static/config.json';

export function newViewer(setData, uploadSchema) {
  setData(defaultConfig);
  uploadSchema(defaultConfig);
}

export function setViewer(configJson, setData, uploadSchema) {
  setData(configJson);
  uploadSchema(configJson);
}