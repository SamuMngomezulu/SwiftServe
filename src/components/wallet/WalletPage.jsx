import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { walletApi } from '../services/api';
import '../styles/wallet.css';
import { formatCurrency } from '../../utils/formatCurrency';
import Layout from '../layout/layout';
import OrderDetailsModal from '../pages/OrderDetailsModal'; // Adjust path as needed

const WalletPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [balance, setBalance] = useState(0);
    const [selectedOrderIdForDetails, setSelectedOrderIdForDetails] = useState(null);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const balanceRes = await walletApi.getBalance();
                setBalance(balanceRes.data);

                let transactionsRes;
                if (activeTab === 'all') {
                    transactionsRes = await walletApi.getTransactions();
                } else if (activeTab === 'deposits') {
                    transactionsRes = await walletApi.getDeposits();
                } else {
                    transactionsRes = await walletApi.getPurchases();
                }
                setTransactions(transactionsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleViewOrderDetails = (orderId) => {
        setSelectedOrderIdForDetails(orderId);
        setShowOrderDetailsModal(true);
    };

    const handleCloseOrderDetailsModal = () => {
        setSelectedOrderIdForDetails(null);
        setShowOrderDetailsModal(false);
    };

    return (
        <Layout>
            <div className="wallet-container">
                <div className="wallet-header">
                    <h1>Wallet</h1>
                    <div className="balance-display">
                        <span>Available Balance:</span>
                        <span className="balance-amount">{formatCurrency(balance)}</span>
                    </div>
                </div>

                <div className="transaction-section">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Transactions
                        </button>
                        <button
                            className={`tab ${activeTab === 'deposits' ? 'active' : ''}`}
                            onClick={() => setActiveTab('deposits')}
                        >
                            Deposits
                        </button>
                        <button
                            className={`tab ${activeTab === 'purchases' ? 'active' : ''}`}
                            onClick={() => setActiveTab('purchases')}
                        >
                            Purchases
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading transactions...</p>
                        </div>
                    ) : (
                        <div className="transactions-table">
                            <div className="table-header">
                                <div className="header-cell">Date</div>
                                <div className="header-cell">Type</div>
                                <div className="header-cell">Amount</div>
                                <div className="header-cell">Status</div>
                                <div className="header-cell">Details</div>
                            </div>

                            {transactions.length === 0 ? (
                                <div className="no-transactions">
                                    No transactions found
                                </div>
                            ) : (
                                transactions.map((transaction) => (
                                    <div key={transaction.transactionID} className="transaction-row">
                                        <div className="cell">{formatDate(transaction.date)}</div>
                                        <div className="cell">
                                            <span className={`type-badge ${transaction.typeName.toLowerCase()}`}>
                                                {transaction.typeName}
                                            </span>
                                        </div>
                                        <div className={`cell amount ${transaction.typeName === 'Deposit' ? 'positive' : 'negative'}`}>
                                            {transaction.typeName === 'Deposit' ? '+' : '-'}
                                            {formatCurrency(transaction.transactionAmount)}
                                        </div>
                                        <div className="cell">
                                            <span className={`status-badge ${transaction.statusName.toLowerCase()}`}>
                                                {transaction.statusName}
                                            </span>
                                        </div>
                                        <div className="cell">
                                            {transaction.orderID && (
                                                <button
                                                    className="details-btn"
                                                    onClick={() => handleViewOrderDetails(transaction.orderID)}
                                                >
                                                    View Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <OrderDetailsModal
                orderId={selectedOrderIdForDetails}
                isOpen={showOrderDetailsModal}
                onClose={handleCloseOrderDetailsModal}
            />
        </Layout>
    );
};

export default WalletPage;
