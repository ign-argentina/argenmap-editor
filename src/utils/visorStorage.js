// visorStorage.js

/**
 * Obtiene el objeto visorMetadata del localStorage
 * @returns {Object} El objeto visorMetadata o {} si no existe o hay error
 */
export function getVisorMetadata() {
  try {
    const raw = localStorage.getItem('visorMetadata');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error leyendo visorMetadata:', e);
    return {};
  }
}

/**
 * Guarda el objeto visorMetadata completo en localStorage
 * @param {Object} metadata - Objeto completo a guardar
 */
export function setVisorMetadata(metadata) {
  try {
    localStorage.setItem('visorMetadata', JSON.stringify(metadata));
  } catch (e) {
    console.error('Error guardando visorMetadata:', e);
  }
}

/**
 * Actualiza el campo config.json dentro de visorMetadata
 * @param {Object} newData - Nuevo objeto de configuración
 */
export function updateVisorConfigJson(newData) {
  const metadata = getVisorMetadata();
  metadata.config = metadata.config || {};
  metadata.config.json = newData;
  setVisorMetadata(metadata);
}

/**
 * Obtiene el campo config.json de visorMetadata
 * @returns {Object} El objeto de configuración o {} si no existe
 */
export function getVisorConfigJson() {
  const metadata = getVisorMetadata();
  return metadata?.config?.json || {};
}
