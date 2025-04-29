import api from './api';

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return {
            success: true,
            token: response.data.token,
            message: response.data.message || 'Login successful'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.errorMessage || 'Login failed. Please try again.'
        };
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return {
            success: true,
            message: 'Registration successful! Please login.',
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Registration failed. Please try again.'
        };
    }
};