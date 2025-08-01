import api from '../util/axios';

// Adoption API
export const adoptionAPI = {
    // Get all adoptions
    getAllAdoptions: async (params = {}) => {
        return api.get('/adoptions', { params });
    },

    // Get adoption by ID
    getAdoptionById: async (id) => {
        return api.get(`/adoptions/${id}`);
    },

    // Create adoption application
    createAdoption: async (adoptionData) => {
        return api.post('/adoptions', adoptionData);
    },

    // Adopt from cart
    adoptFromCart: async (adoptionData) => {
        return api.post('/adoptions/from-cart', adoptionData);
    },

    // Update adoption
    updateAdoption: async (id, adoptionData) => {
        return api.put(`/adoptions/${id}`, adoptionData);
    },

    // Delete adoption
    deleteAdoption: async (id) => {
        return api.delete(`/adoptions/${id}`);
    },

    // Submit adoption test
    submitAdoptionTest: async (testAnswers) => {
        console.log('=== adoptionAPI.submitAdoptionTest called ===');
        console.log('testAnswers:', testAnswers);
        
        // Convert to URLSearchParams for form-urlencoded
        const formData = new URLSearchParams();
        Object.keys(testAnswers).forEach(key => {
            // Gửi boolean thay vì string
            formData.append(key, testAnswers[key] ? 'true' : 'false');
        });
        
        console.log('=== formData ===', formData.toString());
        
        try {
            const response = await api.post('/adoption-test/submit', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            console.log('=== adoptionAPI.submitAdoptionTest response ===', response);
            console.log('=== typeof response ===', typeof response);
            // Axios interceptor trả về response.data trực tiếp
            return response;
        } catch (error) {
            console.error('=== adoptionAPI.submitAdoptionTest error ===', error);
            throw error;
        }
    }
}; 