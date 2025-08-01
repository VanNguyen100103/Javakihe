import api from '../util/axios';

// Pet Management API for Admin & Shelter Staff
export const petManagementAPI = {
  // Get all pets with pagination and filters
  getPets: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.status) queryParams.append('status', params.status);
    if (params.breed) queryParams.append('breed', params.breed);
    if (params.search) queryParams.append('search', params.search);
    if (params.age) queryParams.append('age', params.age);
    if (params.location) queryParams.append('location', params.location);
    if (params.ageMin) queryParams.append('ageMin', params.ageMin);
    if (params.ageMax) queryParams.append('ageMax', params.ageMax);

    return api.get(`/pets?${queryParams.toString()}`);
  },

  // Get pet by ID
  getPetById: async (id) => {
    return api.get(`/pets/${id}`);
  },

  // Create new pet (Admin & Shelter Staff only)
  createPet: async (petData, images = [], shelterId = null) => {
    const formData = new FormData();
    
    // Add pet data
    Object.keys(petData).forEach(key => {
      formData.append(key, petData[key]);
    });

    // Add images
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    // Add shelterId for admin
    if (shelterId) {
      formData.append('shelterId', shelterId);
    }

    return api.post('/pets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update pet (Admin & Shelter Staff only)
  updatePet: async (id, petData, images = []) => {
    const formData = new FormData();
    
    // Add pet data
    formData.append('pet', JSON.stringify(petData));

    // Add images
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    return api.put(`/pets/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete pet (Admin & Shelter Staff only)
  deletePet: async (id) => {
    return api.delete(`/pets/${id}`);
  },

  // Get pets by shelter (for shelter staff)
  getPetsByShelter: async (shelterId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.status) queryParams.append('status', params.status);
    if (params.breed) queryParams.append('breed', params.breed);
    if (params.search) queryParams.append('search', params.search);

    return api.get(`/pets/shelter/${shelterId}?${queryParams.toString()}`);
  },

  // Update pet status
  updatePetStatus: async (id, status) => {
    return api.patch(`/pets/${id}/status`, { status });
  },

  // Get pet statistics
  getPetStats: async () => {
    return api.get('/pets/stats');
  }
}; 