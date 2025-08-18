import api from '../util/axios';

// User Management API for Admin only
export const userManagementAPI = {
  // Get all users with pagination and filters
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.role) queryParams.append('role', params.role);
    if (params.search) queryParams.append('search', params.search);
    if (params.enabled !== undefined) queryParams.append('enabled', params.enabled);

    return api.get(`/users?${queryParams.toString()}`);
  },

  // Get user by ID
  getUserById: async (id) => {
    return api.get(`/users/${id}`);
  },

  // Create new user (Admin only)
  createUser: async (userData) => {
    return api.post('/users', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Update user (Admin only)
  updateUser: async (id, userData) => {
    return api.put(`/users/${id}`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    return api.delete(`/users/${id}`);
  },

  // Enable/Disable user (Admin only)
  toggleUserStatus: async (id, enabled) => {
    return api.patch(`/users/${id}/status`, { enabled });
  },

  // Change user role (Admin only)
  changeUserRole: async (id, role) => {
    return api.patch(`/users/${id}/role`, { role });
  },

  // Get users by role
  getUsersByRole: async (role, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.search) queryParams.append('search', params.search);

    return api.get(`/users/role/${role}?${queryParams.toString()}`);
  },

  // Get adopters list
  getAdopters: async (params = {}) => {
    return userManagementAPI.getUsersByRole('ADOPTER', params);
  },

  // Get donors list
  getDonors: async (params = {}) => {
    return userManagementAPI.getUsersByRole('DONOR', params);
  },

  // Get volunteers list
  getVolunteers: async (params = {}) => {
    return userManagementAPI.getUsersByRole('VOLUNTEER', params);
  },

  // Get user statistics
  getUserStats: async () => {
    return api.get('/users/stats');
  },

  // Reset user password (Admin only)
  resetUserPassword: async (id, newPassword) => {
    return api.patch(`/users/${id}/password`, { password: newPassword });
  },

  // Bulk operations
  bulkEnableUsers: async (userIds) => {
    return api.post('/users/bulk/enable', { userIds });
  },

  bulkDisableUsers: async (userIds) => {
    return api.post('/users/bulk/disable', { userIds });
  },

  bulkDeleteUsers: async (userIds) => {
    return api.post('/users/bulk/delete', { userIds });
  }
};