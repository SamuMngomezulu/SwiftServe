import { useEffect, useState } from 'react';
import { getProducts, deleteProduct, updateProduct } from '../services/productService';
import '../styles/productTable.css';
import api from '../services/api'; // Assuming you have an api instance set up

const ProductTable = () => {
    const [products, setProducts] = useState([]);
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

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productsData = await getProducts();

            const normalized = Array.isArray(productsData)
                ? productsData
                : productsData?.data || productsData?.products || [];

            const finalArray = Array.isArray(normalized)
                ? normalized
                : Object.values(normalized);

            setProducts(finalArray);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.productID !== productId));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete product.');
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
            isAvailable: product.isAvailable,
            imageFile: null
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: type === 'checkbox' ? checked :
                type === 'file' ? files[0] : value
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            // Append all fields to formData
            formData.append('ProductName', editFormData.productName);
            formData.append('ProductDescription', editFormData.productDescription || '');
            formData.append('ProductPrice', editFormData.productPrice);
            formData.append('CategoryID', editFormData.categoryID);
            formData.append('ProductStockQuantity', editFormData.productStockQuantity);
            formData.append('IsAvailable', editFormData.isAvailable);

            // Only append image if a new one was selected
            if (editFormData.imageFile) {
                formData.append('ImageFile', editFormData.imageFile);
            }

            const response = await api.put(`/products/${editingProduct.productID}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProducts(products.map(product =>
                product.productID === editingProduct.productID ?
                    { ...product, ...response.data.product } :
                    product
            ));

            setEditingProduct(null);
            alert('Product updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            alert(err.response?.data?.message || 'Failed to update product.');
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    return (
        <div className="product-table-container">
            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <table className="product-table">
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
                            {products.map((product) => (
                                <tr key={product.productID}>
                                    <td>
                                        <img src={product.imageURL} alt={product.productName} className="table-img" />
                                    </td>
                                    <td>{product.productName}</td>
                                    <td>R{parseFloat(product.productPrice).toFixed(2)}</td>
                                    <td>{product.category?.categoryName || 'Uncategorized'}</td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditClick(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(product.productID)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
                                        <label>Category ID</label>
                                        <input
                                            type="number"
                                            name="categoryID"
                                            value={editFormData.categoryID}
                                            onChange={handleEditFormChange}
                                            required
                                        />
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
                                            />
                                            Available
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