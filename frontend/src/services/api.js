import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (credentials) => api.post('/users/login', credentials),
    signupUser: (userData) => api.post('/users/register', userData),
    signupAdmin: (adminData) => api.post('/users/admin/signup', adminData),
    logout: () => api.post('/users/logout'),
    forgetPassword: (emailData) => api.post('/users/forget-password', emailData),
    resetPassword: (token, passwordData) => api.patch(`/users/resetpassword/${token}`, passwordData),
    updatePassword: (passwordData) => api.patch('/users/updatepassword', passwordData),
};

// User APIs
export const userAPI = {
    getAll: () => api.get('/users'),
    delete: (id) => api.delete(`/users/delete-user/${id}`),
};

// Blog APIs
export const blogAPI = {
    getAll: () => api.get('/blogs'),
    getById: (id) => api.get(`/blogs/${id}`),
    getByTopic: (topic) => api.get(`/blogs/topic/${topic}`),
    create: (blogData) => api.post('/blogs', blogData),
    update: (id, blogData) => api.patch(`/blogs/updateblog/${id}`, blogData),
    delete: (id) => api.delete(`/blogs/deleteblog/${id}`),
};

// Comment APIs
export const commentAPI = {
    getAll: (blogId) => api.get(`/comments/blog/${blogId}/comments`),
    create: (blogId, commentData) => api.post(`/comments/blog/${blogId}/comment`, commentData),
    update: (blogId, commentData) => api.patch(`/comments/blog/${blogId}/comment`, commentData),
    delete: (commentId) => api.delete(`/comments/${commentId}`),
};

// Reaction APIs
export const reactionAPI = {
    like: (blogId) => api.post(`/reactions/blog/${blogId}/like`),
    dislike: (blogId) => api.post(`/reactions/blog/${blogId}/dislike`),
    deleteReaction: (blogId) => api.delete(`/reactions/blog/${blogId}/reaction`),
};

export default api;
