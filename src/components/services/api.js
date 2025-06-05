// src/services/api.js (or wherever your api.js is located)

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

export const orderApi = {
    getAllOrders: () => api.get('/orders/all'),
    getUserOrders: () => api.get('/orders'),
    getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),
    updateOrderStatus: (orderId, orderStatusID) => api.put(`/orders/${orderId}/status`, { orderStatusID }),
    cancelOrder: (orderId) => api.post(`/orders/${orderId}/cancel`),
    getOrderStatuses: () => api.get('/orders/statuses')
};

export const walletApi = {
    getBalance: () => api.get('/wallet/balance'),
    deposit: (amount) => api.post('/wallet/deposit', { amount }),
    // New endpoint for Super User to add funds to any user's wallet
    depositByAdmin: (userId, amount) => api.post(`/wallet/${userId}/deposit-by-admin`, { amount }),
    getTransactions: () => api.get('/wallet/transactions'),
    getDeposits: () => api.get('/wallet/transactions/deposits'),
    getPurchases: () => api.get('/wallet/transactions/purchases')
};

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
    removeCartItem: (cartItemID) => api.delete(`/cart/remove/${cartItemID}`),
    clearCart: () => api.post('/cart/clear'),
    checkout: () => api.post('/cart/checkout')
};

export const productApi = {
    getAllProducts: () => api.get('/products'),
    getProductById: (id) => api.get(`/products/${id}`),
    createProduct: (productData) => api.post('/products', productData),
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default api; // Ensure default export is still there if other files use it