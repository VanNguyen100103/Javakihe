import { createAsyncThunk } from '@reduxjs/toolkit';
import { adoptionAPI } from '../../api/adoption';

// Fetch all adoptions
export const fetchAdoptions = createAsyncThunk(
    'adoption/fetchAdoptions',
    async (params, { rejectWithValue }) => {
        try {
            const response = await adoptionAPI.getAllAdoptions(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch adoptions');
        }
    }
);

// Create adoption application
export const createAdoption = createAsyncThunk(
    'adoption/createAdoption',
    async (adoptionData, { rejectWithValue }) => {
        try {
            const response = await adoptionAPI.createAdoption(adoptionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create adoption');
        }
    }
);

// Adopt from cart
export const adoptFromCart = createAsyncThunk(
    'adoption/adoptFromCart',
    async (adoptionData, { rejectWithValue }) => {
        try {
            const response = await adoptionAPI.adoptFromCart(adoptionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to adopt from cart');
        }
    }
);

// Submit adoption test
export const submitAdoptionTest = createAsyncThunk(
    'adoption/submitAdoptionTest',
    async (testAnswers, { rejectWithValue }) => {
        try {
            console.log('=== submitAdoptionTest called ===');
            console.log('testAnswers:', testAnswers);
            const response = await adoptionAPI.submitAdoptionTest(testAnswers);
            console.log('=== submitAdoptionTest response ===', response);
            console.log('=== typeof response ===', typeof response);
            
            // Axios interceptor trả về response.data trực tiếp
            // Nên response ở đây chính là data từ backend
            const data = response;
            console.log('=== Final data to return ===', data);
            
            // Kiểm tra có score không
            if (!data || typeof data.score !== 'number') {
                console.error('Data or score is invalid:', data);
                return rejectWithValue('Kết quả bài test không hợp lệ');
            }
            
            return data;
        } catch (error) {
            console.error('=== submitAdoptionTest error ===', error);
            return rejectWithValue(error.response?.data || 'Failed to submit test');
        }
    }
);

// Update adoption
export const updateAdoption = createAsyncThunk(
    'adoption/updateAdoption',
    async ({ id, adoptionData }, { rejectWithValue }) => {
        try {
            const response = await adoptionAPI.updateAdoption(id, adoptionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update adoption');
        }
    }
);

// Delete adoption
export const deleteAdoption = createAsyncThunk(
    'adoption/deleteAdoption',
    async (id, { rejectWithValue }) => {
        try {
            await adoptionAPI.deleteAdoption(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete adoption');
        }
    }
);

// Fetch adoption test results async thunk
export const fetchAdoptionTestResults = createAsyncThunk(
    'adoption/fetchAdoptionTestResults',
    async (adoptionId, { rejectWithValue }) => {
        try {
            const response = await adoptionAPI.getAdoptionTestResults(adoptionId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch test results');
        }
    }
); 