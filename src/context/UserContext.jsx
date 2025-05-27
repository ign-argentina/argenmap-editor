import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [groupAdmin, setGroupAdmin] = useState(false)
    const [superAdmin, setSuperAdmin] = useState(false)

    //Para evitar parpadeos o malas renderizaciones.
    const [loadingUser, setLoadingUser] = useState(true); // NUEVO


    const login = (userData) => {
        setUser(userData);
        setGroupAdmin(userData.isag);
        setSuperAdmin(userData.isa);
        setLoadingUser(false);
    };

    const logout = async () => {
        await axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true });
        setUser(null);
        setGroupAdmin(false);
        setSuperAdmin(false);
        setLoadingUser(false);
    };

    const checkAuth = async () => {
        setLoadingUser(true);
        try {
            const res = await axios.get(`http://localhost:3001/auth/check`, {
                withCredentials: true,
            });
            const userData = res.data;
            setUser(userData);
            setGroupAdmin(userData.isag);
            setSuperAdmin(userData.isa);
        } catch (error) {
            setUser(null);
            setGroupAdmin(false);
            setSuperAdmin(false);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout, setGroupAdmin, setSuperAdmin, groupAdmin, superAdmin, loadingUser, checkAuth }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext); // Hook