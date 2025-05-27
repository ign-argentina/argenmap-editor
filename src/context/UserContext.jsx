import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [isAuth, setAuth] = useState(false);
  const [groupAdmin, setGroupAdmin] = useState(false)
  const [superAdmin, setSuperAdmin] = useState(false)

  //Para evitar parpadeos o malas renderizaciones.
  const [loadingUser, setLoadingUser] = useState(true);


  const login = async (email, password) => {
    setLoadingUser(true);
    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email,
        password
      }, { withCredentials: true });

      const userData = res.data;
      console.log(userData)
      setAuth(true)
      localStorage.setItem('user', JSON.stringify(userData));
      setGroupAdmin(userData.isag);
      setSuperAdmin(userData.isa);
      checkAuth();
      return res.status;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      setAuth(false);
      setGroupAdmin(false);
      setSuperAdmin(false);
    } finally {
      setLoadingUser(false);
    }
  };

  const logout = async () => {
    await axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true });
    setAuth(false);
    setGroupAdmin(false);
    setSuperAdmin(false);
    setLoadingUser(false);
    localStorage.removeItem('user');
  };

  const checkAuth = async () => {
    setLoadingUser(true);
    try {
      const res = await axios.get(`http://localhost:3001/auth/check`, {
        withCredentials: true,
      });
      const authFlags = res.data;
      setAuth(true)
      setGroupAdmin(authFlags.isag);
      setSuperAdmin(authFlags.isa);
    } catch (error) {
      setAuth(false);
      setGroupAdmin(false);
      setSuperAdmin(false);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ isAuth, login, logout, setGroupAdmin, setSuperAdmin, groupAdmin, superAdmin, loadingUser, checkAuth, user }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext); // Hook