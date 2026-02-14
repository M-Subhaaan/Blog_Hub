import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from '../../components/CustomAlert';
import ConfirmDialog from '../../components/ConfirmDialog';
import ChangePasswordModal from '../../components/auth/ChangePasswordModal';
import UpdateProfileModal from '../../components/auth/UpdateProfileModal';
import ProfileMenu from '../../components/auth/ProfileMenu';
import './AdminDashboard.css';


const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [view, setView] = useState('blogs'); // 'blogs' or 'users'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showUpdateProfile, setShowUpdateProfile] = useState(false);
    const [alert, setAlert] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);


    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [blogsRes, usersRes] = await Promise.all([
                blogAPI.getAll(),
                userAPI.getAll()
            ]);
            setBlogs(blogsRes.data.data.blogs);
            setUsers(usersRes.data.data.users);
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    const handleDeleteBlog = (id, title) => {
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

    const handleDeleteUser = (id, name) => {
        if (id === user._id) {
            showAlert("You cannot delete yourself", "error");
            return;
        }
        setConfirmDialog({
            message: `Are you sure you want to delete user "${name}"?`,
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    await userAPI.delete(id);
                    setUsers(users.filter((u) => u._id !== id));
                    showAlert('User deleted successfully', 'success');
                } catch (err) {
                    showAlert(err.response?.data?.message || 'Failed to delete user', 'error');
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
                        {user && (
                            <ProfileMenu
                                onUpdateProfile={() => setShowUpdateProfile(true)}
                                onChangePassword={() => setShowChangePassword(true)}
                            />
                        )}
                        <h1 className="admin-logo">⚡ Admin Dashboard</h1>
                        <div className="admin-header-actions">
                            <div className="admin-user-profile">
                                <div className="admin-avatar">
                                    {user?.profilePic?.url ? (
                                        <img src={user.profilePic.url} alt={user.name} />
                                    ) : (
                                        <div className="avatar-placeholder-small">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="admin-greeting">
                                    Welcome, <strong>{user?.name}</strong>
                                </span>
                            </div>


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
                        <div className="dashboard-tabs">
                            <button
                                className={`tab-btn ${view === 'blogs' ? 'active' : ''}`}
                                onClick={() => setView('blogs')}
                            >
                                Blogs ({blogs.length})
                            </button>
                            <button
                                className={`tab-btn ${view === 'users' ? 'active' : ''}`}
                                onClick={() => setView('users')}
                            >
                                Users ({users.length})
                            </button>
                        </div>
                        {view === 'blogs' && (
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/admin/blog/new')}
                            >
                                + Create New Blog
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {view === 'blogs' ? (
                        blogs.length === 0 ? (
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
                                                            onClick={() => handleDeleteBlog(blog._id, blog.title)}
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
                        )
                    ) : (
                        users.length === 0 ? (
                            <div className="empty-state">
                                <h3>No users found</h3>
                                <p>This is strange, there should be at least one admin!</p>
                            </div>
                        ) : (
                            <div className="blogs-table-container">
                                <table className="blogs-table">
                                    <thead>
                                        <tr>
                                            <th>Avatar</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u._id}>
                                                <td>
                                                    <div className="table-avatar">
                                                        {u.profilePic?.url ? (
                                                            <img src={u.profilePic.url} alt={u.name} />
                                                        ) : (
                                                            <div className="avatar-placeholder-xs">
                                                                {u.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge ${u.role}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-icon btn-delete"
                                                            onClick={() => handleDeleteUser(u._id, u.name)}
                                                            title="Delete User"
                                                            disabled={u._id === user._id}
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
                        )
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

            {showChangePassword && (
                <ChangePasswordModal
                    onClose={() => setShowChangePassword(false)}
                    onShowAlert={showAlert}
                />
            )}

            {showUpdateProfile && (
                <UpdateProfileModal
                    onClose={() => setShowUpdateProfile(false)}
                    onShowAlert={showAlert}
                />
            )}
        </div>

    );
};

export default AdminDashboard;
