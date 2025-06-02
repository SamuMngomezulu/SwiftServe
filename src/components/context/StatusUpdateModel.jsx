import { useState } from 'react';

const StatusUpdateModal = ({ currentStatus, statuses, onUpdate, onClose }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Update Order Status</h3>
                <p>Current status: {currentStatus}</p>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="">Select new status</option>
                    {statuses.map(status => (
                        <option key={status.orderStatusID} value={status.orderStatusID}>
                            {status.statusName}
                        </option>
                    ))}
                </select>

                <div className="modal-actions">
                    <button onClick={() => onUpdate(selectedStatus)} disabled={!selectedStatus}>
                        Update
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal;