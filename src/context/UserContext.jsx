import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { userLogout, userLogin, userCheckAuth } from '../api/configApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setAuth] = useState(false);
  const [groupAdmin, setGroupAdmin] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // loading flag

  const { showToast } = useToast();

  const login = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const res = await userLogin(email, password);
      const userData = res.data;
      updateAuth(true, userData.isag, userData.isa);
      updateUser(userData);
      showToast(`Hola ${userData.name}`, "success");
      return res.status;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      removeUser();
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await userLogout();
    } catch (err) {
      console.warn("Error al cerrar sesión en el backend", err);
    }
    removeUser();
    showToast(`Has cerrado sesión`, "success");
  };

  const checkAuth = async () => {
    setIsAuthLoading(true);
    try {
      const res = await userCheckAuth();
      const authFlags = res.data;
      updateAuth(true, authFlags.isag, authFlags.isa);
    } catch (error) {
      removeUser();
    } finally {
      setIsAuthLoading(false);
    }
  };

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
  };

  const removeUser = () => {
    setAuth(false);
    setGroupAdmin(false);
    setSuperAdmin(false);
    localStorage.removeItem('user');
    sessionStorage.removeItem("lastGroupPicked") // Por s desloguea desde visormanager
    setUser(null);
  };

  const updateAuth = (auth, isAdminGroup, isSuperAdmin) => {
    setAuth(auth);
    setGroupAdmin(isAdminGroup);
    setSuperAdmin(isSuperAdmin);
  };

  useEffect(() => {
    updateUser();
    checkAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        login,
        logout,
        groupAdmin,
        superAdmin,
        isAuthLoading,
        isAuthLoaded: !isAuthLoading,
        checkAuth,
        updateUser,
        setGroupAdmin,
        setSuperAdmin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
