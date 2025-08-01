import { createAsyncThunk } from '@reduxjs/toolkit';
import { petAPI } from '../../api';
import api from '../../util/axios';

// Set current pet action
export const setCurrentPet = (pet) => ({
    type: 'pet/setCurrentPet',
    payload: pet
});

// Fetch pets async thunk
export const fetchPets = createAsyncThunk(
    'pet/fetchPets',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await petAPI.getPets(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch pets');
        }
    }
);

// Fetch pet by ID async thunk
export const fetchPetById = createAsyncThunk(
    'pet/fetchPetById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await petAPI.getPetById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch pet');
        }
    }
);

// Create pet async thunk
export const createPet = createAsyncThunk(
    'pet/createPet',
    async ({ petData, images, shelterId }, { rejectWithValue }) => {
        try {
            // Use multipart endpoint with images
            const response = await petAPI.createPet(petData, images, shelterId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create pet');
        }
    }
);

// Update pet async thunk
export const updatePet = createAsyncThunk(
    'pet/updatePet',
    async ({ id, petData, images, shelterId }, { rejectWithValue }) => {
        try {
            const response = await petAPI.updatePet(id, petData, images, shelterId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update pet');
        }
    }
);

// Delete pet async thunk
export const deletePet = createAsyncThunk(
    'pet/deletePet',
    async (id, { rejectWithValue }) => {
        try {
            await petAPI.deletePet(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete pet');
        }
    }
);

// Add images to pet async thunk
export const addImagesToPet = createAsyncThunk(
    'pet/addImagesToPet',
    async ({ petId, images }, { rejectWithValue }) => {
        try {
            const response = await petAPI.addImagesToPet(petId, images);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add images to pet');
        }
    }
);

// Remove images from pet async thunk
export const removeImagesFromPet = createAsyncThunk(
    'pet/removeImagesFromPet',
    async ({ petId, urls }, { rejectWithValue }) => {
        try {
            const response = await petAPI.removeImagesFromPet(petId, urls);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to remove images from pet');
        }
    }
);

// Fetch shelters for pet form
export const fetchSheltersForPet = createAsyncThunk(
    'pet/fetchSheltersForPet',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users/shelters');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch shelters');
        }
    }
); 