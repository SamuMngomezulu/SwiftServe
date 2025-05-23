import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/addProductForm.css';
import { toast } from 'react-toastify';


const AddProductForm = ({ onSuccess }) => {
    const fileInputRef = useRef(null);
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
    const [quantityInput, setQuantityInput] = useState('');


    const isAdminOrSuperUser = hasRole(ROLE_KEYS.SUPER_USER) || hasRole(ROLE_KEYS.ADMIN);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            IsAvailable: parseInt(prev.ProductStockQuantity) > 0
        }));
    }, [formData.ProductStockQuantity]);

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

    const handlePriceChange = (value) => {
        
        let sanitizedValue = value.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = sanitizedValue.split('.');
        if (parts.length > 2) {
            sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
        }

       
        if (parts.length > 1 && parts[1].length > 2) {
            sanitizedValue = parts[0] + '.' + parts[1].substring(0, 2);
        }

        
        if (parts[0].length > 1 && parts[0].startsWith('0') && !parts[0].includes('.')) {
            sanitizedValue = parts[0].substring(1);
        }

        setFormData(prev => ({
            ...prev,
            ProductPrice: sanitizedValue
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === 'ProductStockQuantity') {
            const parsedValue = parseInt(value) || 1;  // Fallback to 1 if invalid
            setFormData(prev => ({
                ...prev,
                [name]: Math.max(1, parsedValue)  // Ensures value is never below 1
            }));
            return;
        }

        if (name === 'ProductPrice') {
            handlePriceChange(value);
            return;
        }

        if (type === 'file') {
            const file = files[0];
            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    setError('Image file size must be less than 10MB.');
                    return;
                }
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

        setError('');
    };

    const validate = () => {
        const { ProductName, ProductPrice, CategoryID, ProductStockQuantity, ImageFile } = formData;

        if (!ProductName || !ProductPrice || !CategoryID || !ProductStockQuantity || !ImageFile) {
            return 'All fields except description are required.';
        }

        // Price validation
        const price = parseFloat(ProductPrice);
        if (isNaN(price)) {
            return 'Price must be a valid number.';
        }
        if (price <= 0) {
            return 'Price must be greater than 0.';
        }
        if (price > 10000) {
            return 'Price must not exceed 10,000.';
        }

       
        const decimalPart = ProductPrice.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
            return 'Price can have maximum 2 decimal places';
        }

       
        const quantity = parseInt(ProductStockQuantity);
        if (isNaN(quantity)) {
            return 'Quantity must be a valid number.';
        }
        if (quantity < 0) {  
            return 'Quantity cannot be negative.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            toast.error(validationError);
            return;

        }

        try {
            setLoading(true);

            const data = new FormData();
            data.append('ProductName', formData.ProductName);
            data.append('ProductDescription', formData.ProductDescription || '');
            toast.success('Product added successfully!');

            
            const price = parseFloat(formData.ProductPrice);
            if (isNaN(price)) {
                throw new Error('Invalid price format');
            }
            data.append('ProductPrice', price.toString()); 

            data.append('CategoryID', formData.CategoryID);
            data.append('ProductStockQuantity', formData.ProductStockQuantity);
            data.append('IsAvailable', formData.IsAvailable);
            data.append('ImageFile', formData.ImageFile);

            const response = await api.post('/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }

               

            });

            
            const createdProduct = response.data;
            console.log('Created product:', createdProduct);

            // Reset form on success
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

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            if (onSuccess) onSuccess();

        } catch (err) {
            console.error('Product creation error:', err);

            let errorMessage = 'Failed to add product. Please try again.';
            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = 'Unauthorized. Please log in again.';
                } else if (err.response.status === 400) {
                    if (err.response.data?.errors) {
                        const errors = Object.values(err.response.data.errors).flat();
                        errorMessage = errors.join('\n');
                    } else {
                        errorMessage = err.response.data?.message || 'Invalid input. Please check your data.';
                    }
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Please login to add products.</div>;
    }

    if (!isAdminOrSuperUser) {
        return <div>You do not have permission to add products.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="add-product-form" encType="multipart/form-data">
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
                        type="text"
                        inputMode="decimal"
                        name="ProductPrice"
                        value={formData.ProductPrice}
                        onChange={handleChange}
                        onBlur={(e) => {
                            const value = e.target.value;
                            if (value && !isNaN(value)) {
                                const formatted = parseFloat(value).toFixed(2);
                                setFormData(prev => ({
                                    ...prev,
                                    ProductPrice: formatted
                                }));
                            }
                        }}
                        required
                        placeholder="0.00"
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
                        value={quantityInput}
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuantityInput(value); 

                      
                            if (value === '' || /^[0-9]+$/.test(value)) {
                                setFormData(prev => ({
                                    ...prev,
                                    ProductStockQuantity: value === '' ? 0 : parseInt(value)
                                }));
                            }
                        }}
                        onBlur={() => {
                            // When field loses focus, clean up empty value
                            if (quantityInput === '') {
                                setQuantityInput('0');
                                setFormData(prev => ({
                                    ...prev,
                                    ProductStockQuantity: 0
                                }));
                            }
                        }}
                        required
                    />
                    <small className="input-hint">Enter stock quantity (0 for out of stock)</small>
                </div>
                

                <div className="form-group">
                    <label>Image</label>
                    <input
                        type="file"
                        name="ImageFile"
                        accept="image/*"
                        onChange={handleChange}
                        required
                        ref={fileInputRef} 
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