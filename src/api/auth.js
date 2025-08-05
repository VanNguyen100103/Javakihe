import api from '../util/axios';

// Auth API
export const authAPI = {
    // Login
    login: async (credentials) => {
        // Convert to form data for backend compatibility
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        
        return api.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Register
    register: async (userData) => {
        return api.post('/auth/register', userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        return api.post('/auth/refresh', { refreshToken });
    },

    // Verify email
    verifyEmail: async (token) => {
        return api.get(`/auth/verify?token=${token}`);
    },

    // Logout
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
}; 