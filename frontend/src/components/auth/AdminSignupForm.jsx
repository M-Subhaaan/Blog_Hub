import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AdminSignupForm = ({ onClose, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        secretKey: '',
        profilePic: ''
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signupAdmin } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return;
            }

            setFormData({
                ...formData,
                profilePic: file
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('secretKey', formData.secretKey);
        if (formData.profilePic) {
            data.append('profilePic', formData.profilePic);
        }

        const result = await signupAdmin(data);

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
                    <div className="profile-upload-section">
                        <div className="avatar-preview">
                            {preview ? (
                                <img src={preview} alt="Profile Preview" />
                            ) : (
                                <div className="avatar-placeholder">👤</div>
                            )}
                        </div>
                        <div className="file-input-wrapper">
                            <label htmlFor="adminProfilePic" className="btn btn-outline btn-sm">
                                {preview ? 'Change Photo' : 'Upload Photo'}
                            </label>
                            <input
                                type="file"
                                id="adminProfilePic"
                                name="profilePic"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

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
