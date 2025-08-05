import api from '../util/axios';

// Pet API
export const petAPI = {
    // Get all pets with filters
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
        if (params.gender) queryParams.append('gender', params.gender);

        const url = `/pets?${queryParams.toString()}`;
        console.log('API call:', url);
        console.log('Params:', params);

        return api.get(url);
    },

    // Get pet by ID
    getPetById: async (id) => {
        return api.get(`/pets/${id}`);
    },

    // Create new pet with JSON (without images for now)
    createPetJson: async (petData, shelterId = null) => {
        const requestData = {
            ...petData,
            shelterId: shelterId
        };

        console.log('Sending JSON pet data:', requestData);

        return api.post('/pets/create-json', requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },

    // Create new pet
    createPet: async (petData, images = [], shelterId = null) => {
        const formData = new FormData();
        
        // Append pet data as individual fields
        formData.append('name', petData.name || '');
        formData.append('age', petData.age || '');
        formData.append('breed', petData.breed || '');
        formData.append('location', petData.location || '');
        formData.append('description', petData.description || '');
        formData.append('status', petData.status || 'AVAILABLE');
        formData.append('gender', petData.gender || 'MALE');
        formData.append('vaccinated', petData.vaccinated ? 'true' : 'false');
        formData.append('dewormed', petData.dewormed ? 'true' : 'false');
        
        // Append images only if they exist and are valid files
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                if (image && image instanceof File) {
                    formData.append('images', image);
                }
            });
        }
        
        // Append shelterId if provided
        if (shelterId) {
            formData.append('shelterId', shelterId);
        }

        console.log('Sending form data:', {
            name: petData.name,
            age: petData.age,
            breed: petData.breed,
            location: petData.location,
            imagesCount: images ? images.length : 0
        });

        return api.post('/pets', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Update pet
    updatePet: async (id, petData, images = [], shelterId = null) => {
        const formData = new FormData();
        
        // Append pet data as JSON Blob (for @RequestPart)
        const petBlob = new Blob([JSON.stringify(petData)], { type: 'application/json' });
        formData.append('pet', petBlob);
        
        // Append images
        if (images && images.length > 0) {
            images.forEach(image => {
                formData.append('images', image);
            });
        }
        
        // Append shelterId if provided
        if (shelterId) {
            formData.append('shelterId', shelterId);
        }

        return api.put(`/pets/${id}`, formData);
    },

    // Add images to existing pet
    addImagesToPet: async (petId, images = []) => {
        const formData = new FormData();
        
        // Append images
        if (images && images.length > 0) {
            images.forEach(image => {
                if (image && image instanceof File) {
                    formData.append('images', image);
                }
            });
        }

        console.log('Adding images to pet:', {
            petId: petId,
            imagesCount: images ? images.length : 0
        });

        return api.post(`/pets/${petId}/add-images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Remove images from existing pet
    removeImagesFromPet: async (petId, urls = []) => {
        console.log('Removing images from pet:', {
            petId: petId,
            urlsCount: urls ? urls.length : 0
        });

        return api.delete(`/pets/${petId}/remove-images`, {
            data: {
                urls: urls
            }
        });
    },

    // Delete pet
    deletePet: async (id) => {
        return api.delete(`/pets/${id}`);
    }
}; 