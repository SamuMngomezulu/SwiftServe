import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import { login as authLogin, register as authRegister } from '../services/authService';

const AuthContext = createContext();

const ROLE_KEYS = {
    SUPER_USER: 'Super User',
    ADMIN: 'Admin',
    USER: 'User'
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    email: decoded.email,
                    userId: decoded.nameid,
                    roles: [decoded.role],  
                    name: decoded.name || ''
                });
            } catch (error) {
                console.error('Failed to decode token:', error);
                logout();
            }
        }
    }, [token]);

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
        if (result.success && result.token) {
            localStorage.setItem('token', result.token);
            setToken(result.token);
        }
        return result;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const hasRole = (role) =>
        user?.roles?.some(r => r.toLowerCase() === role.toLowerCase());

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout,
            hasRole,
            isAuthenticated: !!token,
            ROLE_KEYS
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
