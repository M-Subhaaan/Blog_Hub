import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../../services/api';
import CustomAlert from '../../components/CustomAlert';
import './BlogForm.css';

const CreateBlog = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        topic: 'tech',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
        if (alert?.type === 'success') {
            navigate('/admin/dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await blogAPI.create(formData);
            showAlert('Blog created successfully!', 'success');
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create blog');
            setLoading(false);
        }
    };

    return (
        <div className="blog-form-page">
            <div className="container">
                <div className="form-header">
                    <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
                        ← Back to Dashboard
                    </button>
                    <h1>Create New Blog</h1>
                </div>

                <div className="form-container">
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter blog title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="topic">Topic *</label>
                            <select
                                id="topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                required
                            >
                                <option value="tech">Tech</option>
                                <option value="health">Health</option>
                                <option value="business">Business</option>
                                <option value="islamic">Islamic</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Content *</label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your blog content here..."
                                rows="15"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => navigate('/admin/dashboard')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Blog'}
                            </button>
                        </div>
                    </form>
                </div>
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

export default CreateBlog;
