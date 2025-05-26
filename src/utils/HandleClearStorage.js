export function handleClearStorage(setData, uploadSchema) {
  localStorage.removeItem("visorMetadata");
  const defaultData = localStorage.getItem('formDataDefault');
  const parsedDefaultData = JSON.parse(defaultData);
  setData(parsedDefaultData);
  uploadSchema(parsedDefaultData);
}
