import { createAsyncThunk } from '@reduxjs/toolkit';
import { adoptionAPI } from '../../api/adoption';

// Fetch user's adoptions
export const fetchAdoptions = createAsyncThunk(
    'adoption/fetchAdoptions',
    async (params, { rejectWithValue }) => {
        try {
            const response = await adoptionAPI.getAdoptions();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch adoptions');
        }
    }
);

// Fetch all adoptions (for admin/shelter)
export const fetchAllAdoptions = createAsyncThunk(
    'adoption/fetchAllAdoptions',
    async (_, { rejectWithValue }) => {
        try {
            console.log('=== fetchAllAdoptions called ===');
            const response = await adoptionAPI.getAllAdoptions();
            console.log('=== fetchAllAdoptions response ===', response);
            console.log('=== typeof response ===', typeof response);
            
            // Axios interceptor trả về response.data trực tiếp
            // Nên response ở đây chính là data từ backend
            const data = response;
            console.log('=== Final data to return ===', data);
            
            // Kiểm tra data có phải array không
            if (!Array.isArray(data)) {
                console.error('Data is not an array:', data);
                return rejectWithValue('Dữ liệu không đúng định dạng');
            }
            
            return data;
        } catch (error) {
            console.error('=== fetchAllAdoptions error ===', error);
            return rejectWithValue(error.response?.data || 'Failed to fetch all adoptions');
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

// Update adoption status (for admin/shelter)
export const updateAdoptionStatus = createAsyncThunk(
    'adoption/updateAdoptionStatus',
    async ({ adoptionId, status, adminNotes, shelterNotes }, { rejectWithValue }) => {
        try {
            console.log('=== updateAdoptionStatus async thunk called ===');
            console.log('adoptionId:', adoptionId);
            console.log('status:', status);
            console.log('adminNotes:', adminNotes);
            console.log('shelterNotes:', shelterNotes);
            
            const response = await adoptionAPI.updateAdoptionStatus(adoptionId, {
                status,
                adminNotes,
                shelterNotes
            });
            
            console.log('=== updateAdoptionStatus response ===', response);
            console.log('=== typeof response ===', typeof response);
            console.log('=== response.id ===', response?.id);
            
            // Axios interceptor returns response.data directly
            const data = response;
            console.log('=== Final data to return ===', data);
            
            if (!data || !data.id) {
                console.error('Response data is invalid:', data);
                return rejectWithValue('Dữ liệu phản hồi không hợp lệ');
            }
            
            return data;
        } catch (error) {
            console.error('=== updateAdoptionStatus error ===', error);
            return rejectWithValue(error.response?.data || 'Failed to update adoption status');
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