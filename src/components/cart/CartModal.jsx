import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../styles/cartModal.css';
import { useNavigate } from 'react-router-dom';


const CartModal = () => {
    const {
        cartItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        clearCart,
    } = useCart();

    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleDecreaseQuantity = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.productID, item.quantity - 1);
        } else {
            removeFromCart(item.productID);
            toast.info(`${item.name} removed from cart.`);
        }
    };

    return (
        <div className="cart-modal-overlay" onClick={() => setIsCartOpen(false)}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h3>Your Shopping Cart</h3>
                    <button
                        className="close-button"
                        onClick={() => setIsCartOpen(false)}
                    >
                        &times;
                    </button>
                </div>

                <div className="cart-modal-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty</p>
                            <button
                                className="continue-shopping"
                                onClick={() => setIsCartOpen(false)}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <ul className="cart-items">
                                {cartItems.map(item => (
                                    <li key={item.cartItemID} className="cart-item">
                                        <div className="cart-item-main">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="cart-item-image"
                                            />
                                            <div className="cart-item-details">
                                                <h4>{item.name}</h4>
                                            </div>
                                        </div>
                                        <div className="cart-item-price-actions">
                                            <div className="quantity-control">
                                                <button
                                                    className="quantity-button"
                                                    onClick={() => handleDecreaseQuantity(item)}
                                                >
                                                    -
                                                </button>
                                                <span className="quantity-display">{item.quantity}</span>
                                                <button
                                                    className="quantity-button"
                                                    onClick={() => updateQuantity(item.productID, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="cart-item-price">
                                                R{item.lineTotal.toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    removeFromCart(item.productID);
                                                    toast.info(`${item.name} removed from cart.`);
                                                }}
                                                className="remove-item"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="cart-summary">
                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span>R{totalPrice.toFixed(2)}</span>
                                </div>

                                <div className="cart-buttons">
                                    <button
                                        onClick={() => {
                                            clearCart();
                                            toast.warn('Cart cleared.');
                                        }}
                                        className="clear-cart"
                                    >
                                        Clear Cart
                                    </button>
                                        <button
                                            className="checkout-button"
                                            onClick={() => {
                                             
                                                // Replace the toast with actual checkout logic
                                                navigate('/checkout');
                                            }}
                                        >
                                            Proceed to Checkout
                                        </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartModal;