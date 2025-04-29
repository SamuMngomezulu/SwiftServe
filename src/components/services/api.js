import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5247/api', // Your backend URL from launchSettings.json
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;