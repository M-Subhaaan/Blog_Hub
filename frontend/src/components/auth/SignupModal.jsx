import { useState } from 'react';
import UserSignupForm from './UserSignupForm';
import AdminSignupForm from './AdminSignupForm';
import './AuthModal.css';

const SignupModal = ({ onClose, onSwitchToLogin }) => {
    const [signupType, setSignupType] = useState(null); // null, 'user', or 'admin'

    if (signupType === 'user') {
        return <UserSignupForm onClose={onClose} onBack={() => setSignupType(null)} />;
    }

    if (signupType === 'admin') {
        return <AdminSignupForm onClose={onClose} onBack={() => setSignupType(null)} />;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Join Us</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <p className="text-center mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Choose how you want to sign up
                </p>

                <div className="signup-options">
                    <button
                        className="signup-option-card"
                        onClick={() => setSignupType('user')}
                    >
                        <div className="option-icon">👤</div>
                        <h3>Sign up as User</h3>
                        <p>Create, comment, like and engage with blogs</p>
                    </button>

                    <button
                        className="signup-option-card"
                        onClick={() => setSignupType('admin')}
                    >
                        <div className="option-icon">⚡</div>
                        <h3>Sign up as Admin</h3>
                        <p>Manage and create blog content</p>
                    </button>
                </div>

                <div className="modal-footer">
                    <p>
                        Already have an account?{' '}
                        <button className="link-btn" onClick={onSwitchToLogin}>
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupModal;
