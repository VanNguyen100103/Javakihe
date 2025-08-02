import api from '../util/axios';

// Admin API for admin-specific endpoints
export const adminAPI = {
    // Get recent activities
    getRecentActivities: async () => {
        return api.get('/admin/recent-activities');
    },

    // Get dashboard overview
    getDashboardOverview: async () => {
        return api.get('/admin/dashboard-overview');
    },

    // Get system health
    getSystemHealth: async () => {
        return api.get('/admin/system-health');
    }
}; 