// src/components/users/AddFundsModal.jsx
import React, { useState, useEffect } from 'react';


const AddFundsModal = ({ show, onClose, onSubmit, user }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!show) {
            setAmount(''); // Clear amount when modal closes
            setError(''); // Clear error when modal closes
        }
    }, [show]);

    const handleChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            setError('Please enter a valid amount greater than zero.');
            return;
        }

        onSubmit(depositAmount);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Funds to {user?.firstName} {user?.lastName}'s Wallet</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="depositAmount">Amount (R)</label>
                        <input
                            type="number"
                            id="depositAmount"
                            className="form-control"
                            value={amount}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Funds
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFundsModal;