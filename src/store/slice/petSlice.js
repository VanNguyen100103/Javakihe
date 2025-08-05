import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchPets, 
    fetchPetById, 
    createPet, 
    updatePet, 
    deletePet,
    fetchSheltersForPet
} from '../asyncAction/petAsyncAction';

const initialState = {
    pets: [],
    currentPet: null,
    shelters: [],
    pagination: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    },
    filters: {
        status: '',
        breed: '',
        search: '',
        age: null,
        location: '',
        ageMin: null,
        ageMax: null
    },
    isLoading: false,
    error: null,
    message: null
};

const petSlice = createSlice({
    name: 'pet',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setCurrentPet: (state, action) => {
            state.currentPet = action.payload;
        },
        clearCurrentPet: (state) => {
            state.currentPet = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch pets
        builder.addCase(fetchPets.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchPets.fulfilled, (state, action) => {
            state.isLoading = false;
            
            // Handle different response formats
            if (Array.isArray(action.payload)) {
                // If backend returns array directly
                state.pets = action.payload;
                state.pagination = {
                    page: 0,
                    size: action.payload.length,
                    totalElements: action.payload.length,
                    totalPages: 1
                };
            } else if (action.payload.content) {
                // If backend returns paginated response
                state.pets = action.payload.content;
                state.pagination = {
                    currentPage: action.payload.pageable?.pageNumber || 0,
                    size: action.payload.pageable?.pageSize || 2,
                    totalElements: action.payload.totalElements || 0,
                    totalPages: action.payload.totalPages || 0
                };
            } else {
                // Fallback
                state.pets = [];
                state.pagination = {
                    page: 0,
                    size: 10,
                    totalElements: 0,
                    totalPages: 0
                };
            }
        });
        builder.addCase(fetchPets.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch pet by ID
        builder.addCase(fetchPetById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchPetById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentPet = action.payload;
        });
        builder.addCase(fetchPetById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Create pet
        builder.addCase(createPet.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createPet.fulfilled, (state, action) => {
            state.isLoading = false;
            state.pets.unshift(action.payload);
            state.message = 'Pet created successfully';
        });
        builder.addCase(createPet.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update pet
        builder.addCase(updatePet.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updatePet.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.pets.findIndex(pet => pet.id === action.payload.id);
            if (index !== -1) {
                state.pets[index] = action.payload;
            }
            if (state.currentPet && state.currentPet.id === action.payload.id) {
                state.currentPet = action.payload;
            }
            state.message = 'Pet updated successfully';
        });
        builder.addCase(updatePet.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Delete pet
        builder.addCase(deletePet.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deletePet.fulfilled, (state, action) => {
            state.isLoading = false;
            state.pets = state.pets.filter(pet => pet.id !== action.payload);
            if (state.currentPet && state.currentPet.id === action.payload) {
                state.currentPet = null;
            }
            state.message = 'Pet deleted successfully';
        });
        builder.addCase(deletePet.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch shelters for pet form
        builder.addCase(fetchSheltersForPet.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchSheltersForPet.fulfilled, (state, action) => {
            state.isLoading = false;
            state.shelters = action.payload;
        });
        builder.addCase(fetchSheltersForPet.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});

export const { 
    clearError, 
    clearMessage, 
    setFilters, 
    clearFilters, 
    setCurrentPet, 
    clearCurrentPet 
} = petSlice.actions;
export default petSlice.reducer; 