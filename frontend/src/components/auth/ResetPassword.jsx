import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import CustomAlert from '../CustomAlert';
import './AuthModal.css';

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword(token, { newpassword: newPassword });
            showAlert('Password reset successful! You can now log in with your new password.', 'success');
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            showAlert(err.response?.data?.message || 'Token is invalid or has expired.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal glass">
                <button className="close-btn" onClick={() => navigate('/')}>&times;</button>
                <div className="modal-header">
                    <h2>Reset Password</h2>
                </div>
                <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Min 8 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength="8"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Repeat new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength="8"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <div className="modal-footer">
                        <p>
                            Something went wrong?{' '}
                            <button type="button" className="link-btn" onClick={() => navigate('/')}>
                                Go Home
                            </button>
                        </p>
                    </div>
                </form>
            </div>

            {alert && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={closeAlert}
                />
            )}
        </div>
    );
};

export default ResetPassword;
