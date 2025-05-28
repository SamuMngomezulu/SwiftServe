import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../styles/orderConfirmation.css';

const OrderConfirmationPage = () => {
    const { clearCart } = useCart();
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear cart if coming from successful checkout
        if (state?.orderSuccess) {
            clearCart();
        } else {
            // If page accessed directly without order data, redirect
            navigate('/my-orders');
        }
    }, [state, clearCart, navigate]);

    if (!state?.orderDetails) {
        return null; // Will redirect in useEffect
    }

    const { orderID, totalAmount, deliveryOption, items } = state.orderDetails;

    return (
        <div className="confirmation-container">
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <svg viewBox="0 0 24 24" className="success-icon">
                        <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                    </svg>
                    <h1>Order Confirmed!</h1>
                    <p className="order-number">Order #{orderID}</p>
                </div>

                <div className="confirmation-details">
                    <div className="detail-row">
                        <span>Total Paid</span>
                        <span>R{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                        <span>Delivery Method</span>
                        <span>{deliveryOption}</span>
                    </div>
                    <div className="detail-row">
                        <span>Status</span>
                        <span className="status-processing">Processing</span>
                    </div>
                </div>

                <div className="order-items">
                    <h3>Your Items</h3>
                    <ul>
                        {items.map(item => (
                            <li key={item.productID} className="order-item">
                                <img src={item.imageURL} alt={item.productName} />
                                <div>
                                    <h4>{item.productName}</h4>
                                    <span>Qty: {item.quantity}</span>
                                </div>
                                <span>R{(item.productPrice * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="confirmation-actions">
                    <button
                        onClick={() => navigate('/products')}
                        className="continue-shopping"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="view-orders"
                    >
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;