import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchAllUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus, 
    changeUserRole,
    fetchUserStats
} from '../asyncAction/userManagementAsyncAction';

const initialState = {
    users: [],
    stats: null,
    isLoading: false,
    error: null,
    message: null
};

const userManagementSlice = createSlice({
    name: 'userManagement',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch all users
        builder.addCase(fetchAllUsers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload;
        });
        builder.addCase(fetchAllUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Create user
        builder.addCase(createUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users.unshift(action.payload);
            state.message = 'User created successfully';
        });
        builder.addCase(createUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update user
        builder.addCase(updateUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
            state.message = 'User updated successfully';
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Delete user
        builder.addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = state.users.filter(user => user.id !== action.payload);
            state.message = 'User deleted successfully';
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Toggle user status
        builder.addCase(toggleUserStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(toggleUserStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            const { id, enabled } = action.payload;
            const user = state.users.find(user => user.id === id);
            if (user) {
                user.enabled = enabled;
            }
            state.message = `User ${enabled ? 'enabled' : 'disabled'} successfully`;
        });
        builder.addCase(toggleUserStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Change user role
        builder.addCase(changeUserRole.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(changeUserRole.fulfilled, (state, action) => {
            state.isLoading = false;
            const { id, role } = action.payload;
            const user = state.users.find(user => user.id === id);
            if (user) {
                user.role = role;
            }
            state.message = 'User role changed successfully';
        });
        builder.addCase(changeUserRole.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch user stats
        builder.addCase(fetchUserStats.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchUserStats.fulfilled, (state, action) => {
            state.isLoading = false;
            state.stats = action.payload;
        });
        builder.addCase(fetchUserStats.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});

export const { clearError, clearMessage } = userManagementSlice.actions;
export default userManagementSlice.reducer; 