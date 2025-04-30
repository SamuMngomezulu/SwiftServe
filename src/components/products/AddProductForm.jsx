import { useState } from 'react';
import api from '../services/api';
import '../styles/addProductForm.css';

const AddProductForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
        is_active: true,
        image: null,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
        }));
    };

    const validate = () => {
        const { name, description, price, category, quantity, image } = formData;
        if (!name || !price || !category || !quantity || !image) {
            return 'All fields except description are required.';
        }
        if (isNaN(price) || parseFloat(price) <= 0) {
            return 'Price must be a positive number.';
        }
        if (!Number.isInteger(Number(quantity)) || quantity < 0) {
            return 'Quantity must be a non-negative integer.';
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
                name: '',
                description: '',
                price: '',
                category: '',
                quantity: '',
                is_active: true,
                image: null,
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-product-form">
            <h2>Add New Product</h2>
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
                <label>Product Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
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
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        min="0"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-checkbox-group">
                <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                />
                <label htmlFor="is_active">Active</label>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
            </button>
        </form>
    );
};

export default AddProductForm;