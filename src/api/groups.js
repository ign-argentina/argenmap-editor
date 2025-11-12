import axios from "axios";
import { API_URL } from "./index.js";

export const createGroup = async (name, description, img = null, email) => {
  try {
    const res = await axios.post(`${API_URL}/groups/`,
      { name, description, img, email },
      { withCredentials: true, validateStatus: () => true }
    );
    return res.data; // Devuelve { success: true, data: { gid: ... } }
  } catch (error) {
    console.error("Error al crear grupo:", error);
    throw error;
  }
};

export const getGrupos = async () => {
  try {
    const res = await axios.get(`${API_URL}/groups/`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    console.error("Error al obtener grupos:", error);
  }
};

export const getManageGroups = async () => {
  try {
    const res = await axios.get(`${API_URL}/groups/management`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    console.error("Error al obtener grupos:", error);
  }
};

export const getGroup = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/groups/management/${id}`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) { console.log("Error al obtener grupos", error) }
}

export const getGroupUserList = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/groups/management/userlist/${id}`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) { console.log("Error al obtener listado de usuarios " + error) }
}

export const deleteUserFromGroup = async (deleteUserId, gid) => {
  const res = await axios.delete(`${API_URL}/groups/management`, {
    data: { deleteUserId, gid },
    withCredentials: true,
    validateStatus: () => true,
  });
  return res.data
}

export const updateUserRolFromGroup = async (userId, rolId, groupId) => {
  const res = await axios.put(`${API_URL}/groups/management`,
    { userId, rolId, groupId }, { withCredentials: true, validateStatus: () => true });

  return res.data
}

export const getRoles = async () => {
  const res = await axios.get(`${API_URL}/roles/`, {
    withCredentials: true,
    validateStatus: () => true,
  });
  return res.data
}

export const updateGroup = async (name, description, img, gid) => {
  const res = await axios.put(`${API_URL}/groups`,
    { name, description, img, gid }, { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const deleteGroup = async (gid) => {
  const res = await axios.delete(`${API_URL}/groups`, {
    data: { gid },
    withCredentials: true,
    validateStatus: () => true,
  });
  return res.data
}

export const getPermissions = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/groups/rol/${id}`, {
      withCredentials: true,
    });
    return res.data.data
  } catch (error) { console.log("Error al obtener permisos " + error) }
}