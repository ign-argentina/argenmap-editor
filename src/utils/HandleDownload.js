const HandleDownload = ({ data, parsedDefaultData }) => {
  const ensureFieldsExist = (obj, reference) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }
    const result = { ...obj };
    Object.keys(reference).forEach((key) => {
      if (!(key in obj)) {
        // If the key doesnt exist in obj, add it empty 
        result[key] = reference[key] === 'string' ? '' : "";
      } else if (typeof reference[key] === 'object' && reference[key] !== null) {
        // If the key exists but is an object, we apply the function recursively again
        result[key] = ensureFieldsExist(obj[key], reference[key]);
      }
    });
    return result;
  };

  const downloadJson = (fileName) => {
    const date = new Date().toLocaleString();
    const completeData = ensureFieldsExist(data, parsedDefaultData);
    const fileData = JSON.stringify(completeData, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName} - ${date}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clear link element
  };

  return { downloadJson };
};

export default HandleDownload;