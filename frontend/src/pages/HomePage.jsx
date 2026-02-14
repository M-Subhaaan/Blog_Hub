import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignupModal";
import ChangePasswordModal from "../components/auth/ChangePasswordModal";
import UpdateProfileModal from "../components/auth/UpdateProfileModal";
import ProfileMenu from "../components/auth/ProfileMenu";
import BlogCard from "../components/BlogCard";
import CustomAlert from "../components/CustomAlert";
import Skeleton from "../components/Skeleton";
import "./HomePage.css";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");

  const [alert, setAlert] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Filter blogs based on search category
    if (searchCategory === "" || searchCategory === "all") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (blog) => blog.topic.toLowerCase() === searchCategory.toLowerCase(),
      );
      setFilteredBlogs(filtered);
    }
  }, [searchCategory, blogs]);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAll();
      setBlogs(response.data.data.blogs);
      setFilteredBlogs(response.data.data.blogs);
      setLoading(false);
    } catch (err) {
      setError("Failed to load blogs");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  if (loading) {
    return (
      <div className="home-page">
        <header className="header glass">
          <div className="container">
            <div className="header-content">
              <h1 className="logo">📝 Blog Hub</h1>
            </div>
          </div>
        </header>
        <main className="main-content">
          <div className="container">
            <div className="hero-section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Skeleton type="title" />
              </div>
              <Skeleton type="text" />
              <Skeleton type="text" />
            </div>
            <div className="blogs-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="blog-card"
                  style={{ cursor: "default" }}
                >
                  <div className="blog-card-header">
                    <Skeleton type="avatar" />
                    <div
                      style={{
                        width: "100px",
                        height: "16px",
                        background: "#1e293b",
                        borderRadius: "4px",
                      }}
                    ></div>
                  </div>
                  <Skeleton type="title" />
                  <Skeleton type="text" />
                  <Skeleton type="text" />
                  <Skeleton type="text" />
                  <div className="blog-card-footer" style={{ border: "none" }}>
                    <div
                      style={{
                        width: "80px",
                        height: "24px",
                        background: "#1e293b",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "60px",
                        height: "24px",
                        background: "#1e293b",
                        borderRadius: "4px",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="header glass">
        <div className="container">
          <div className="header-content">
            {user && (
              <ProfileMenu
                onUpdateProfile={() => setShowUpdateProfile(true)}
                onChangePassword={() => setShowChangePassword(true)}
              />
            )}
            <h1 className="logo">📝 Blog Hub</h1>

            <div className="header-actions">
              {user ? (
                <>
                  <div className="user-profile-nav">
                    <div className="user-avatar-small">
                      {user.profilePic?.url ? (
                        <img src={user.profilePic.url} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder-small">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="user-greeting">
                      Hello,{" "}
                      <strong>
                        {user.name.split(" ").slice(1).join(" ") || user.name}
                      </strong>
                    </span>
                  </div>

                  {user.role === "admin" && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Dashboard
                    </button>
                  )}
                  <button className="btn btn-outline" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowLogin(true)}
                  >
                    Login
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowSignup(true)}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="hero-section">
            <h2 className="hero-title">Discover Amazing Stories</h2>
            <p className="hero-subtitle">
              Explore blogs on technology, health, business, and Islamic topics
            </p>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <select
                className="category-search"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="">Search by category</option>
                <option value="all">All Categories</option>
                <option value="tech">Tech</option>
                <option value="health">Health</option>
                <option value="business">Business</option>
                <option value="islamic">Islamic</option>
              </select>
            </div>
            {searchCategory && searchCategory !== "all" && (
              <p className="search-results-text">
                Showing <strong>{filteredBlogs.length}</strong> {searchCategory}{" "}
                {filteredBlogs.length === 1 ? "blog" : "blogs"}
              </p>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {filteredBlogs.length === 0 ? (
            <div className="empty-state">
              <h3>No blogs found</h3>
              <p>
                {searchCategory && searchCategory !== "all"
                  ? `No blogs found in the ${searchCategory} category. Try a different category!`
                  : "Be the first to create a blog post!"}
              </p>
              {searchCategory && searchCategory !== "all" && (
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => setSearchCategory("")}
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            <div className="blogs-grid">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </main>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
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

export default HomePage;
