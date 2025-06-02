import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getOrders,
    getOrderStatuses,
    searchOrders,
    updateOrderStatus,
    cancelOrder
} from '../services/OrderService';
import OrderCard from '../cart/OrderCard';
import StatusUpdateModal from '../context/StatusUpdateModel';
import ConfirmationModal from '../context/ConfirmationModal';

const OrderManagementPage = () => {
    const { hasRole } = useAuth();
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        dateFrom: '',
        dateTo: '',
        searchQuery: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ordersData, statusesData] = await Promise.all([
                    getOrders(true),
                    getOrderStatuses()
                ]);
                setOrders(ordersData);
                setStatuses(statusesData);
            } catch (err) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async () => {
        try {
            setLoading(true);
            const results = await searchOrders(filters);
            setOrders(results);
        } catch (err) {
            setError(err.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        setFilters({
            status: '',
            dateFrom: '',
            dateTo: '',
            searchQuery: ''
        });
        const data = await getOrders(true);
        setOrders(data);
    };

    const handleStatusUpdate = async (statusId) => {
        try {
            setLoading(true);
            await updateOrderStatus(selectedOrder.orderID, statusId);
            const updatedOrders = await getOrders(true);
            setOrders(updatedOrders);
            setShowStatusModal(false);
        } catch (err) {
            setError(err.message || 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        try {
            setLoading(true);
            await cancelOrder(selectedOrder.orderID);
            const updatedOrders = await getOrders(true);
            setOrders(updatedOrders);
            setShowCancelModal(false);
        } catch (err) {
            setError(err.message || 'Failed to cancel order');
        } finally {
            setLoading(false);
        }
    };

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setShowStatusModal(true);
    };

    const openCancelModal = (order) => {
        setSelectedOrder(order);
        setShowCancelModal(true);
    };

    if (loading) return <div className="loading-spinner">Loading orders...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="order-management-container">
            <h1>Order Management</h1>

            <div className="order-filters">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                        <option key={status.orderStatusID} value={status.orderStatusID}>
                            {status.statusName}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    placeholder="From date"
                />

                <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    placeholder="To date"
                />

                <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    placeholder="Search orders..."
                />

                <button onClick={handleSearch}>Search</button>
                <button onClick={handleReset}>Reset</button>
            </div>

            <div className="orders-list">
                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <p>No orders match your search criteria</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <OrderCard
                            key={order.orderID}
                            order={order}
                            isAdmin={true}
                            onStatusUpdate={() => openStatusModal(order)}
                            onCancelOrder={() => openCancelModal(order)}
                        />
                    ))
                )}
            </div>

            {showStatusModal && (
                <StatusUpdateModal
                    currentStatus={selectedOrder?.statusName}
                    statuses={statuses}
                    onUpdate={handleStatusUpdate}
                    onClose={() => setShowStatusModal(false)}
                />
            )}

            {showCancelModal && (
                <ConfirmationModal
                    title="Confirm Cancellation"
                    message={`Are you sure you want to cancel order #${selectedOrder?.orderID}?`}
                    onConfirm={handleCancelOrder}
                    onCancel={() => setShowCancelModal(false)}
                />
            )}
        </div>
    );
};

export default OrderManagementPage;