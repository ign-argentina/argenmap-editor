// Re-adds missing key fields in the stored data. 
// Keys disappear when the user leaves them empty
const MergeDataWithDefaults = (storedData, defaultData) => {
    for (const key in defaultData) {
      if (defaultData.hasOwnProperty(key)) {
        if (typeof defaultData[key] === 'object' && defaultData[key] !== null) {
          storedData[key] = storedData[key] || {};
          MergeDataWithDefaults(storedData[key], defaultData[key]);
        } else if (!storedData.hasOwnProperty(key)) {
          storedData[key] = "";
        }
      }
    }
    return storedData;
  };


export default MergeDataWithDefaults;