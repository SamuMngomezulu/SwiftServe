// components/WalletBalance.jsx
import { useEffect, useState } from 'react';
import { walletApi } from '../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

const WalletBalance = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await walletApi.getBalance();
                setBalance(response.data);
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, []);

    return (
        <div className="wallet-balance">
            <h4>Wallet Balance</h4>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <p className="balance-amount">{formatCurrency(balance)}</p>
            )}
        </div>
    );
};

export default WalletBalance;
