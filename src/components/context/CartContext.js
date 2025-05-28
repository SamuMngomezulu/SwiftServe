import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [productStockUpdates, setProductStockUpdates] = useState({});
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            const response = await cartApi.getCartItems();
            const mappedItems = response.data.map(item => {
                const price = Number(item.productPrice) || 0;
                const quantity = Number(item.quantity) || 0;
                return {
                    cartItemID: item.cartItemID,
                    productID: item.productID,
                    name: item.productName,
                    image: item.imageURL,
                    price,
                    quantity,
                    lineTotal: price * quantity
                };
            });
            setCartItems(mappedItems);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    const updateProductStock = (productID, quantityChange) => {
        setProductStockUpdates(prev => ({
            ...prev,
            [productID]: (prev[productID] || 0) + quantityChange
        }));
    };

    const addToCart = async (product) => {
        try {
            const existingItem = cartItems.find(item => item.productID === product.id);
            const quantityToAdd = Number(product.quantity) || 1;

            const response = await cartApi.addToCart({
                productID: product.id,
                quantity: quantityToAdd
            });

            const backendItem = response.data;
            const price = Number(backendItem.productPrice) || 0;
            const quantity = Number(backendItem.quantity) || 1;
            const lineTotal = price * quantity;

            setCartItems(prevItems => {
                if (existingItem) {
                    return prevItems.map(item =>
                        item.productID === product.id
                            ? {
                                ...backendItem,
                                image: item.image,
                                name: item.name,
                                price,
                                quantity,
                                lineTotal
                            }
                            : item
                    );
                }
                return [
                    ...prevItems,
                    {
                        ...backendItem,
                        image: product.image,
                        name: product.name,
                        price,
                        quantity,
                        lineTotal
                    }
                ];
            });

            updateProductStock(product.id, -quantityToAdd);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (productID) => {
        try {
            const itemToRemove = cartItems.find(item => item.productID === productID);
            if (itemToRemove) {
                await cartApi.removeFromCart(itemToRemove.cartItemID);
                setCartItems(prevItems => prevItems.filter(item => item.productID !== productID));
                updateProductStock(productID, itemToRemove.quantity);
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    const updateQuantity = async (productID, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const itemToUpdate = cartItems.find(item => item.productID === productID);
            if (itemToUpdate && itemToUpdate.quantity !== newQuantity) {
                const quantityDifference = itemToUpdate.quantity - newQuantity;

                const response = await cartApi.updateCartItem(itemToUpdate.cartItemID, {
                    quantity: newQuantity
                });

                const backendItem = response.data;
                const price = Number(backendItem.productPrice) || 0;
                const quantity = Number(backendItem.quantity) || 1;
                const lineTotal = price * quantity;

                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.productID === productID
                            ? {
                                ...backendItem,
                                image: item.image,
                                name: item.name,
                                price,
                                quantity,
                                lineTotal
                            }
                            : item
                    )
                );

                updateProductStock(productID, quantityDifference);
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const clearCart = async () => {
        try {
            await cartApi.clearCart();
            setCartItems([]);
        } catch (error) {
            if (error.response?.status === 404) {
                console.warn('Cart already cleared or deactivated.');
                setCartItems([]);
                return;
            }
            console.error('Failed to clear cart:', error);
            throw error;
        }
    };

    const checkout = async (deliveryOption) => {
        try {
            const response = await cartApi.checkout({ deliveryOption });
            return response.data;
        } catch (error) {
            console.error('Checkout failed:', error);
            throw error;
        }
    };

    const totalItems = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const totalPrice = cartItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return sum + price * quantity;
    }, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            checkout,
            totalItems,
            totalPrice,
            isCartOpen,
            setIsCartOpen,
            productStockUpdates,
            setCartItems // allow manual reset from frontend if needed
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
