import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchDonations, 
    fetchDonationById, 
    createDonation, 
    updateDonation, 
    deleteDonation 
} from '../asyncAction/donationAsyncAction';

const initialState = {
    donations: [],
    currentDonation: null,
    pagination: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    },
    filters: {
        status: '',
        userId: null
    },
    isLoading: false,
    error: null,
    message: null
};

const donationSlice = createSlice({
    name: 'donation',
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
        setCurrentDonation: (state, action) => {
            state.currentDonation = action.payload;
        },
        clearCurrentDonation: (state) => {
            state.currentDonation = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch donations
        builder.addCase(fetchDonations.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchDonations.fulfilled, (state, action) => {
            state.isLoading = false;
            state.donations = action.payload.content || action.payload || [];
            state.pagination = action.payload.pageable ? {
                page: action.payload.pageable.pageNumber || 0,
                size: action.payload.pageable.pageSize || 2,
                totalElements: action.payload.totalElements || 0,
                totalPages: action.payload.totalPages || 0
            } : {
                page: 0,
                size: 10,
                totalElements: Array.isArray(action.payload) ? action.payload.length : 0,
                totalPages: 1
            };
        });
        builder.addCase(fetchDonations.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch donation by ID
        builder.addCase(fetchDonationById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchDonationById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentDonation = action.payload;
        });
        builder.addCase(fetchDonationById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Create donation
        builder.addCase(createDonation.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createDonation.fulfilled, (state, action) => {
            state.isLoading = false;
            state.donations.unshift(action.payload);
            state.message = 'Donation created successfully';
        });
        builder.addCase(createDonation.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update donation
        builder.addCase(updateDonation.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateDonation.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.donations.findIndex(donation => donation.id === action.payload.id);
            if (index !== -1) {
                state.donations[index] = action.payload;
            }
            if (state.currentDonation && state.currentDonation.id === action.payload.id) {
                state.currentDonation = action.payload;
            }
            state.message = 'Donation updated successfully';
        });
        builder.addCase(updateDonation.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Delete donation
        builder.addCase(deleteDonation.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteDonation.fulfilled, (state, action) => {
            state.isLoading = false;
            state.donations = state.donations.filter(donation => donation.id !== action.payload);
            if (state.currentDonation && state.currentDonation.id === action.payload) {
                state.currentDonation = null;
            }
            state.message = 'Donation deleted successfully';
        });
        builder.addCase(deleteDonation.rejected, (state, action) => {
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
    setCurrentDonation, 
    clearCurrentDonation 
} = donationSlice.actions;
export default donationSlice.reducer; 