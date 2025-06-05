// src/components/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { Link } from 'react-router-dom';
import Layout from '../layout/layout';
import { formatCurrency } from '../../utils/formatCurrency';
import UserFormModal from './UserFormModal'; // Import the user form modal
import AddFundsModal from './AddFundsModal'; // Import the new add funds modal
import { walletApi } from '../services/api'; // Import walletApi

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // For UserFormModal
    const [isEdit, setIsEdit] = useState(false); // For UserFormModal
    const [currentUser, setCurrentUser] = useState(null); // For UserFormModal

    const [showAddFundsModal, setShowAddFundsModal] = useState(false); // New state for AddFundsModal
    const [selectedUserForFunds, setSelectedUserForFunds] = useState(null); // New state for selected user


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await userService.getAllUsers();
        if (result.success) {
            setUsers(result.data);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const result = await userService.deleteUser(userId);
            if (result.success) {
                setUsers(users.filter(user => user.userID !== userId));
            } else {
                alert(result.message || 'Failed to delete user.');
            }
        }
    };

    const handleEditUserClick = (user) => {
        setIsEdit(true);
        setCurrentUser(user);
        setShowModal(true);
    };

    const handleCreateUserClick = () => {
        setIsEdit(false);
        setCurrentUser(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentUser(null);
        fetchUsers(); // Refresh users after modal closes (create/edit)
    };

    const handleModalSubmit = async (formData) => {
        setLoading(true);
        let result;
        if (isEdit) {
            result = await userService.updateUser(currentUser.userID, formData);
        } else {
            result = await userService.createUser(formData);
        }

        if (result.success) {
            handleModalClose();
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    // New functions for Add Funds Modal
    const handleAddFundsClick = (user) => {
        setSelectedUserForFunds(user);
        setShowAddFundsModal(true);
    };

    const handleAddFundsModalClose = () => {
        setShowAddFundsModal(false);
        setSelectedUserForFunds(null);
        fetchUsers(); // Refresh users after adding funds to update balance
    };

    const handleAddFundsSubmit = async (amount) => {
        if (!selectedUserForFunds) return;

        setLoading(true);
        try {
            const result = await walletApi.depositByAdmin(selectedUserForFunds.userID, amount);
            if (result.status === 200) {
                alert(result.data.message); // Show success message from backend
                handleAddFundsModalClose();
            } else {
                setError(result.data?.message || 'Failed to add funds.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add funds.');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <Layout><p>Loading users...</p></Layout>;
    }

    if (error) {
        return <Layout><p className="error">Error: {error}</p></Layout>;
    }

    return (
        <Layout>
            <div className="user-list-container">
                <h1>User Management</h1>
                <Link to="#" onClick={handleCreateUserClick} className="btn btn-primary mb-3">
                    Create New User
                </Link>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Balance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userID}>
                                    <td>{user.userID}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{formatCurrency(user.balance)}</td>
                                    <td>
                                        <button onClick={() => handleEditUserClick(user)} className="btn btn-sm btn-info mr-2">Edit</button>
                                        <button onClick={() => handleDelete(user.userID)} className="btn btn-sm btn-danger mr-2">Delete</button>
                                        <button onClick={() => handleAddFundsClick(user)} className="btn btn-sm btn-success">Add Funds</button> {/* New Button */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserFormModal
                show={showModal}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                isEdit={isEdit}
                initialData={currentUser}
            />

            {/* New Add Funds Modal */}
            <AddFundsModal
                show={showAddFundsModal}
                onClose={handleAddFundsModalClose}
                onSubmit={handleAddFundsSubmit}
                user={selectedUserForFunds}
            />
        </Layout>
    );
};

export default UserList;