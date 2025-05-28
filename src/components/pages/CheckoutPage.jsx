import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { walletApi } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/checkout.css';
import api from '../services/api';

const CheckoutPage = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const [deliveryOption, setDeliveryOption] = useState('PickUp');
    const [isProcessing, setIsProcessing] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isBalanceLoading, setIsBalanceLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch wallet balance
    useEffect(() => {
        const fetchWalletBalance = async () => {
            try {
                const response = await walletApi.getBalance();
                setWalletBalance(response.data);
                setIsBalanceLoading(false);
            } catch (error) {
                console.error('Failed to fetch wallet balance:', error);
                toast.error('Failed to load wallet balance');
                setIsBalanceLoading(false);
            }
        };

        fetchWalletBalance();
    }, []);

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setIsProcessing(true);

        try {
            // Calculate final total
            const finalTotal = deliveryOption === 'Deliver' ? totalPrice + 50 : totalPrice;

            // Verify balance again right before checkout
            const balanceResponse = await walletApi.getBalance();
            const currentBalance = balanceResponse.data;

            if (currentBalance < finalTotal) {
                setWalletBalance(currentBalance);
                toast.error('Insufficient wallet balance');
                setIsProcessing(false);
                return;
            }

            // Process checkout - send deliveryOption as enum value (0 for PickUp, 1 for Deliver)
            const response = await api.post('/checkout', {
                deliveryOption: deliveryOption === 'Deliver' ? 2 : 1
            });

            // Handle successful checkout
            clearCart();
            toast.success(`Order #${response.data.orderID} placed successfully!`);

            // Navigate to order confirmation with order details
            navigate('/order-confirmation', {
                state: {
                    orderSuccess: true,
                    orderDetails: {
                        orderID: response.data.orderID,
                        totalAmount: finalTotal,
                        deliveryOption,
                        items: cartItems.map(item => ({
                            productID: item.productID,
                            productName: item.name,
                            quantity: item.quantity,
                            productPrice: item.price,
                            imageURL: item.image
                        }))
                    }
                }
            });

        } catch (error) {
            console.error('Checkout failed:', error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Checkout failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const calculateTotal = () => {
        return deliveryOption === 'Deliver' ? totalPrice + 50 : totalPrice;
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {/* Order Summary Section */}
            <div className="checkout-section">
                <h2>Order Summary</h2>
                <ul className="checkout-items">
                    {cartItems.map(item => (
                        <li key={item.productID} className="checkout-item">
                            <div className="item-info">
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <h4>{item.name}</h4>
                                    <span>Qty: {item.quantity}</span>
                                </div>
                            </div>
                            <span className="item-price">R{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="checkout-total">
                    <span>Subtotal:</span>
                    <span>R{totalPrice.toFixed(2)}</span>
                    {deliveryOption === 'Deliver' && (
                        <>
                            <span>Delivery Fee:</span>
                            <span>R50.00</span>
                        </>
                    )}
                    <span className="total-amount">Total:</span>
                    <span className="total-amount">R{calculateTotal().toFixed(2)}</span>
                </div>
            </div>

            {/* Delivery Options Section */}
            <div className="checkout-section">
                <h2>Delivery Method</h2>
                <div className="option-group">
                    <label className={`option-card ${deliveryOption === 'PickUp' ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="delivery"
                            value="PickUp"
                            checked={deliveryOption === 'PickUp'}
                            onChange={() => setDeliveryOption('PickUp')}
                        />
                        <div>
                            <h4>Pick Up</h4>
                            <p>Collect your order from our store</p>
                            <p className="delivery-time">Ready in 30 minutes</p>
                        </div>
                    </label>

                    <label className={`option-card ${deliveryOption === 'Deliver' ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="delivery"
                            value="Deliver"
                            checked={deliveryOption === 'Deliver'}
                            onChange={() => setDeliveryOption('Deliver')}
                        />
                        <div>
                            <h4>Delivery</h4>
                            <p>We'll deliver to your address</p>
                            <p className="delivery-time">Delivery within 1-2 hours</p>
                            <p className="delivery-fee">+ R50.00 delivery fee</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Wallet Balance Info */}
            <div className="checkout-section">
                <h2>Wallet Balance</h2>
                <div className="wallet-info">
                    <p>All payments are made through your SwiftServe wallet.</p>
                    {isBalanceLoading ? (
                        <p className="wallet-balance loading">Loading balance...</p>
                    ) : (
                        <p className="wallet-balance">
                            Available: R{walletBalance.toFixed(2)}
                        </p>
                    )}
                </div>
            </div>

            {/* Checkout Button */}
            <div className="checkout-actions">
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                    disabled={isProcessing}
                >
                    Back to Cart
                </button>
                <button
                    onClick={handleCheckout}
                    disabled={isProcessing || isBalanceLoading || cartItems.length === 0}
                    className="checkout-button"
                >
                    {isProcessing ? (
                        <>
                            <span className="spinner"></span>
                            Processing...
                        </>
                    ) : (
                        'Complete Order'
                    )}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;