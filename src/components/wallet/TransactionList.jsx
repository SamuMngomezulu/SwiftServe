const TransactionList = ({ transactions }) => {
    if (transactions.length === 0) {
        return <p>No transactions found</p>;
    }

    return (
        <div className="transaction-list">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.transactionID}>
                            <td>{new Date(transaction.date).toLocaleString()}</td>
                            <td>{transaction.typeName}</td>
                            <td>${transaction.transactionAmount.toFixed(2)}</td>
                            <td>{transaction.statusName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;