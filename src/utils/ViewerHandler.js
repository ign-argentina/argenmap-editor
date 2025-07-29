/**
 * Nombre base por defecto para el archivo descargado.
 * @constant
 * @type {string}
 */
const BASE_FILE_NAME = "Visor"

/**
 * Descarga un archivo JSON con nombre y contenido definidos.
 * Completa los campos faltantes a partir de una referencia base (si se provee),
 * y garantiza el orden de las propiedades según dicha referencia.
 *
 * @param {Object} viewer - El objeto JSON principal que se va a descargar.
 * @param {Object|null} baseViewer - Objeto de referencia que define la estructura y orden. Opcional.
 * @param {string|null} name - Nombre base del archivo. Si no se pasa, se usa `BASE_FILE_NAME`.
 */
export const downloadViewer = (viewer, baseViewer = null, name = null) => {
  if (baseViewer){
    viewer = mergeViewer(viewer, baseViewer)
  }
  const date = formatDateForFilename(new Date());
  download(viewer, name ? name : BASE_FILE_NAME, date)
}

/**
 * Fusiona un objeto `viewer` con una estructura base (`baseViewer`),
 * asegurando que:
 * - Todas las claves definidas en `baseViewer` existan (rellenando valores vacíos si es necesario).
 * - El orden de las propiedades coincida con la estructura original (`baseViewer`).
 *
 * @param {Object} viewer - Objeto incompleto o desestructurado.
 * @param {Object|null} baseViewer - Objeto de referencia que define la estructura completa esperada.
 * @returns {Object} - Objeto resultante con claves restauradas y ordenadas.
 */
export const mergeViewer = (viewer, baseViewer) => {
  return orderObjectByReference(ensureFieldsExist(viewer, baseViewer), baseViewer)
}

/**
 * Mergea la referencia con el objeto.
 * JsonForms puede eliminar claves con valores vacíos, lo que rompe la estructura.
 * Esta función asegura que el objeto final contenga todas las claves de la referencia,
 * asignando valores vacíos ("") donde falten.
 *
 * @param {Object} obj - Objeto principal recibido (incompleto).
 * @param {Object} reference - Objeto de referencia con estructura completa.
 * @returns {Object} - Objeto con todos los campos restaurados.
 */
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

/**
 * Ordena las propiedades de un objeto según una referencia dada,
 * garantizando que el resultado tenga la misma estructura y orden de claves.
 *
 * @param {Object} obj - Objeto que se desea ordenar.
 * @param {Object} reference - Objeto cuya estructura y orden se desea replicar.
 * @returns {Object} - Objeto con las claves ordenadas según la referencia.
 */
const orderObjectByReference = (obj, reference) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(item => orderObjectByReference(item, reference));

  const ordered = {};
  for (const key of Object.keys(reference)) {
    if (key in obj) {
      ordered[key] = orderObjectByReference(obj[key], reference[key]);
    } else {
      ordered[key] = reference[key];
    }
  }
  return ordered;
};

/**
 * Genera una cadena de fecha y hora en formato seguro para nombre de archivo.
 * Ejemplo: "23-07-2025_16-30-45"
 *
 * @param {Date} date - Objeto de fecha a formatear.
 * @returns {string} - Fecha formateada como string.
 */
const formatDateForFilename = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
};

/**
 * Descarga un archivo `.json` en el navegador con nombre y contenido especificado.
 *
 * @param {Object} file - Contenido del archivo a descargar (JSON ya estructurado).
 * @param {string} fileName - Nombre base del archivo.
 * @param {string} date - Fecha formateada para incluir en el nombre del archivo.
 */
const download = (file, fileName, date = "") => {
  const fileData = JSON.stringify(file, null, 2);
  const blob = new Blob([fileData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName} - ${date}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};