import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchCurrentUser, 
    updateUserProfile, 
    changePassword, 
    fetchUserAdoptions, 
    fetchUserDonations 
} from '../asyncAction/userAsyncAction';

const initialState = {
    user: null,
    userAdoptions: [],
    userDonations: [],
    pagination: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    },
    isLoading: false,
    error: null,
    message: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch current user
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update profile
        builder.addCase(updateUserProfile.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.message = 'Profile updated successfully';
        });
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Change password
        builder.addCase(changePassword.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(changePassword.fulfilled, (state) => {
            state.isLoading = false;
            state.message = 'Password changed successfully';
        });
        builder.addCase(changePassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch user adoptions
        builder.addCase(fetchUserAdoptions.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchUserAdoptions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userAdoptions = action.payload.content;
            state.pagination = {
                page: action.payload.pageable.pageNumber,
                size: action.payload.pageable.pageSize,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages
            };
        });
        builder.addCase(fetchUserAdoptions.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch user donations
        builder.addCase(fetchUserDonations.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchUserDonations.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userDonations = action.payload.content;
            state.pagination = {
                page: action.payload.pageable.pageNumber,
                size: action.payload.pageable.pageSize,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages
            };
        });
        builder.addCase(fetchUserDonations.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});

export const { setUser, clearUser, clearError, clearMessage } = userSlice.actions;
export default userSlice.reducer;