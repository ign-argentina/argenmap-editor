import axios from "axios";
import { API_URL } from "../api/index.js";

export const getUserMetrics = async () => {
  const res = await axios.get(`${API_URL}/admin/user/metrics`,
    { withCredentials: true, validateStatus: () => true });
  return res.data
}

export const resetUserPassword = async (id) => {
  const res = await axios.post(`${API_URL}/admin/user/resetpassword`, {id: id},
    { withCredentials: true, validateStatus: () => true });
}

export const searchUser = async (search) => {
  const res = await axios.get(`${API_URL}/admin/user?search=${search}`, {
    withCredentials: true,
  });
  return res.data;
}

export const changeUserStatus = async (id) => {
  const res = await axios.post(`${API_URL}/admin/user`, { userId: id }, { withCredentials: true });
  return res.data;
}
