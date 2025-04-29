import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from './ProductCard';
import AddProductForm from './AddProductForm';

const ProductList = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            console.log('API Response:', response.data); // Debug log

            // Check if response.data has a products array
            if (response.data && Array.isArray(response.data.products)) {
                setProducts(response.data.products);
            } else {
                setError('Invalid response data format.');
                console.error('Unexpected API response format:', response.data);
            }
        } catch (err) {
            setError('Failed to fetch products.');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="product-list-container p-4">
            <h1 className="text-2xl font-bold mb-4">Product Listings</h1>

            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.productID} product={product} />
                    ))}
                </div>
            )}

            {/* Conditionally show AddProductForm for Super Users */}
            {token && JSON.parse(atob(token.split('.')[1]))?.role === 'Super User' && (
                <div className="mt-10">
                    <AddProductForm onSuccess={fetchProducts} />
                </div>
            )}
        </div>
    );
};

export default ProductList;