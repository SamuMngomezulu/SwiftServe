import { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/productCard.css';

const ProductCard = ({ product }) => {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            id: product.productID,
            name: product.productName,
            price: product.productPrice,
            image: product.imageURL,
            quantity: quantity
        });
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={product.imageURL || 'https://via.placeholder.com/150'}
                    alt={product.productName}
                    className="product-image"
                />
            </div>
            <div className="product-details">
                <h3 className="product-name">{product.productName}</h3>
                <p className="product-description">{product.productDescription}</p>
                <p className="product-price">R{product.productPrice?.toFixed(2)}</p>

                <div className="product-meta">
                    <span>Stock: {product.productStockQuantity}</span>
                    <span>Category: {product.category?.categoryName || 'Unknown'}</span>
                </div>

                <div className={`product-status ${product.isAvailable ? 'available' : 'out-of-stock'}`}>
                    {product.isAvailable ? 'Available' : 'Out of Stock'}
                </div>

                {isAuthenticated && product.isAvailable && (
                    <div className="product-actions">
                        <input
                            type="number"
                            min="1"
                            max={product.productStockQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.productStockQuantity, parseInt(e.target.value) || 1)))}
                            className="quantity-input"
                        />
                        <button
                            onClick={handleAddToCart}
                            className="add-to-cart-btn"
                        >
                            Add to Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;