import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../styles/productCard.css';

const ProductCard = ({ product }) => {
    const { isAuthenticated } = useAuth();
    const { addToCart, productStockUpdates } = useCart();

    const [quantity, setQuantity] = useState(1);

    // Calculate effective stock considering any updates from the cart
    const effectiveStock = product.productStockQuantity + (productStockUpdates[product.productID] || 0);

    const handleAddToCart = () => {
        if (quantity > effectiveStock) {
            toast.error('Not enough stock available.');
            return;
        }

        addToCart({
            id: product.productID,
            name: product.productName,
            price: product.productPrice,
            image: product.imageURL,
            quantity
        });

        toast.success('Added to cart!');
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
                    <span>Category: {product.category?.categoryName || 'Unknown'}</span>
                    <span>Stock: {effectiveStock}</span>
                </div>

                <div className={`product-status ${effectiveStock > 0 ? 'available' : 'out-of-stock'}`}>
                    {effectiveStock > 0 ? 'Available' : 'Out of Stock'}
                </div>

                {isAuthenticated && effectiveStock > 0 && (
                    <div className="product-actions">
                        <input
                            type="number"
                            min="1"
                            max={effectiveStock}
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Math.max(1, Math.min(effectiveStock, parseInt(e.target.value) || 1)))
                            }
                            className="quantity-input"
                        />
                        <button onClick={handleAddToCart} className="add-to-cart-btn">
                            Add to Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;