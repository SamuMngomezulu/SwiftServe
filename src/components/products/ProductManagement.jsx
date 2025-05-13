import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddProductForm from './AddProductForm';
import '../styles/productManagement.css';
import ProductTable from './ProductTable';

const ProductManagement = () => {
    const { hasRole, ROLE_KEYS } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="product-management-container">
            <div className="product-management-header">
                <h1>Product Management</h1>
                {(hasRole(ROLE_KEYS.ADMIN) || hasRole(ROLE_KEYS.SUPER_USER)) && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="add-product-toggle-btn"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Product'}
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="add-product-section">
                    <AddProductForm onSuccess={() => {
                        setShowAddForm(false);
                    }} />
                </div>
            )}

            <ProductTable />
        </div>
    );
};

export default ProductManagement;