import api from '../util/axios';

// Cart API
export const cartAPI = {
    // Get user cart
    getUserCart: async () => {
        console.log('=== cartAPI.getUserCart called ===');
        const response = await api.get('/guest-cart/user-cart');
        console.log('=== cartAPI.getUserCart response ===', response);
        console.log('=== cartAPI.getUserCart response.data ===', response.data);
        return response;
    },

    // Add item to cart (for both user and guest)
    addToCart: async (petId, token = null) => {
        const params = { petId };
        if (token) {
            params.token = token;
        }
        return api.post('/guest-cart/add', null, { params });
    },

    // Get guest cart
    getGuestCart: async (token) => {
        return api.get('/guest-cart', { params: { token } });
    },

    // Remove item from guest cart
    removeFromGuestCart: async (petId, token) => {
        return api.delete('/guest-cart/remove', { params: { petId, token } });
    },

    // Remove item from user cart
    removeFromUserCart: async (petId) => {
        return api.delete('/guest-cart/user-cart/remove', { params: { petId } });
    },

    // Clear user cart
    clearUserCart: async () => {
        return api.delete('/guest-cart/user-cart/clear');
    },

    // Merge guest cart to user cart
    mergeCart: async (token) => {
        return api.post('/guest-cart/merge', null, { params: { token } });
    },

    // Clear cart (for user)
    clearCart: async () => {
        // Backend doesn't have clear cart endpoint yet
        // This would need to be implemented in backend
        return Promise.resolve();
    }
}; 