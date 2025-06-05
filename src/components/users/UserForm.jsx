// src/components/users/UserForm.jsx
import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = ({ isEdit }) => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleID: 3
    });

    useEffect(() => {
        if (isEdit) {
            const fetchUser = async () => {
                const result = await userService.getUserById(userId);
                if (result.success) {
                    setFormData({
                        firstName: result.data.firstName,
                        lastName: result.data.lastName,
                        email: result.data.email,
                        password: '',
                        confirmPassword: '',
                        roleID: result.data.role === 'Super User' ? 1 :
                            result.data.role === 'Admin' ? 2 : 3
                    });
                } else {
                    setError(result.message);
                }
                setLoading(false);
            };
            fetchUser();
        }
    }, [isEdit, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        let result;
        if (isEdit) {
            result = await userService.updateUser(userId, formData);
        } else {
            result = await userService.createUser(formData);
        }

        if (result.success) {
            navigate('/users');
        } else {
            setError(result.message);
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (error && !isEdit) return <div className="container mt-4 alert alert-danger">Error: {error}</div>;


    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="user-form">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        className="form-control"
                        name="roleID"
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
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEdit}
                        minLength="8"
                    />
                    <small className="form-text text-muted">
                        {isEdit ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
                    </small>
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={!isEdit}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    {isEdit ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;