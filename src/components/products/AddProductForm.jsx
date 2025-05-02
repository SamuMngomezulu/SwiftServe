import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/addProductForm.css';

const AddProductForm = ({ onSuccess }) => {
    const { user, hasRole, ROLE_KEYS } = useAuth();
    const [formData, setFormData] = useState({
        ProductName: '',
        ProductDescription: '',
        ProductPrice: '',
        CategoryID: '',
        ProductStockQuantity: '',
        IsAvailable: true,
        ImageFile: null,
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isAdminOrSuperUser = hasRole(ROLE_KEYS.SUPER_USER) || hasRole(ROLE_KEYS.ADMIN);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
        }));
    };

    const validate = () => {
        const { ProductName, ProductPrice, CategoryID, ProductStockQuantity, ImageFile } = formData;
        if (!ProductName || !ProductPrice || !CategoryID || !ProductStockQuantity || !ImageFile) {
            return 'All fields except description are required.';
        }
        if (isNaN(ProductPrice) || parseFloat(ProductPrice) <= 0) {
            return 'Price must be a positive number.';
        }
        if (!Number.isInteger(Number(ProductStockQuantity))) {
            return 'Quantity must be an integer.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) return setError(validationError);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) data.append(key, value);
        });

        setLoading(true);
        try {
            await api.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSuccess();
            setFormData({
                ProductName: '',
                ProductDescription: '',
                ProductPrice: '',
                CategoryID: '',
                ProductStockQuantity: '',
                IsAvailable: true,
                ImageFile: null,
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Please login to add products.</div>;
    if (!isAdminOrSuperUser) return <div>You do not have permission to add products.</div>;

    return (
        <form onSubmit={handleSubmit} className="add-product-form">
            <h2>Add New Product</h2>
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
                <label>Product Name</label>
                <input
                    type="text"
                    name="ProductName"
                    value={formData.ProductName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="ProductDescription"
                    value={formData.ProductDescription}
                    onChange={handleChange}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        name="ProductPrice"
                        value={formData.ProductPrice}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="CategoryID"
                        value={formData.CategoryID}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.categoryID} value={category.categoryID}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        min="0"
                        name="ProductStockQuantity"
                        value={formData.ProductStockQuantity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Image</label>
                    <input
                        type="file"
                        name="ImageFile"
                        accept="image/*"
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-checkbox-group">
                <input
                    type="checkbox"
                    id="IsAvailable"
                    name="IsAvailable"
                    checked={formData.IsAvailable}
                    onChange={handleChange}
                />
                <label htmlFor="IsAvailable">Active</label>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
            </button>
        </form>
    );
};

export default AddProductForm;
