import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateBlog from './pages/admin/CreateBlog';
import EditBlog from './pages/admin/EditBlog';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog/:id" element={<BlogDetailPage />} />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/blog/new"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <CreateBlog />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/blog/edit/:id"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <EditBlog />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
