import api from '../util/axios';

// Donation API
export const donationAPI = {
    // Get all donations
    getDonations: async (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.userId) queryParams.append('userId', params.userId);
        if (params.status) queryParams.append('status', params.status);

        return api.get(`/donations?${queryParams.toString()}`);
    },

    // Get donation by ID
    getDonationById: async (id) => {
        return api.get(`/donations/${id}`);
    },

    // Create donation
    createDonation: async (donationData) => {
        return api.post('/donations', donationData);
    },

    // Update donation
    updateDonation: async (id, donationData) => {
        return api.put(`/donations/${id}`, donationData);
    },

    // Delete donation
    deleteDonation: async (id) => {
        return api.delete(`/donations/${id}`);
    },

    // PayPal Payment APIs
    // Create PayPal order
    createPayPalOrder: async (donationData) => {
        return api.post('/donations/paypal/create-order', donationData);
    },

    // Capture PayPal payment
    capturePayPalPayment: async (orderId) => {
        return api.post(`/donations/paypal/capture/${orderId}`);
    },

    // Get PayPal client ID
    getPayPalClientId: async () => {
        return api.get('/donations/paypal/client-id');
    },

    // Verify PayPal payment
    verifyPayPalPayment: async (paymentData) => {
        return api.post('/donations/paypal/verify', paymentData);
    }
}; 