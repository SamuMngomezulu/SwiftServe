import { useEffect, useState, useMemo } from 'react';
import { getProducts, deleteProduct, getCategories } from '../services/productService';
import '../styles/productTable.css';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        productName: '',
        productDescription: '',
        productPrice: '',
        categoryID: '',
        productStockQuantity: '',
        isAvailable: false,
        imageFile: null
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [products, searchTerm]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const updateProductAvailability = (product) => {
        if (product.productStockQuantity <= 0) {
            return {
                ...product,
                isAvailable: false
            };
        }
        return product;
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productsData = await getProducts();
            const normalized = Array.isArray(productsData)
                ? productsData
                : productsData?.data || productsData?.products || [];
            const finalArray = Array.isArray(normalized) ? normalized : Object.values(normalized);

            const productsWithUpdatedAvailability = finalArray.map(updateProductAvailability);
            setProducts(productsWithUpdatedAvailability);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch products.');
            toast.error('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            toast.error('Failed to fetch categories.');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.productID !== productId));
            toast.success('Product deleted successfully!');
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete product.');
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditFormData({
            productName: product.productName,
            productDescription: product.productDescription,
            productPrice: product.productPrice,
            categoryID: product.category?.categoryID || '',
            productStockQuantity: product.productStockQuantity,
            isAvailable: product.productStockQuantity > 0 ? product.isAvailable : false,
            imageFile: null
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setEditFormData(prev => {
            if (name === 'productStockQuantity') {
                const newQuantity = type === 'number' ? parseInt(value) || 0 : prev.productStockQuantity;
                const wasZero = prev.productStockQuantity <= 0;
                const isNowPositive = newQuantity > 0;

                return {
                    ...prev,
                    [name]: type === 'number' ? parseInt(value) || 0 : value,
                    isAvailable: wasZero && isNowPositive ? true : prev.isAvailable
                };
            }

            return {
                ...prev,
                [name]: type === 'checkbox' ? checked :
                    type === 'file' ? files[0] : value
            };
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalIsAvailable = editFormData.productStockQuantity > 0
                ? editFormData.isAvailable
                : false;

            const formData = new FormData();
            formData.append('ProductName', editFormData.productName);
            formData.append('ProductDescription', editFormData.productDescription || '');
            formData.append('ProductPrice', editFormData.productPrice);
            formData.append('CategoryID', editFormData.categoryID);
            formData.append('ProductStockQuantity', editFormData.productStockQuantity);
            formData.append('IsAvailable', finalIsAvailable);

            if (editFormData.imageFile) {
                formData.append('ImageFile', editFormData.imageFile);
            }

            const response = await api.put(`/products/${editingProduct.productID}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProducts(products.map(product =>
                product.productID === editingProduct.productID
                    ? updateProductAvailability({ ...product, ...response.data.product })
                    : product
            ));

            setEditingProduct(null);
            toast.success('Product updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            toast.error(err.response?.data?.message || 'Failed to update product.');
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    return (
        <div className="product-table-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="search-input"
                />
            </div>

            {!loading && !error && searchTerm && (
                <p style={{ marginBottom: '1rem', fontWeight: 500 }}>
                    {filteredProducts.length > 0
                        ? `Found ${filteredProducts.length} product(s) matching "${searchTerm}".`
                        : `No products found for "${searchTerm}".`}
                </p>
            )}

            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="product-table">
                            <colgroup>
                                <col style={{ width: '80px' }} />
                                <col style={{ width: '250px' }} />
                                <col style={{ width: '100px' }} />
                                <col style={{ width: '150px' }} />
                                <col style={{ width: '150px' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product) => (
                                    <tr key={product.productID}>
                                        <td>
                                            <img src={product.imageURL} alt={product.productName} className="table-img" />
                                        </td>
                                        <td>{product.productName}</td>
                                        <td>R{parseFloat(product.productPrice).toFixed(2)}</td>
                                        <td>{product.category?.categoryName || 'Uncategorized'}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEditClick(product)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(product.productID)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Next
                        </button>
                    </div>

                    {editingProduct && (
                        <div className="edit-modal">
                            <div className="edit-modal-content">
                                <h2>Edit Product</h2>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="form-group">
                                        <label>Product Name</label>
                                        <input
                                            type="text"
                                            name="productName"
                                            value={editFormData.productName}
                                            onChange={handleEditFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            name="productDescription"
                                            value={editFormData.productDescription}
                                            onChange={handleEditFormChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input
                                            type="number"
                                            name="productPrice"
                                            value={editFormData.productPrice}
                                            onChange={handleEditFormChange}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            name="categoryID"
                                            value={editFormData.categoryID}
                                            onChange={handleEditFormChange}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.categoryID} value={category.categoryID}>
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Stock Quantity</label>
                                        <input
                                            type="number"
                                            name="productStockQuantity"
                                            value={editFormData.productStockQuantity}
                                            onChange={handleEditFormChange}
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group checkbox">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="isAvailable"
                                                checked={editFormData.isAvailable}
                                                onChange={handleEditFormChange}
                                                disabled={editFormData.productStockQuantity <= 0}
                                            />
                                            Available
                                            {editFormData.productStockQuantity <= 0 && (
                                                <span className="availability-hint">(Product unavailable when stock is 0)</span>
                                            )}
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>Product Image</label>
                                        <input
                                            type="file"
                                            name="imageFile"
                                            onChange={handleEditFormChange}
                                            accept="image/*"
                                        />
                                        {editFormData.imageFile ? (
                                            <p>New image selected</p>
                                        ) : (
                                            <p>Current image will be kept</p>
                                        )}
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="save-btn">Save Changes</button>
                                        <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductTable;
