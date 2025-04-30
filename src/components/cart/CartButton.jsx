import { useCart } from '../context/CartContext';
import '../styles/cartButton.css';

const CartButton = () => {
    const { totalItems, setIsCartOpen } = useCart();

    return (
        <button
            className="cart-button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
        >
            <i className="fas fa-shopping-cart"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
    );
};

export default CartButton;