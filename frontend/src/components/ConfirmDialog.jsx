import './ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="custom-alert-overlay" onClick={onCancel}>
            <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
                <div className="alert-icon alert-icon-confirm">
                    ?
                </div>
                <p className="alert-message">{message}</p>
                <div className="confirm-actions">
                    <button className="confirm-btn-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-btn-ok" onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
