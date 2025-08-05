import { createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../api';

// Fetch current user async thunk
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userAPI.getCurrentUser();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user');
        }
    }
);

// Update user profile async thunk
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userAPI.updateProfile(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update profile');
        }
    }
);

// Change password async thunk
export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await userAPI.changePassword(passwordData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to change password');
        }
    }
);

// Fetch user adoptions async thunk
export const fetchUserAdoptions = createAsyncThunk(
    'user/fetchUserAdoptions',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await userAPI.getUserAdoptions(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user adoptions');
        }
    }
);

// Fetch user donations async thunk
export const fetchUserDonations = createAsyncThunk(
    'user/fetchUserDonations',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await userAPI.getUserDonations(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user donations');
        }
    }
); 