import { orderApi } from './api';

export const getOrders = async (isAdmin = false) => {
    try {
        const response = isAdmin
            ? await orderApi.getAllOrders()
            : await orderApi.getUserOrders();
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getOrderDetails = async (orderId) => {
    try {
        const response = await orderApi.getOrderDetails(orderId);
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, statusId) => {
    try {
        await orderApi.updateOrderStatus(orderId, statusId);
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

export const cancelOrder = async (orderId) => {
    try {
        await orderApi.cancelOrder(orderId);
    } catch (error) {
        console.error('Error canceling order:', error);
        throw error;
    }
};

export const getOrderStatuses = async () => {
    try {
        const response = await orderApi.getOrderStatuses();
        return response.data;
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        throw error;
    }
};

export const searchOrders = async (filters) => {
    try {
        const response = await orderApi.searchOrders(filters);
        return response.data;
    } catch (error) {
        console.error('Error searching orders:', error);
        throw error;
    }
};