import React from 'react';

const StatusUpdateModal = ({ currentStatus, statuses, onUpdate, onClose }) => {
    const [selectedStatus, setSelectedStatus] = React.useState(currentStatus);

    React.useEffect(() => {
        setSelectedStatus(currentStatus);
    }, [currentStatus]);

    const handleStatusChange = (e) => {
        setSelectedStatus(parseInt(e.target.value));
    };

    const handleSubmit = () => {
        if (selectedStatus && selectedStatus !== currentStatus) {
            onUpdate(selectedStatus);
        }
    };

    const currentStatusObj = statuses.find(s => s.orderStatusID === currentStatus);

    return (
        <div className="modal-overlay">
            <div className="status-update-modal">
                <div className="modal-header">
                    <h3>Update Order Status</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="status-info">
                        <p><strong>Current Status:</strong> {currentStatusObj?.statusName || 'Unknown'}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status-select">New Status:</label>
                        <select
                            id="status-select"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="form-control"
                        >
                            <option value="">Select new status</option>
                            {statuses.map(status => (
                                <option 
                                    key={status.orderStatusID} 
                                    value={status.orderStatusID}
                                    disabled={status.orderStatusID === currentStatus}
                                >
                                    {status.statusName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedStatus || selectedStatus === currentStatus}
                        className="btn btn-primary"
                    >
                        Update Status
                    </button>
                    <button onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal;