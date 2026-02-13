import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import ConfirmDialog from '../../components/ConfirmDialog';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await blogAPI.getAll();
            setBlogs(response.data.data.blogs);
            setLoading(false);
        } catch (err) {
            setError('Failed to load blogs');
            setLoading(false);
        }
    };

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    const handleDelete = (id, title) => {
        setConfirmDialog({
            message: `Are you sure you want to delete "${title}"?`,
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    await blogAPI.delete(id);
                    setBlogs(blogs.filter((blog) => blog._id !== id));
                    showAlert('Blog deleted successfully', 'success');
                } catch (err) {
                    showAlert(err.response?.data?.message || 'Failed to delete blog', 'error');
                }
            },
            onCancel: () => setConfirmDialog(null),
        });
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header glass">
                <div className="container">
                    <div className="admin-header-content">
                        <h1 className="admin-logo">⚡ Admin Dashboard</h1>
                        <div className="admin-header-actions">
                            <span className="admin-greeting">
                                Welcome, <strong>{user?.name}</strong>
                            </span>
                            <button className="btn btn-outline" onClick={() => navigate('/')}>
                                View Site
                            </button>
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="admin-content">
                <div className="container">
                    <div className="dashboard-header">
                        <div>
                            <h2>Manage Blogs</h2>
                            <p className="dashboard-subtitle">
                                Total Blogs: <strong>{blogs.length}</strong>
                            </p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/admin/blog/new')}
                        >
                            + Create New Blog
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {blogs.length === 0 ? (
                        <div className="empty-state">
                            <h3>No blogs yet</h3>
                            <p>Create your first blog post to get started</p>
                            <button
                                className="btn btn-primary mt-2"
                                onClick={() => navigate('/admin/blog/new')}
                            >
                                Create Blog
                            </button>
                        </div>
                    ) : (
                        <div className="blogs-table-container">
                            <table className="blogs-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Topic</th>
                                        <th>Likes</th>
                                        <th>Dislikes</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs.map((blog) => (
                                        <tr key={blog._id}>
                                            <td className="blog-title-cell">{blog.title}</td>
                                            <td>
                                                <span className="topic-badge" data-topic={blog.topic}>
                                                    {blog.topic}
                                                </span>
                                            </td>
                                            <td>{blog.likesCount || 0}</td>
                                            <td>{blog.dislikesCount || 0}</td>
                                            <td>{formatDate(blog.createdAt)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-icon btn-edit"
                                                        onClick={() => navigate(`/admin/blog/edit/${blog._id}`)}
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn-icon btn-delete"
                                                        onClick={() => handleDelete(blog._id, blog.title)}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {alert && (
                <CustomAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={closeAlert}
                />
            )}

            {confirmDialog && (
                <ConfirmDialog
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={confirmDialog.onCancel}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
