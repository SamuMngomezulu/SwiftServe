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
                const response = await api.get('/category');
                const fetchedCategories = response.data?.data || [];
                setCategories(fetchedCategories);
                if (fetchedCategories.length === 0) {
                    setError('No categories available. Please add a category first.');
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again later.');
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    setError('Image file size must be less than 10MB.');
                    return;
                }
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    setError('Only image files (e.g., PNG, JPEG) are allowed.');
                    return;
                }
            }
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
        }));
        // Clear error when user starts correcting input
        setError('');
    };

    const validate = () => {
        const { ProductName, ProductPrice, CategoryID, ProductStockQuantity, ImageFile } = formData;

        if (!ProductName || !ProductPrice || !CategoryID || !ProductStockQuantity || !ImageFile) {
            return 'All fields except description are required.';
        }

        const price = parseFloat(ProductPrice);
        if (isNaN(price) || price <= 0) {
            return 'Price must be a positive number.';
        }
        if (price > 9999999.99) {
            return 'Price must not exceed 9999999.99.';
        }

        const quantity = Number(ProductStockQuantity);
        if (!Number.isInteger(quantity)) {
            return 'Quantity must be an integer.';
        }
        if (quantity < 0) {
            return 'Quantity cannot be negative.';
        }

        if (!categories.some(cat => cat.categoryID === parseInt(CategoryID))) {
            return 'Please select a valid category.';
        }

        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        const token = localStorage.getItem('token');
        console.log('Submitting with token:', token);

        const data = new FormData();
        data.append('ProductName', formData.ProductName);
        data.append('ProductDescription', formData.ProductDescription || '');
        data.append('ProductPrice', parseFloat(formData.ProductPrice).toFixed(2));
        data.append('CategoryID', parseInt(formData.CategoryID));
        data.append('ProductStockQuantity', parseInt(formData.ProductStockQuantity));
        data.append('IsAvailable', formData.IsAvailable.toString()); // Send as "true"/"false"
        data.append('ImageFile', formData.ImageFile);

        // Log FormData entries for debugging
        for (let [key, value] of data.entries()) {
            console.log(`${key}:`, value);
        }

        setLoading(true);
        try {
            const response = await api.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Product created successfully:', response.data);
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
            console.error('Product creation error:', err);
            let errorMessage = 'Failed to add product. Please try again.';
            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = 'Unauthorized. Please log in again.';
                } else if (err.response.status === 400) {
                    errorMessage = err.response.data?.message || 'Invalid input. Please check your data.';
                    if (err.response.data?.error) {
                        errorMessage += ` Error: ${err.response.data.error.Message}`;
                    }
                } else {
                    errorMessage = err.response.data?.message || err.message;
                }
            }
            setError(errorMessage);
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
                    maxLength="100"
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="ProductDescription"
                    value={formData.ProductDescription}
                    onChange={handleChange}
                    maxLength="255"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="9999999.99"
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
                        step="1"
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
                <label htmlFor="IsAvailable">Available</label>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
            </button>
        </form>
    );
};

export default AddProductForm;