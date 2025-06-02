import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '../services/OrderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import '../styles/orderDetails.css';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await getOrderDetails(orderId);
                setOrder(data);
            } catch (err) {
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) return <div className="loading-spinner">Loading order details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!order) return <div className="error-message">Order not found</div>;

    return (
        <div className="order-details-container">
            <div className="order-header">
                <h1>Order Details</h1>
                <button
                    className="back-button secondary"
                    onClick={() => navigate(-1)}
                >
                    Back to Orders
                </button>
            </div>

            <div className="order-summary">
                <div className="summary-item">
                    <span>Order ID:</span>
                    <span>{order.orderID}</span>
                </div>
                <div className="summary-item">
                    <span>Date:</span>
                    <span>{formatDate(order.orderDate)}</span>
                </div>
                <div className="summary-item">
                    <span>Status:</span>
                    <span className={`status-badge ${order.statusName.toLowerCase()}`}>
                        {order.statusName}
                    </span>
                </div>
                <div className="summary-item">
                    <span>Total:</span>
                    <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
                </div>
            </div>

            <div className="order-items">
                <h2>Items</h2>
                <div className="items-table">
                    <div className="table-header">
                        <div className="header-cell">Product</div>
                        <div className="header-cell">Price</div>
                        <div className="header-cell">Quantity</div>
                        <div className="header-cell">Subtotal</div>
                    </div>

                    {order.items.map(item => (
                        <div key={item.productID} className="item-row">
                            <div className="cell product-cell">
                                <img
                                    src={item.imageURL || '/placeholder-product.jpg'}
                                    alt={item.productName}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <h3>{item.productName}</h3>
                                </div>
                            </div>
                            <div className="cell">{formatCurrency(item.productPrice)}</div>
                            <div className="cell">{item.quantity}</div>
                            <div className="cell">{formatCurrency(item.productPrice * item.quantity)}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-actions">
                {order.statusName === 'Pending' && (
                    <button className="danger">
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsPage;
