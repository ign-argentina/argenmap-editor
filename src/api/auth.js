import axios from "axios";
import { API_URL } from "./index.js";

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
  const res = await axios.post(`${API_URL}/auth/register`, {
    name,
    lastname,
    email,
    password
  }, { withCredentials: true });

  return res.data
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
