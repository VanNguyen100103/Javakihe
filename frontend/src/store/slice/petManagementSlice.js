import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPetsForManagement,
  fetchPetByIdForManagement,
  createPet,
  updatePet,
  deletePet,
  updatePetStatus,
  fetchPetsByShelter,
  fetchPetStats,
  bulkDeletePets
} from '../asyncAction/petManagementAsyncAction';

const initialState = {
  pets: [],
  selectedPet: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  },
  filters: {
    status: '',
    breed: '',
    search: '',
    ageMin: '',
    ageMax: '',
    location: ''
  },
  stats: null,
  isLoading: false,
  error: null,
  message: null
};

const petManagementSlice = createSlice({
  name: 'petManagement',
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
      state.filters = {
        status: '',
        breed: '',
        search: '',
        ageMin: '',
        ageMax: '',
        location: ''
      };
    },
    setSelectedPet: (state, action) => {
      state.selectedPet = action.payload;
    },
    clearSelectedPet: (state) => {
      state.selectedPet = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch pets for management
    builder.addCase(fetchPetsForManagement.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPetsForManagement.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pets = action.payload.content || action.payload;
      if (action.payload.pageable) {
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          size: action.payload.size
        };
      }
    });
    builder.addCase(fetchPetsForManagement.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch pet by ID
    builder.addCase(fetchPetByIdForManagement.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPetByIdForManagement.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedPet = action.payload;
    });
    builder.addCase(fetchPetByIdForManagement.rejected, (state, action) => {
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
      if (state.selectedPet && state.selectedPet.id === action.payload.id) {
        state.selectedPet = action.payload;
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
      if (state.selectedPet && state.selectedPet.id === action.payload) {
        state.selectedPet = null;
      }
      state.message = 'Pet deleted successfully';
    });
    builder.addCase(deletePet.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update pet status
    builder.addCase(updatePetStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updatePetStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.pets.findIndex(pet => pet.id === action.payload.id);
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
      if (state.selectedPet && state.selectedPet.id === action.payload.id) {
        state.selectedPet = action.payload;
      }
      state.message = 'Pet status updated successfully';
    });
    builder.addCase(updatePetStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch pets by shelter
    builder.addCase(fetchPetsByShelter.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPetsByShelter.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pets = action.payload.content || action.payload;
      if (action.payload.pageable) {
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          size: action.payload.size
        };
      }
    });
    builder.addCase(fetchPetsByShelter.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch pet stats
    builder.addCase(fetchPetStats.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPetStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchPetStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Bulk delete pets
    builder.addCase(bulkDeletePets.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(bulkDeletePets.fulfilled, (state, action) => {
      state.isLoading = false;
      state.pets = state.pets.filter(pet => !action.payload.includes(pet.id));
      state.message = `${action.payload.length} pets deleted successfully`;
    });
    builder.addCase(bulkDeletePets.rejected, (state, action) => {
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
  setSelectedPet,
  clearSelectedPet
} = petManagementSlice.actions;

export default petManagementSlice.reducer; 