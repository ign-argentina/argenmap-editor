import axios from "axios";
import { API_URL } from "./index.js";

export const getUserList = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) { console.log("Error al obtener listado de usuarios " + error) }
}

/* 
DEPRECADO
export const getAUserList = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) { console.log("Error al obtener listado de usuarios " + error) }
} */

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
