import './CustomAlert.css';

const CustomAlert = ({ message, type = 'info', onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'confirm':
                return '?';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="custom-alert-overlay" onClick={onClose}>
            <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
                <div className={`alert-icon alert-icon-${type}`}>
                    {getIcon()}
                </div>
                <p className="alert-message">{message}</p>
                <button className="alert-close-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default CustomAlert;
