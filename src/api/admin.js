import axios from "axios";
import { API_URL } from "../api/index.js";

export const getGroupsMetrics = async () => {
  const res = await axios.get(`${API_URL}/admin/metrics/groups`,
    { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const getUserMetrics = async () => {
  const res = await axios.get(`${API_URL}/admin/metrics/users`,
    { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const resetUserPassword = async (id) => {
  const res = await axios.post(`${API_URL}/admin/user/resetpassword`, { id: id },
    { withCredentials: true, validateStatus: () => true });
}

export const searchUser = async (search) => {
  const res = await axios.get(`${API_URL}/admin/user?search=${search}`, {
    withCredentials: true,
  });
  return res.data;
}

export const searchGroup = async (search) => {
  const res = await axios.get(`${API_URL}/admin/group?search=${search}`, {
    withCredentials: true,
  });
  return res.data;
}

export const changeUserStatus = async (id) => {
  const res = await axios.post(`${API_URL}/admin/user`, { userId: id }, { withCredentials: true });
  return res.data;
}

export const getAGroupList = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/groups`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    console.error("Error al obtener grupos:", error);
  }
}