import React from 'react';

const HandleDownload = ({ data, config }) => {
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

  const downloadJson = () => {
    const completeData = ensureFieldsExist(data, config);
    const fileData = JSON.stringify(completeData, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'config.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clear link element
  };
  
  return { downloadJson };
};

export default HandleDownload;





// a tener en cuenta y para terminar de hacer:
// se agrego un layout como ruta pero debe ser modificado para q solo sea un div
// agregar un boton en el sidebar que haga algo similar a la carga de json




// Con el problema de campos nuevos corregido pero no agregando los borrados

// import React from 'react';

// const HandleDownload = ({ data, config }) => {
//   const ensureFieldsExist = (obj, reference) => {
//     if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
//       return obj;
//     }
    
//     const result = { ...obj };

//     // Solo recorrer la referencia de config si el objeto original está vacío
//     if (Object.keys(obj).length === 0) {
//       Object.keys(reference).forEach((key) => {
//         if (!(key in obj)) {
//           // Si la clave no existe en obj, agregarla vacía
//           result[key] = reference[key] === 'string' ? '' : "";
//         } else if (typeof reference[key] === 'object' && reference[key] !== null) {
//           // Si la clave existe pero es un objeto, aplicar la función de manera recursiva
//           result[key] = ensureFieldsExist(obj[key], reference[key]);
//         }
//       });
//     }

//     return result;
//   };

//   const downloadJson = () => {
//     // No se debe usar la configuración anterior; solo necesitamos los campos que están en `data`.
//     const cleanedData = ensureFieldsExist(data, config);

//     // Generar el archivo JSON solo con los datos relevantes
//     const fileData = JSON.stringify(cleanedData, null, 2);
//     const blob = new Blob([fileData], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'config.json');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link); // Limpiar el elemento del enlace
//   };

//   return { downloadJson };
// };

// export default HandleDownload;
