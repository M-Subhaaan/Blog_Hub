import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import CustomAlert from '../CustomAlert';
import './AuthModal.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
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
        setLoading(true);
        // Removed setError and setMessage calls as they are no longer defined

        try {
            const response = await authAPI.forgetPassword({ email });
            showAlert(response.data.message || 'Check Your Mail to reset the Password', 'success');
        } catch (err) {
            showAlert(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal glass">
                <button className="close-btn" onClick={() => navigate('/')}>&times;</button>
                <div className="modal-header">
                    <h2>Forgot Password</h2>
                </div>
                <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Enter your email and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="modal-footer">
                        <p>
                            Remembered your password?{' '}
                            <button type="button" className="link-btn" onClick={() => navigate('/')}>
                                Back to Login
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

export default ForgotPassword;
