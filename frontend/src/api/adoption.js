import api from '../util/axios';

// Adoption API
export const adoptionAPI = {
    // Get all adoptions (for admin/shelter)
    getAllAdoptions: async (params = {}) => {
        console.log('=== adoptionAPI.getAllAdoptions called ===');
        try {
            const response = await api.get('/adoptions/all', { params });
            console.log('=== getAllAdoptions response ===', response);
            console.log('=== typeof response ===', typeof response);
            console.log('=== Array.isArray(response) ===', Array.isArray(response));
            return response;
        } catch (error) {
            console.error('=== getAllAdoptions error ===', error);
            throw error;
        }
    },

    // Get adoptions for regular users
    getAdoptions: async (params = {}) => {
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
        console.log('=== adoptionAPI.adoptFromCart called ===');
        console.log('adoptionData:', adoptionData);
        
        // Convert to URLSearchParams for form-urlencoded
        const formData = new URLSearchParams();
        Object.keys(adoptionData).forEach(key => {
            if (adoptionData[key] !== null && adoptionData[key] !== undefined) {
                formData.append(key, adoptionData[key]);
            }
        });
        
        console.log('=== formData ===', formData.toString());
        
        try {
            const response = await api.post('/adoptions/from-cart', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            console.log('=== adoptFromCart response ===', response);
            return response;
        } catch (error) {
            console.error('=== adoptFromCart error ===', error);
            throw error;
        }
    },

    // Update adoption
    updateAdoption: async (id, adoptionData) => {
        return api.put(`/adoptions/${id}`, adoptionData);
    },

    // Update adoption status (for admin/shelter)
    updateAdoptionStatus: async (adoptionId, statusData) => {
        console.log('=== adoptionAPI.updateAdoptionStatus called ===');
        console.log('adoptionId:', adoptionId);
        console.log('statusData:', statusData);
        
        try {
            const response = await api.put(`/adoptions/${adoptionId}/status`, statusData);
            console.log('=== updateAdoptionStatus response ===', response);
            return response;
        } catch (error) {
            console.error('=== updateAdoptionStatus error ===', error);
            throw error;
        }
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