import { createSlice } from '@reduxjs/toolkit';
import { login, register, logout } from '../asyncAction/authAsyncAction';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    userRole: JSON.parse(localStorage.getItem('user'))?.role || null,
    isLoading: false,
    error: null,
    message: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.userRole = action.payload?.role || null;
            state.isAuthenticated = !!action.payload;
        },
        setUserRole: (state, action) => {
            state.userRole = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.userRole = action.payload.user?.role || null;
            state.isAuthenticated = true;
            state.message = 'Login successful';
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = 'Registration successful';
        });
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.userRole = null;
            state.isAuthenticated = false;
            state.message = 'Logout successful';
        });
    }
});

export const { clearError, clearMessage, setUser, setUserRole } = authSlice.actions;
export default authSlice.reducer; 