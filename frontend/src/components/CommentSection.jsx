import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentAPI } from '../services/api';
import CustomAlert from './CustomAlert';
import './CommentSection.css';

const CommentSection = ({ blogId, comments, onCommentAdded }) => {
    const { user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showAlert('Please login to comment', 'warning');
            return;
        }

        if (user.role !== 'user') {
            showAlert('Only users can comment on blogs', 'warning');
            return;
        }

        if (!commentText.trim()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await commentAPI.create(blogId, { comment: commentText });
            onCommentAdded(response.data.data.comment);
            setCommentText('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment');
        }

        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="comment-section">
            <h3 className="comment-section-title">
                Comments ({comments.length})
            </h3>

            {user && user.role === 'user' && (
                <form className="comment-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <textarea
                        className="comment-input"
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows="4"
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !commentText.trim()}
                    >
                        {loading ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}

            {!user && (
                <div className="comment-login-prompt">
                    <p>Please login as a user to leave a comment</p>
                </div>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="no-comments">
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-author">
                                    <div className="comment-avatar">
                                        {comment.user?.profilePic?.url ? (
                                            <img src={comment.user.profilePic.url} alt={comment.user.name} />
                                        ) : (
                                            <div className="avatar-placeholder-xs">
                                                {comment.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="author-name">
                                        {comment.user?.name || 'Anonymous'}
                                    </span>
                                </div>
                                <span className="comment-date">
                                    {formatDate(comment.createdAt)}
                                </span>
                            </div>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    ))
                )}
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

export default CommentSection;

