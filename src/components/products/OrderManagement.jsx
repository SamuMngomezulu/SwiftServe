import React, { useEffect, useState } from 'react';
import {
    getOrders,
    getAllOrders,
    getOrderStatuses,
    updateOrderStatus,
    cancelOrder
} from '../services/OrderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Layout from '../layout/layout';
import OrderDetailsModal from '../pages/OrderDetailsModal';
import StatusUpdateModal from '../context/StatusUpdateModal';
import { useAuth, ROLE_KEYS } from '../context/AuthContext';

const OrderManagement = () => {
    const { hasRole } = useAuth();
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]); // Store all orders for filtering
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        dateFrom: '',
        dateTo: '',
        searchQuery: ''
    });
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const isSuperUser = hasRole(ROLE_KEYS.SUPER_USER);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [fetchedOrders, fetchedStatuses] = await Promise.all([
                    isSuperUser ? getAllOrders() : getOrders(),
                    getOrderStatuses()
                ]);

                setAllOrders(fetchedOrders); // Store all orders
                setOrders(fetchedOrders); // Initially display all orders
                setOrderStatuses(fetchedStatuses);
            } catch (err) {
                setError("Failed to fetch orders. Please try again later.");
                console.error("Error fetching initial data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [isSuperUser]);

    useEffect(() => {
        // Apply filters whenever filters or allOrders change
        applyFilters();
    }, [filters, allOrders]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        try {
            let filteredOrders = [...allOrders];

            // Apply status filter
            if (filters.status) {
                filteredOrders = filteredOrders.filter(
                    order => order.statusName === filters.status
                );
            }

            // Apply date range filter
            if (filters.dateFrom) {
                const fromDate = new Date(filters.dateFrom);
                filteredOrders = filteredOrders.filter(
                    order => new Date(order.orderDate) >= fromDate
                );
            }

            if (filters.dateTo) {
                const toDate = new Date(filters.dateTo);
                toDate.setHours(23, 59, 59, 999); // Include entire end day
                filteredOrders = filteredOrders.filter(
                    order => new Date(order.orderDate) <= toDate
                );
            }

            // Apply search query filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                filteredOrders = filteredOrders.filter(order =>
                    order.orderID.toString().includes(query) ||
                    (order.statusName && order.statusName.toLowerCase().includes(query)) ||
                    (order.deliveryOption && order.deliveryOption.toLowerCase().includes(query)) ||
                    (order.totalAmount && order.totalAmount.toString().includes(query))
                );
            }

            setOrders(filteredOrders);
        } catch (err) {
            setError("Failed to apply filters.");
            console.error("Error applying filters:", err);
        }
    };

    const resetFilters = () => {
        setFilters({
            status: '',
            dateFrom: '',
            dateTo: '',
            searchQuery: ''
        });
        setOrders(allOrders); // Reset to show all orders
    };

    const handleUpdateStatusClick = (order) => {
        setSelectedOrder(order);
        setShowUpdateStatusModal(true);
    };

    const handleStatusUpdate = async (newStatusId) => {
        try {
            setLoading(true);
            await updateOrderStatus(selectedOrder.orderID, newStatusId);
            const updatedOrders = isSuperUser ? await getAllOrders() : await getOrders();
            setAllOrders(updatedOrders);
            setOrders(updatedOrders);
            setShowUpdateStatusModal(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update order status.");
            console.error("Error updating status:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            setLoading(true);
            await cancelOrder(orderId);
            const updatedOrders = isSuperUser ? await getAllOrders() : await getOrders();
            setAllOrders(updatedOrders);
            setOrders(updatedOrders);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel order.");
            console.error("Error canceling order:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (orderId) => {
        setSelectedOrder(orders.find(o => o.orderID === orderId));
        setShowOrderDetailsModal(true);
    };

    if (loading) return <div className="loading">Loading orders...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <Layout>
            <div className="order-management-container">
                <h1>Order Management</h1>
               

                <div className="filters-section">
                    <div className="filter-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                            {orderStatuses.map(status => (
                                <option key={status.orderStatusID} value={status.statusName}>
                                    {status.statusName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="dateFrom">Date From:</label>
                        <input type="date" id="dateFrom" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="dateTo">Date To:</label>
                        <input type="date" id="dateTo" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-group search-group">
                        <label htmlFor="searchQuery">Search:</label>
                        <input
                            type="text"
                            id="searchQuery"
                            name="searchQuery"
                            placeholder="Order ID, Status, Delivery, or Amount"
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="filter-actions">
                        <button onClick={resetFilters} className="btn-secondary">Reset Filters</button>
                    </div>
                </div>

                <div className="order-list-container table-container">
                    <div className="table-header">
                        <div>Order ID</div>
                        <div>Order Date</div>
                        <div>Status</div>
                        <div>Total Amount</div>
                        <div>Delivery Option</div>
                        <div>Actions</div>
                    </div>
                    {orders.length === 0 ? (
                        <div className="no-results">No orders found matching your criteria.</div>
                    ) : (
                        orders.map(order => (
                            <div key={order.orderID} className="item-row">
                                <div>{order.orderID}</div>
                                <div>{formatDate(order.orderDate)}</div>
                                <div>{order.statusName}</div>
                                <div>{formatCurrency(order.totalAmount)}</div>
                                <div>{order.deliveryOption}</div>
                                <div className="order-actions">
                                    <button onClick={() => handleViewDetails(order.orderID)} className="btn-details">
                                        Details
                                    </button>

                                    {isSuperUser && (
                                        <button
                                            onClick={() => handleUpdateStatusClick(order)}
                                            className="btn-update-status"
                                            disabled={order.statusName === 'Canceled' || order.statusName === 'Delivered'}
                                        >
                                            Update Status
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleCancelOrder(order.orderID)}
                                        className="btn-cancel"
                                        disabled={order.statusName === 'Canceled' || order.statusName === 'Delivered'}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {showUpdateStatusModal && selectedOrder && (
                    <StatusUpdateModal
                        currentStatus={selectedOrder.orderStatusID}
                        statuses={orderStatuses}
                        onUpdate={handleStatusUpdate}
                        onClose={() => setShowUpdateStatusModal(false)}
                    />
                )}

                <OrderDetailsModal
                    orderId={selectedOrder?.orderID}
                    isOpen={showOrderDetailsModal}
                    onClose={() => setShowOrderDetailsModal(false)}
                />
            </div>
        </Layout>
    );
};

export default OrderManagement;