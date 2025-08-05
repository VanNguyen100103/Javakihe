import api from '../util/axios';

// User API
export const userAPI = {
    // Get current user profile
    getCurrentUser: async () => {
        return api.get('/users/profile');
    },

    // Get user by ID
    getUserById: async (id) => {
        return api.get(`/users/${id}`);
    },

    // Update user profile
    updateProfile: async (userData) => {
        return api.put('/users/profile', userData);
    },

    // Change password
    changePassword: async (passwordData) => {
        return api.put('/users/password', passwordData);
    },

    // Get user adoptions
    getUserAdoptions: async (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.status) queryParams.append('status', params.status);

        return api.get(`/user/adoptions?${queryParams.toString()}`);
    },

    // Get user donations
    getUserDonations: async (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.status) queryParams.append('status', params.status);

        return api.get(`/user/donations?${queryParams.toString()}`);
    }
};