import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/productService';
import ProductCard from './ProductCard';
import AddProductForm from './AddProductForm';
import '../styles/productList.css';

const ProductList = () => {
    const { hasRole } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log('Starting products fetch...'); // Debug 1

            const productsData = await getProducts();
            console.log('Raw API response:', productsData); // Debug 2

            // Debug: Check the type and structure
            console.log('Type of productsData:', typeof productsData); // Debug 3
            console.log('Is array?', Array.isArray(productsData)); // Debug 4

            // Handle different possible response structures
            let productsArray = [];

            if (Array.isArray(productsData)) {
                console.log('Received direct array of products'); // Debug 5
                productsArray = productsData;
            }
            else if (productsData && typeof productsData === 'object') {
                console.log('Received object response. Checking for products property...'); // Debug 6

                if (productsData.products) {
                    console.log('Found products property:', productsData.products); // Debug 7

                    if (Array.isArray(productsData.products)) {
                        productsArray = productsData.products;
                    }
                    else if (typeof productsData.products === 'object') {
                        console.log('Converting products object to array...'); // Debug 8
                        productsArray = Object.values(productsData.products);
                    }
                }
                else {
                    console.log('No products property found, using empty array'); // Debug 9
                }
            }

            console.log('Final products array to set:', productsArray); // Debug 10
            setProducts(productsArray);

        } catch (err) {
            console.error('Error fetching products:', err); // Debug 11
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                stack: err.stack
            }); // Debug 12

            setError(err.response?.data?.message || 'Failed to fetch products');
            setProducts([]);
        } finally {
            console.log('Fetch completed. Loading set to false.'); // Debug 13
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Component mounted. Fetching products...'); // Debug 14
        fetchProducts();
    }, []);

    return (
        <div className="product-list-container">
            <h1 className="product-list-title">Product Listings</h1>
            {console.log('Rendering with products:', products)} {/* Debug 15 */}

            {loading ? (
                <div className="loading-spinner">Loading products...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : products.length === 0 ? (
                <div className="empty-message">No products available</div>
            ) : (
                <div className="product-grid">
                    {console.log('Mapping products:', products)} {/* Debug 16 */}
                    {products.map((product) => {
                        console.log('Current product:', product); // Debug 17
                        return (
                            <ProductCard
                                key={product.ProductID}
                                product={product}
                            />
                        );
                    })}
                </div>
            )}

            {hasRole('Super User') && (
                <div className="add-product-section">
                    <AddProductForm onSuccess={fetchProducts} />
                </div>
            )}
        </div>
    );
};

export default ProductList;