const HandleDownload = ({ data, parsedDefaultData }) => {
  const ensureFieldsExist = (obj, reference) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }
    const result = { ...obj };
    Object.keys(reference).forEach((key) => {
      if (!(key in obj)) {
        result[key] = reference[key] === 'string' ? '' : "";
      } else if (typeof reference[key] === 'object' && reference[key] !== null) {
        result[key] = ensureFieldsExist(obj[key], reference[key]);
      }
    });
    return result;
  };

  const formatDateForFilename = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
  };

  const downloadJson = (fileName = "Visor") => {
    const date = new Date();
    const formattedDate = formatDateForFilename(date);
    const completeData = ensureFieldsExist(data, parsedDefaultData);
    const fileData = JSON.stringify(completeData, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName} - ${formattedDate}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { downloadJson };
};
export default HandleDownload;