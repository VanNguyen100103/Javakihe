import { createAsyncThunk } from '@reduxjs/toolkit';
import { donationAPI } from '../../api';

// Fetch donations async thunk
export const fetchDonations = createAsyncThunk(
    'donation/fetchDonations',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await donationAPI.getDonations(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch donations');
        }
    }
);

// Fetch donation by ID async thunk
export const fetchDonationById = createAsyncThunk(
    'donation/fetchDonationById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await donationAPI.getDonationById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch donation');
        }
    }
);

// Create donation async thunk
export const createDonation = createAsyncThunk(
    'donation/createDonation',
    async (donationData, { rejectWithValue }) => {
        try {
            const response = await donationAPI.createDonation(donationData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create donation');
        }
    }
);

// Update donation async thunk
export const updateDonation = createAsyncThunk(
    'donation/updateDonation',
    async ({ id, donationData }, { rejectWithValue }) => {
        try {
            const response = await donationAPI.updateDonation(id, donationData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update donation');
        }
    }
);

// Delete donation async thunk
export const deleteDonation = createAsyncThunk(
    'donation/deleteDonation',
    async (id, { rejectWithValue }) => {
        try {
            await donationAPI.deleteDonation(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete donation');
        }
    }
); 