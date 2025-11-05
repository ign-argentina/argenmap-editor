import { API_URL } from "./index.js";

export async function getConfigById(id) {
  const res = await fetch(`${API_URL}/configs/${id}`);
  if (!res.ok) throw new Error('Error al obtener configuración por ID');
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
