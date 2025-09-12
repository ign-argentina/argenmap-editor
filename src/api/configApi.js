import axios from "axios";

const mode = import.meta.env.VITE_MODE;

const config = {
  dev: {
    IP: import.meta.env.VITE_DEV_IP,
    API_PORT: import.meta.env.VITE_DEV_API_PORT
  },
  uat: {
    IP: import.meta.env.VITE_UAT_IP,
    API_PORT: import.meta.env.VITE_UAT_API_PORT
  },
  prod: {
    IP: import.meta.env.VITE_PROD_IP,
    API_PORT: import.meta.env.VITE_PROD_API_PORT
  },
};

let currentConfig

if (config[mode]) {
  currentConfig = config[mode]
} else {
  currentConfig = config['dev']
}

// SEGUIR
const API_URL = `http://${currentConfig.IP}:${currentConfig.API_PORT}`;

// ***** VISORS METHODS ***** 
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

export const createShareLink = async (vid, vgid, expirationTime) => {
  const result = await axios.post(`${API_URL}/visores/share`,
  { visorid: vid, visorgid: vgid, expires: expirationTime }, { withCredentials: true, validateStatus: () => true });
  return result.data
}
// ***** END VISORS METHODS ***** 


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

// ***** GROUPS METHODS ***** 
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

export const addUserToGroup = async (id, gid) => {
  const res = await axios.post(`${API_URL}/groups/management/`,
    { id, gid }, { withCredentials: true, validateStatus: () => true });
  return res.data
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
// ***** END GROUP METHODS *****

// ***** USER METHODS *****
export const userLogin = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    }, { withCredentials: true });

    return res
  } catch (error) {
    console.log(error)
  }
}

export const registerUser = async (name, lastname, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, {
      name,
      lastname,
      email,
      password
    }, { withCredentials: true });
    return res
  } catch (error) {

  }
}
export const userLogout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true, })
  } catch (error) {
    console.log(error)
  }
}

export const userCheckAuth = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/check`, {
      withCredentials: true,
    });
    return res
  } catch (error) {
  }
}

export const getUserList = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) { console.log("Error al obtener listado de usuarios " + error) }
}

export const updateUserData = async (name, lastname) => {
  try {
    const res = await axios.post(`${API_URL}/users/update`, {
      name,
      lastname
    }, { withCredentials: true });
    return res
  } catch (error) {

  }
}

export const updateUserPassword = async (rePassword) => {
  await axios.post(`${API_URL}/users/update`, {
    password: rePassword
  }, { withCredentials: true });
}

// ***** END USER METHODS *****