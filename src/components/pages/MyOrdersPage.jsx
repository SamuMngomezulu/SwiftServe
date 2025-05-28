import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/OrderService';
import OrderCard from '../cart/OrderCard';


const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { hasRole } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getOrders(hasRole('Admin'));
                setOrders(data);
            } catch (err) {
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [hasRole]);

    if (loading) return <div className="loading-spinner">Loading orders...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="orders-container">
            <h1>{hasRole('Admin') ? 'All Orders' : 'My Orders'}</h1>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>No orders found</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <OrderCard
                            key={order.orderID}
                            order={order}
                            isAdmin={hasRole('Admin')}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;