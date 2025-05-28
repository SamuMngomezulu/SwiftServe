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

// Add to api.js
export const walletApi = {
    getBalance: () => api.get('/wallet/balance'),
    deposit: (amount) => api.post('/wallet/deposit', { amount }),
    getTransactions: () => api.get('/wallet/transactions'),
    getDeposits: () => api.get('/wallet/transactions/deposits'),
    getPurchases: () => api.get('/wallet/transactions/purchases')
};

// Add to api.js
export const orderApi = {
    getUserOrders: () => api.get('/orders'),
    getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),
    updateOrderStatus: (orderId, statusId) => api.put(`/orders/${orderId}/status`, { statusId }),
    cancelOrder: (orderId) => api.post(`/orders/${orderId}/cancel`),
    getOrderStatuses: () => api.get('/orders/statuses'),

    // Admin endpoints
    getAllOrders: () => api.get('/orders/all'),
    searchOrders: (query) => api.get('/orders/search', { params: query })
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
    removeFromCart: (cartItemID) => api.delete(`/cart/remove/${cartItemID}`),
    clearCart: () => api.delete('/cart/clear'),
    checkout: (deliveryOption) => api.post('/checkout', { deliveryOption })
    
};
export default api;