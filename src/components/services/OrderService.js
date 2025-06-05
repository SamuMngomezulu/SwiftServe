import { orderApi } from './api';

export const getOrders = async () => {
    try {
        const response = await orderApi.getUserOrders();
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

export const updateOrderStatus = async (orderId, orderStatusID) => {
    try {
        await orderApi.updateOrderStatus(orderId, orderStatusID);
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


export const getAllOrders = async () => {
    try {
        const response = await orderApi.getAllOrders();
        return response.data;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export const searchOrders = async (filters) => {
    try {
        const allOrders = await getAllOrders();

        return allOrders.filter(order => {
            const matchesStatus =
                !filters.status ||
                order.statusName === filters.status;

            const orderDate = new Date(order.orderDate);
            const matchesDateFrom =
                !filters.dateFrom ||
                orderDate >= new Date(filters.dateFrom);

            const matchesDateTo =
                !filters.dateTo ||
                orderDate <= new Date(filters.dateTo + 'T23:59:59');

            const matchesSearch =
                !filters.searchQuery ||
                order.orderID.toString().includes(filters.searchQuery) ||
                order.statusName.toLowerCase().includes(filters.searchQuery.toLowerCase());

            return matchesStatus && matchesDateFrom && matchesDateTo && matchesSearch;
        });
    } catch (error) {
        console.error('Error filtering orders:', error);
        throw new Error("Failed to filter orders. Please check your inputs.");
    }
};
