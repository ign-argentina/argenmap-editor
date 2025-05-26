const API_URL = 'http://localhost:3001';

//VISORS
export async function getAllVisors() {
  const res = await fetch(`${API_URL}/visores`);
  if (!res.ok) throw new Error('Error al obtener visores');
  return res.json();
}

export async function saveVisor({ name, description, json, img }) {
  const res = await fetch(`${API_URL}/visores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, json, img }),
  });
  if (!res.ok) throw new Error('Error al guardar visor');
  return res.json();
}


export async function getVisorById(id) {
  const res = await fetch(`${API_URL}/visores/${id}`);
  if (!res.ok) throw new Error('Error al obtener visor por ID');
  return res.json();
}

//CONFIGS
export async function getConfigById(id) {
  const res = await fetch(`${API_URL}/configs/${id}`);
  if (!res.ok) throw new Error('Error al obtener configuración por ID');
  return res.json();
}

export async function getAllConfigs() {
  const res = await fetch(`${API_URL}/configs`);
  if (!res.ok) throw new Error('Error al obtener configs');
  return res.json();
}

export async function createConfig(jsonData) {
  const res = await fetch(`${API_URL}/configs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: jsonData }),
  });
  if (!res.ok) throw new Error('Error al crear config');
  return res.json();
}

export async function updateConfig(id, jsonData) {
  const res = await fetch(`${API_URL}/configs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ json: jsonData }),
  });
  if (!res.ok) throw new Error('Error al actualizar config');
  return res.json();
}

//Usar estas funciones en tu app
// import { createConfig } from './api/configApi';

// // Cuando quieras guardar
// async function guardarNuevoConfig(formularioJson) {
//   try {
//     const configGuardado = await createConfig(formularioJson);
//     console.log('Config guardado:', configGuardado);
//   } catch (error) {
//     console.error('Error al guardar config:', error);
//   }
// }


// import { updateConfig } from './api/configApi';

// // id es el ID del config que querés actualizar
// async function actualizarConfigExistente(id, formularioJson) {
//   try {
//     const configActualizado = await updateConfig(id, formularioJson);
//     console.log('Config actualizado:', configActualizado);
//   } catch (error) {
//     console.error('Error al actualizar config:', error);
//   }
// }


// import { getConfigs } from './api/configApi';

// async function cargarConfigsDisponibles() {
//   try {
//     const configs = await getConfigs();
//     console.log('Configs disponibles:', configs);
//     // Mostralos en un select, por ejemplo
//   } catch (error) {
//     console.error('Error al cargar configs:', error);
//   }
// }