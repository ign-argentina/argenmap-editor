import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import axios from 'axios';
import { userLogout, userLogin, userCheckAuth } from '../api/configApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [isAuth, setAuth] = useState(false);
  const [groupAdmin, setGroupAdmin] = useState(false)
  const [superAdmin, setSuperAdmin] = useState(false)

  //Para evitar parpadeos o malas renderizaciones.
  const [loadingUser, setLoadingUser] = useState(true);

  const { showToast } = useToast()

  const login = async (email, password) => {
    setLoadingUser(true);
    try {
      const res = await userLogin(email, password)
      const userData = res.data;
      updateAuth(true, userData.isag, userData.isa)
      updateUser(userData)
      checkAuth();
      showToast(`Hola ${res.data.name}`, "success");
      return res.status;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      removeUser()
    } finally {
      setLoadingUser(false);
    }
  };

  const logout = async () => {
    userLogout()
    removeUser();
    showToast(`Has cerrado sesión`, "success");
  };

  const checkAuth = async () => {
    setLoadingUser(true);

    try {
      const res = await userCheckAuth()
      const authFlags = res.data;
      updateAuth(true, authFlags.isag, authFlags.isa)
    } catch (error) {
      removeUser()
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    updateUser();
    checkAuth();
  }, []);

  const updateUser = (userData = null) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    }
  }

  const removeUser = () => {
    setAuth(false);
    setGroupAdmin(false);
    setSuperAdmin(false);
    localStorage.removeItem('user');
    setUser(null)
  }

  const updateAuth = (auth, isAdminGroup, isSuperAdmin) => {
    setAuth(auth)
    setGroupAdmin(isAdminGroup);
    setSuperAdmin(isSuperAdmin);
  }

  return (
    <UserContext.Provider value={{ isAuth, login, logout, setGroupAdmin, setSuperAdmin, groupAdmin, superAdmin, loadingUser, checkAuth, user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext); // Hook