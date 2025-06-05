import { useState } from 'react';
import { walletApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/layout'; 

const DepositPage = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDeposit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await walletApi.deposit(parseFloat(amount));
            navigate('/wallet');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to deposit funds');
        } finally {
            setLoading(false);
        }
    };

    return (

        <Layout>
        <div className="deposit-page">
            <h1>Add Funds to Wallet</h1>
            <form onSubmit={handleDeposit}>
                <div className="form-group">
                    <label htmlFor="amount">Amount (R)</label>
                    <input
                        type="number"
                        id="amount"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Deposit'}
                </button>
            </form>
            </div>
        </Layout>
    );
};

export default DepositPage;
