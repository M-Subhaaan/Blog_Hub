import { useState } from 'react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const UpdateProfileModal = ({ onClose, onShowAlert }) => {
    const { user, updateUserData } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(user?.profilePic?.url || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        if (profilePic) {
            formData.append('profilePic', profilePic);
        }

        try {
            const response = await authAPI.updateProfile(formData);
            if (response.data.status === 'Success') {
                const { token, body } = response.data;
                // Update local storage and context
                if (token) {
                    localStorage.setItem('token', token);
                }
                updateUserData(body.user);
                onShowAlert('Profile updated successfully!', 'success');
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Update Profile</h2>
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Profile Picture</label>
                        <div className="profile-upload-section">
                            <div className="avatar-preview">
                                {preview ? (
                                    <img src={preview} alt="Preview" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {name.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>
                            <div className="file-input-wrapper">
                                <label htmlFor="profilePic" className="btn btn-outline btn-sm">
                                    Choose Photo
                                </label>
                                <input
                                    type="file"
                                    id="profilePic"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
