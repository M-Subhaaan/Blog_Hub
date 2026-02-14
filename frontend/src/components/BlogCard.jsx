import { useNavigate } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ blog }) => {
    const navigate = useNavigate();

    const getTopicColor = (topic) => {
        const colors = {
            tech: '#6366f1',
            health: '#10b981',
            business: '#f59e0b',
            islamic: '#ec4899',
        };
        return colors[topic] || '#6366f1';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="blog-card" onClick={() => navigate(`/blog/${blog._id}`)}>
            <div className="blog-card-thumbnail">
                {blog.thumbnail?.url ? (
                    <img src={blog.thumbnail.url} alt={blog.title} />
                ) : (
                    <div className="thumbnail-placeholder-small">📝</div>
                )}
            </div>
            <div className="blog-card-header">
                <span
                    className="blog-topic"
                    style={{ backgroundColor: getTopicColor(blog.topic) }}
                >
                    {blog.topic}
                </span>
                <span className="blog-date">{formatDate(blog.createdAt)}</span>
            </div>



            <h3 className="blog-title">{blog.title}</h3>

            <p className="blog-excerpt">
                {blog.content.substring(0, 150)}
                {blog.content.length > 150 ? '...' : ''}
            </p>

            <div className="blog-card-footer">
                <div className="blog-stats">
                    <span className="stat">
                        <span className="stat-icon">👍</span>
                        {blog.likesCount || 0}
                    </span>
                    <span className="stat">
                        <span className="stat-icon">👎</span>
                        {blog.dislikesCount || 0}
                    </span>
                </div>
                <button className="read-more-btn">
                    Read More →
                </button>
            </div>
        </div>
    );
};

export default BlogCard;
