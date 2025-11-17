import axios from "axios";
import { API_URL } from "./index.js";

export async function getAllVisors() {
  const res = await fetch(`${API_URL}/visores`);
  if (!res.ok) throw new Error('Error al obtener visores');
  return res.json();
}

export const createVisor = async (groupid, name, description, configJson, img, isPublic = false) => {
  const res = await axios.post(`${API_URL}/visores`,
    { groupid, name, description, configJson, img, isPublic }, { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const updateVisor = async (visorid, visorgid, name, description, configid, configjson, imageData) => {
  const res = await axios.put(`${API_URL}/visores`,
    { visorid, visorgid, name, description, configid, configjson, imageData }, { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const deleteVisor = async (visorid, visorgid) => {
  const res = await axios.delete(`${API_URL}/visores`, {
    data: { visorid, visorgid },
    withCredentials: true,
    validateStatus: () => true,
  });
  return res.data;
};

export const changePublicStatus = async (visorid, visorgid) => {
  const res = await axios.post(`${API_URL}/visores/publish`,
    { visorid, visorgid }, { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const changeIsSharedStatus = async (visorid, visorgid) => {
  const res = await axios.post(`${API_URL}/visores/share/status`,
    { visorid, visorgid }, { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const getPublicVisors = async () => {
  const res = await axios.get(`${API_URL}/visores/publics`,
    { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const getMyVisors = async () => {
  const res = await axios.get(`${API_URL}/visores/myvisors`,
    { withCredentials: true, validateStatus: () => true });
  return res.data
}

export async function getVisorById(id) {
  const res = await fetch(`${API_URL}/visores/${id}`);
  if (!res.ok) throw new Error('Error al obtener visor por ID');
  return res.json();
}

export const getGroupVisors = async (groupId) => {
  const res = await axios.get(`${API_URL}/visores/group/${groupId}`, {
    withCredentials: true,
    validateStatus: () => true
  });
  return res.data;
};

export const createShareLink = async (vid, vgid, expirationTime, api) => {
  const result = await axios.post(`${API_URL}/visores/share`,
    { visorid: vid, visorgid: vgid, expires: expirationTime, apiKey: api }, { withCredentials: true, validateStatus: () => true });
  return result.data
}

export const getDeletedViewers = async (groupId) => {
  const res = await axios.get(`${API_URL}/visores/group/deleted/${groupId}`, {
    withCredentials: true,
    validateStatus: () => true
  });
  return res.data;
}

export const restoreViewer = async (viewerid, groupid) => {
  const result = await axios.put(`${API_URL}/visores/group/restoreviewer`,
    { viewerid: viewerid, groupid: groupid }, { withCredentials: true, validateStatus: () => true });
  return result.data
}