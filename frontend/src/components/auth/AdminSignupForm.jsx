import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AdminSignupForm = ({ onClose, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        secretKey: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signupAdmin } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signupAdmin(formData);

        setLoading(false);

        if (result.success) {
            onClose();
            window.location.href = '/admin/dashboard';
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h2>Admin Signup</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                            minLength="8"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="secretKey">Admin Secret Key</label>
                        <input
                            type="password"
                            id="secretKey"
                            name="secretKey"
                            value={formData.secretKey}
                            onChange={handleChange}
                            placeholder="Enter admin secret key"
                            required
                        />
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Contact your administrator for the secret key
                        </small>
                    </div>

                    <button type="submit" className="btn btn-secondary w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up as Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSignupForm;
