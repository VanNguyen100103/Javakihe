import { createAsyncThunk } from '@reduxjs/toolkit';
import { userManagementAPI } from '../../api';

// Fetch all users async thunk
export const fetchAllUsers = createAsyncThunk(
    'userManagement/fetchAllUsers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await userManagementAPI.getUsers(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch users');
        }
    }
);

// Create user async thunk
export const createUser = createAsyncThunk(
    'userManagement/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userManagementAPI.createUser(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create user');
        }
    }
);

// Update user async thunk
export const updateUser = createAsyncThunk(
    'userManagement/updateUser',
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await userManagementAPI.updateUser(id, userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update user');
        }
    }
);

// Delete user async thunk
export const deleteUser = createAsyncThunk(
    'userManagement/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await userManagementAPI.deleteUser(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete user');
        }
    }
);

// Toggle user status async thunk
export const toggleUserStatus = createAsyncThunk(
    'userManagement/toggleUserStatus',
    async ({ id, enabled }, { rejectWithValue }) => {
        try {
            const response = await userManagementAPI.toggleUserStatus(id, enabled);
            return { id, enabled, response };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to toggle user status');
        }
    }
);

// Change user role async thunk
export const changeUserRole = createAsyncThunk(
    'userManagement/changeUserRole',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const response = await userManagementAPI.changeUserRole(id, role);
            return { id, role, response };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to change user role');
        }
    }
);

// Get user statistics async thunk
export const fetchUserStats = createAsyncThunk(
    'userManagement/fetchUserStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userManagementAPI.getUserStats();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user statistics');
        }
    }
); 