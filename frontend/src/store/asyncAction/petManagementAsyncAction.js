import { createAsyncThunk } from '@reduxjs/toolkit';
import { petManagementAPI } from '../../api/petManagement';
import { toast } from 'react-toastify';

// Get all pets with filters
export const fetchPetsForManagement = createAsyncThunk(
  'petManagement/fetchPets',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await petManagementAPI.getPets(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pets');
    }
  }
);

// Get pet by ID
export const fetchPetByIdForManagement = createAsyncThunk(
  'petManagement/fetchPetById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await petManagementAPI.getPetById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pet');
    }
  }
);

// Create new pet
export const createPet = createAsyncThunk(
  'petManagement/createPet',
  async ({ petData, images, shelterId }, { rejectWithValue }) => {
    try {
      const response = await petManagementAPI.createPet(petData, images, shelterId);
      toast.success('Thú cưng đã được tạo thành công!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create pet');
      return rejectWithValue(error.response?.data?.message || 'Failed to create pet');
    }
  }
);

// Update pet
export const updatePet = createAsyncThunk(
  'petManagement/updatePet',
  async ({ id, petData, images }, { rejectWithValue }) => {
    try {
      const response = await petManagementAPI.updatePet(id, petData, images);
      toast.success('Thú cưng đã được cập nhật thành công!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update pet');
      return rejectWithValue(error.response?.data?.message || 'Failed to update pet');
    }
  }
);

// Delete pet
export const deletePet = createAsyncThunk(
  'petManagement/deletePet',
  async (id, { rejectWithValue }) => {
    try {
      await petManagementAPI.deletePet(id);
      toast.success('Thú cưng đã được xóa thành công!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete pet');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete pet');
    }
  }
);

// Update pet status
export const updatePetStatus = createAsyncThunk(
  'petManagement/updatePetStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await petManagementAPI.updatePetStatus(id, status);
      toast.success('Trạng thái thú cưng đã được cập nhật!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update pet status');
      return rejectWithValue(error.response?.data?.message || 'Failed to update pet status');
    }
  }
);

// Get pets by shelter
export const fetchPetsByShelter = createAsyncThunk(
  'petManagement/fetchPetsByShelter',
  async ({ shelterId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await petManagementAPI.getPetsByShelter(shelterId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shelter pets');
    }
  }
);

// Get pet statistics
export const fetchPetStats = createAsyncThunk(
  'petManagement/fetchPetStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await petManagementAPI.getPetStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pet statistics');
    }
  }
);

// Bulk delete pets
export const bulkDeletePets = createAsyncThunk(
  'petManagement/bulkDeletePets',
  async (petIds, { rejectWithValue }) => {
    try {
      // This would need to be implemented in the backend
      await Promise.all(petIds.map(id => petManagementAPI.deletePet(id)));
      toast.success(`${petIds.length} thú cưng đã được xóa thành công!`);
      return petIds;
    } catch (error) {
      toast.error('Failed to delete pets');
      return rejectWithValue('Failed to delete pets');
    }
  }
); 