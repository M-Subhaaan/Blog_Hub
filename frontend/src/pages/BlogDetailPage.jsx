import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI, commentAPI, reactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import CustomAlert from '../components/CustomAlert';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reactionLoading, setReactionLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchBlogAndComments();
    }, [id]);

    const fetchBlogAndComments = async () => {
        try {
            const [blogRes, commentsRes] = await Promise.all([
                blogAPI.getById(id),
                commentAPI.getAll(id),
            ]);

            setBlog(blogRes.data.data.blog);
            setComments(commentsRes.data.data.comments || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to load blog');
            setLoading(false);
        }
    };

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    const handleLike = async () => {
        if (!user) {
            showAlert('Please login to like this blog', 'warning');
            return;
        }

        if (user.role !== 'user') {
            showAlert('Only users can like blogs', 'warning');
            return;
        }

        setReactionLoading(true);
        try {
            await reactionAPI.like(id);
            // Refresh blog to get updated counts
            const response = await blogAPI.getById(id);
            setBlog(response.data.data.blog);
        } catch (err) {
            showAlert(err.response?.data?.message || 'Failed to like blog', 'error');
        }
        setReactionLoading(false);
    };

    const handleDislike = async () => {
        if (!user) {
            showAlert('Please login to dislike this blog', 'warning');
            return;
        }

        if (user.role !== 'user') {
            showAlert('Only users can dislike blogs', 'warning');
            return;
        }

        setReactionLoading(true);
        try {
            await reactionAPI.dislike(id);
            // Refresh blog to get updated counts
            const response = await blogAPI.getById(id);
            setBlog(response.data.data.blog);
        } catch (err) {
            showAlert(err.response?.data?.message || 'Failed to dislike blog', 'error');
        }
        setReactionLoading(false);
    };

    const handleCommentAdded = (newComment) => {
        setComments([...comments, newComment]);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading blog...</p>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="error-container">
                <h2>Blog not found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Go Home
                </button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getTopicColor = (topic) => {
        const colors = {
            tech: '#6366f1',
            health: '#10b981',
            business: '#f59e0b',
            islamic: '#ec4899',
        };
        return colors[topic] || '#6366f1';
    };

    return (
        <div className="blog-detail-page">
            <div className="blog-header">
                <div className="container">
                    <button className="back-button" onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                </div>
            </div>

            <article className="blog-content">
                <div className="container">
                    <div className="blog-meta">
                        <span
                            className="blog-topic-badge"
                            style={{ backgroundColor: getTopicColor(blog.topic) }}
                        >
                            {blog.topic}
                        </span>
                        <span className="blog-date-text">{formatDate(blog.createdAt)}</span>
                    </div>

                    <h1 className="blog-title-main">{blog.title}</h1>

                    <div className="blog-detail-thumbnail">
                        {blog.thumbnail?.url && (
                            <img src={blog.thumbnail.url} alt={blog.title} />
                        )}
                    </div>

                    <div className="blog-author-info">
                        <div className="author-avatar">
                            {blog.author?.profilePic?.url ? (
                                <img src={blog.author.profilePic.url} alt={blog.author.name} />
                            ) : (
                                <div className="avatar-placeholder-sm">
                                    {blog.author?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="author-details">
                            <span className="author-name">By {blog.author?.name}</span>
                            <span className="author-role">{blog.author?.role}</span>
                        </div>
                    </div>

                    <div className="blog-body">
                        <p>{blog.content}</p>
                    </div>

                    <div className="blog-reactions">
                        <button
                            className={`reaction-btn ${reactionLoading ? 'disabled' : ''}`}
                            onClick={handleLike}
                            disabled={reactionLoading}
                        >
                            <span className="reaction-icon">👍</span>
                            <span className="reaction-count">{blog.likesCount || 0}</span>
                            <span className="reaction-label">Like</span>
                        </button>

                        <button
                            className={`reaction-btn ${reactionLoading ? 'disabled' : ''}`}
                            onClick={handleDislike}
                            disabled={reactionLoading}
                        >
                            <span className="reaction-icon">👎</span>
                            <span className="reaction-count">{blog.dislikesCount || 0}</span>
                            <span className="reaction-label">Dislike</span>
                        </button>
                    </div>

                    <CommentSection
                        blogId={id}
                        comments={comments}
                        onCommentAdded={handleCommentAdded}
                    />
                </div>
            </article>

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

export default BlogDetailPage;

