import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProducts, getCategories } from '../services/productService';
import ProductCard from './ProductCard';
import CartButton from '../cart/CartButton';
import CartModal from '../cart/CartModal';
import '../styles/productList.css';

const ProductList = () => {
    const { hasRole } = useAuth();
    const { isCartOpen } = useCart();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories()
            ]);

            let productsArray = Array.isArray(productsData)
                ? productsData
                : productsData?.products
                    ? Array.isArray(productsData.products)
                        ? productsData.products
                        : Object.values(productsData.products)
                    : [];

            // Filter out unavailable products (where IsAvailable is false or stock is 0)
            const availableProducts = productsArray.filter(product =>
                product.isAvailable && product.productStockQuantity > 0
            );

            setProducts(availableProducts);
            setFilteredProducts(availableProducts);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.response?.data?.message || 'Failed to fetch products');
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let results = [...products];

        if (searchQuery) {
            results = results.filter(product =>
                product.productName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            results = results.filter(product =>
                product.category?.categoryID.toString() === selectedCategory
            );
        }

        setFilteredProducts(results);
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, products]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="product-list-container">
            {/* Cart Button and Modal */}
            <CartButton />
            {isCartOpen && <CartModal />}

            {/* Controls */}
            <div className="product-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="category-filter">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category.categoryID} value={category.categoryID}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="loading-spinner">Loading products...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="results-container">
                    {filteredProducts.length === 0 ? (
                        <div className="empty-message">
                            {searchQuery || selectedCategory !== 'all'
                                ? 'No products match your search'
                                : 'No products available'}
                        </div>
                    ) : (
                        <>
                            <div className="product-grid">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.ProductID} product={product} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="pagination-button"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="pagination-button"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;