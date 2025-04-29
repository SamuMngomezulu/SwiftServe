import { useState } from 'react';
import api from '../services/api';

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
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (type === 'file') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        const { name, description, price, category, quantity, image } = formData;
        if (!name || !description || !price || !category || !quantity || !image) {
            return 'All fields are required.';
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
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        setLoading(true);
        try {
            await api.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSuccess();
            setFormData({ name: '', description: '', price: '', category: '', quantity: '', is_active: true, image: null });
            setError('');
        } catch (err) {
            setError('Failed to add product. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-50 shadow-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="input" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input" />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="input" />
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="input" />
            <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="input" />
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="input" />
            <label>
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                Active
            </label>
            <button type="submit" className="auth-button mt-4" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
            </button>
        </form>
    );
};

export default AddProductForm;
