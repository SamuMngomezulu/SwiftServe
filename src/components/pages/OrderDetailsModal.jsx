import React, { useState, useEffect } from 'react';
import { getOrderDetails } from '../services/OrderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const OrderDetailsModal = ({ orderId, isOpen, onClose }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || !isOpen) {
                setOrder(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                const data = await getOrderDetails(orderId);
                setOrder(data);
            } catch (err) {
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content order-details-modal">
                <button className="modal-close-button" onClick={onClose}>&times;</button>

                {loading && <div className="loading-spinner">Loading order details...</div>}
                {error && <div className="error-message">{error}</div>}
                {!loading && !error && !order && <div className="no-results">Order not found.</div>}

                {order && (
                    <>
                        <h2>Order Details #{order.orderID}</h2>

                        <div className="order-details-summary">
                            <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                            <p><strong>Status:</strong> {order.statusName || 'N/A'}</p>
                            <p><strong>Delivery Option:</strong> {order.deliveryOption || 'N/A'}</p>
                            <p><strong>Total Amount:</strong> {formatCurrency(order.totalAmount || 0)}</p>
                        </div>

                        <h3>Items:</h3>
                        {order.items && order.items.length > 0 ? (
                            <div className="order-items-table">
                                <div className="order-item-header table-header-row">
                                    <div className="product-cell-header">Product</div>
                                    <div>Price</div>
                                    <div>Quantity</div>
                                    <div>Subtotal</div>
                                </div>
                                {order.items.map(item => (
                                    <div key={item.cartItemID} className="order-item-row table-item-row">
                                        <div className="product-cell">
                                            <img
                                                src={item.imageURL || '/placeholder-product.jpg'}
                                                alt={item.productName || 'Product'}
                                                className="order-product-image"
                                            />
                                            <div className="product-info">
                                                <h3>{item.productName || 'Unknown Product'}</h3>
                                            </div>
                                        </div>
                                        <div>{formatCurrency(item.productPrice || 0)}</div>
                                        <div>{item.quantity || 0}</div>
                                        <div>{formatCurrency((item.productPrice || 0) * (item.quantity || 0))}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No items found for this order.</p>
                        )}
                        <div className="modal-actions">
                            <button onClick={onClose} className="btn-secondary">Close</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsModal;