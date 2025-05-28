import { useState } from 'react';
import { cancelOrder, updateOrderStatus } from '../services/OrderService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/orderCard.css';


const OrderCard = ({ order, isAdmin }) => {
    const [currentStatus, setCurrentStatus] = useState(order.orderStatusID);
    const [isEditing, setIsEditing] = useState(false);
    const { hasRole } = useAuth();

    const handleCancel = async () => {
        try {
            await cancelOrder(order.orderID);
            toast.success('Order canceled successfully');
            setCurrentStatus(4); // Assuming 4 is Canceled status
        } catch (error) {
            toast.error(error.message || 'Failed to cancel order');
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateOrderStatus(order.orderID, newStatus);
            setCurrentStatus(newStatus);
            setIsEditing(false);
            toast.success('Order status updated');
        } catch (error) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    return (
        <div className={`order-card status-${currentStatus}`}>
            <div className="order-header">
                <h3>Order #{order.orderID}</h3>
                <span className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()}
                </span>
            </div>

            <div className="order-details">
                <div className="order-summary">
                    <span className="order-total">R{order.totalAmount.toFixed(2)}</span>
                    <span className="order-status">{order.statusName}</span>
                    <span className="delivery-method">
                        Delivery: {order.deliveryOption}
                    </span>
                </div>

                {isAdmin && (
                    <div className="order-actions">
                        {isEditing ? (
                            <select
                                value={currentStatus}
                                onChange={(e) => handleStatusUpdate(parseInt(e.target.value))}
                            >
                                <option value={1}>Processing</option>
                                <option value={2}>Shipped</option>
                                <option value={3}>Completed</option>
                                <option value={4}>Canceled</option>
                            </select>
                        ) : (
                            <button onClick={() => setIsEditing(true)}>
                                Change Status
                            </button>
                        )}
                    </div>
                )}

                {!isAdmin && currentStatus === 1 && (
                    <button
                        onClick={handleCancel}
                        className="cancel-button"
                    >
                        Cancel Order
                    </button>
                )}
            </div>

            <div className="order-items">
                <h4>Items ({order.items.length})</h4>
                <ul>
                    {order.items.map(item => (
                        <li key={item.cartItemID} className="order-item">
                            <img src={item.imageURL} alt={item.productName} />
                            <div>
                                <span>{item.productName}</span>
                                <span>Qty: {item.quantity}</span>
                                <span>R{(item.productPrice * item.quantity).toFixed(2)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderCard;