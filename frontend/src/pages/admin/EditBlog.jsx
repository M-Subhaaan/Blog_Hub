import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogAPI } from '../../services/api';
import CustomAlert from '../../components/CustomAlert';
import './BlogForm.css';

const EditBlog = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        topic: 'tech',
        thumbnail: null,
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await blogAPI.getById(id);
            const blog = response.data.data.blog;
            setFormData({
                title: blog.title,
                content: blog.content,
                topic: blog.topic,
                thumbnail: null,
            });
            if (blog.thumbnail?.url) {
                setPreview(blog.thumbnail.url);
            }
            setFetchLoading(false);
        } catch (err) {
            setError('Failed to load blog');
            setFetchLoading(false);
        }
    };

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
                thumbnail: file
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

        const data = new FormData();
        data.append('title', formData.title);
        data.append('topic', formData.topic);
        data.append('content', formData.content);
        if (formData.thumbnail) {
            data.append('thumbnail', formData.thumbnail);
        }

        try {
            await blogAPI.update(id, data);
            showAlert('Blog updated successfully!', 'success');
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update blog');
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading blog...</p>
            </div>
        );
    }

    return (
        <div className="blog-form-page">
            <div className="container">
                <div className="form-header">
                    <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
                        ← Back to Dashboard
                    </button>
                    <h1>Edit Blog</h1>
                </div>

                <div className="form-container">
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="thumbnail-upload-section">
                            <label>Blog Thumbnail</label>
                            <div className="thumbnail-preview-container">
                                {preview ? (
                                    <img src={preview} alt="Thumbnail Preview" className="thumbnail-preview" />
                                ) : (
                                    <div className="thumbnail-placeholder">
                                        <span>Click to upload image</span>
                                        <small>(1200 x 600 recommended)</small>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="thumbnail"
                                    name="thumbnail"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="thumbnail-input"
                                />
                            </div>
                        </div>

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
                                {loading ? 'Updating...' : 'Update Blog'}
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

export default EditBlog;

