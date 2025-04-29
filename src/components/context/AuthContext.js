import { createContext, useState, useContext } from 'react';
import { login as authLogin, register as authRegister } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const login = async (email, password) => {
        const result = await authLogin(email, password);
        if (result.success) {
            localStorage.setItem('token', result.token);
            setToken(result.token);
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message };
    };

    const register = async (userData) => {
        const result = await authRegister(userData);
        return result;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);