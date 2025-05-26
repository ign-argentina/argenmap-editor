import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [groupAdmin, setGroupAdmin] = useState(false)
    const [superAdmin, setSuperAdmin] = useState(false)

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null)
        setSuperAdmin(false)
        setGroupAdmin(false)
        localStorage.removeItem('user');
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout, setGroupAdmin, setSuperAdmin, groupAdmin, superAdmin }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext); // Hook