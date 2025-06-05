// src/api/userService.js
import api from './api';
import { useAuth } from '../context/AuthContext';

const userService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch users',
                status: error.response?.status
            };
        }
    },

    getUserById: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch user',
                status: error.response?.status
            };
        }
    },

    createUser: async (userData) => {
        try {
            const response = await api.post('/users', userData);
            return {
                success: true,
                data: response.data,
                message: 'User created successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create user',
                status: error.response?.status
            };
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return {
                success: true,
                data: response.data,
                message: 'User updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update user',
                status: error.response?.status
            };
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return {
                success: true,
                message: 'User deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete user',
                status: error.response?.status
            };
        }
    },

    updateUserRole: async (userId, roleId) => {
        try {
            const response = await api.put(`/users/${userId}/role`, { roleID: roleId });
            return {
                success: true,
                message: 'User role updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update user role',
                status: error.response?.status
            };
        }
    }
};

export default userService;