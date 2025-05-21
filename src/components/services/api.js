import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5247/api',
   
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401) {
    
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});


export const cartApi = {
    getCart: () => api.get('/cart'),
    getCartItems: () => api.get('/cart/items'),
    getCartTotal: () => api.get('/cart/total'),
    addToCart: (request) => api.post('/cart/add', {
        ProductID: request.productID,
        Quantity: request.quantity
    }),
    updateCartItem: (cartItemID, request) => api.put(`/cart/update/${cartItemID}`, {
        Quantity: request.quantity
    }),
    removeFromCart: (cartItemID) => api.delete(`/cart/remove/${cartItemID}`),
    clearCart: () => api.delete('/cart/clear'),
    checkout: () => api.post('/cart/checkout')
    
};
export default api;