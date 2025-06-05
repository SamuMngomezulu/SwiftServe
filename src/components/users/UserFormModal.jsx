// src/components/users/UserFormModal.jsx
import React, { useState, useEffect } from 'react';

const UserFormModal = ({
    show,
    onClose,
    onSubmit,
    isEdit,
    initialData = {}
}) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleID: 3
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                email: initialData.email,
                password: '',
                confirmPassword: '',
                roleID: initialData.roleID
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                roleID: 3
            });
        }
    }, [isEdit, initialData, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword && !isEdit) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.password && formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }


        onSubmit(formData);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="user-form-modal">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="roleID"
                            className="form-control"
                            value={formData.roleID}
                            onChange={handleChange}
                            required
                        >
                            <option value="1">Super User</option>
                            <option value="2">Admin</option>
                            <option value="3">User</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEdit}
                            minLength={8}
                        />
                        <small className="form-text text-muted">
                            {isEdit
                                ? 'Leave blank to keep current password'
                                : 'Minimum 8 characters'}
                        </small>
                    </div>

                    {!isEdit && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEdit ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;