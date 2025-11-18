import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { userLogout, userLogin, userCheckAuth } from '../api/auth';

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
      const res = await userLogin(email, password)

      if (res) {
        const userData = res.data
        updateAuth(true, userData.isag, userData.isa)
        updateUser(userData)
        showToast(`Hola ${userData.name}`, "success")
      } else {
        showToast("Credenciales Invalidas", "error")
      }

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
      if (res.data) {
        const storedUser = localStorage.getItem('user');

        // Si tenemos una auth valida
        updateAuth(true, res.data.isag, res.data.isa);

        // Si no esta guardado en el store o la auth falló, forzamos un relogueo
        if (!storedUser) {
          setAuth(false);
          return;
        }
        // Mantenemos los datos de usuario todo el tiempo que la auth sea valida
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } else {
        removeUser();
      }
    } catch (error) {
      // Si ocurre algun error, no removemos el usuario si ya tenemos algo guardado (Por esto fallaba antes)
      const storedUser = localStorage.getItem('user');
      if (error.response?.status === 401 || !storedUser) {
        removeUser();
      }
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
    const initializeUser = async () => {
      // Al entrar, primero tratamos de restaurar desde el localstorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
      // Despues validamos con el back
      await checkAuth();
    };

    initializeUser();
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