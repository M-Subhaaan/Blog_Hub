import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const UserSignupForm = ({ onClose, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profilePic: ''
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signupUser } = useAuth();

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
        if (formData.profilePic) {
            data.append('profilePic', formData.profilePic);
        }

        const result = await signupUser(data);

        setLoading(false);

        if (result.success) {
            onClose();
            window.location.href = '/';
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h2>User Signup</h2>
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
                            <label htmlFor="profilePic" className="btn btn-outline btn-sm">
                                {preview ? 'Change Photo' : 'Upload Photo'}
                            </label>
                            <input
                                type="file"
                                id="profilePic"
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

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserSignupForm;
