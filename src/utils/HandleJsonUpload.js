export function handleJsonUpload(parsedData, setData, uploadSchema) {
  // Guardar parsedData como formDataDefault
  localStorage.setItem('formDataDefault', JSON.stringify(parsedData));

  try {
    const rawMetadata = localStorage.getItem('visorMetadata');
    const metadata = rawMetadata ? JSON.parse(rawMetadata) : {};

    metadata.config = metadata.config || {};
    metadata.config.json = parsedData;

    localStorage.setItem('visorMetadata', JSON.stringify(metadata));
  } catch (e) {
    console.error('Error actualizando visorMetadata:', e);
  }

  setData(parsedData);
  uploadSchema(parsedData);

  // showToast('JSON cargado exitosamente', 'success');
}

export function handleFileChange(event, setData, uploadSchema) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      handleJsonUpload(jsonData, setData, uploadSchema);
    };
    reader.readAsText(file);
  }
}
