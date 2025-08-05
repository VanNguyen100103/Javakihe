import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../api/cart';

// Fetch user cart
export const fetchUserCart = createAsyncThunk(
    'cart/fetchUserCart',
    async (_, { rejectWithValue }) => {
        console.log('=== fetchUserCart called ===');
        try {
            const response = await cartAPI.getUserCart();
            console.log('=== fetchUserCart full response ===', response);
            console.log('=== fetchUserCart response.data ===', response.data);
            // Return response.data or response directly
            return response.data || response;
        } catch (error) {
            console.log('=== fetchUserCart error ===', error);
            return rejectWithValue(error.response?.data || 'Failed to fetch cart');
        }
    }
);

// Add to cart (for both user and guest)
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ petId, token = null }, { rejectWithValue }) => {
        try {
            // If no token provided and user is not authenticated, get guest token from localStorage
            let guestToken = token;
            if (!guestToken) {
                guestToken = localStorage.getItem('guestCartToken');
            }
            
            console.log('=== addToCart called ===');
            console.log('petId:', petId);
            console.log('guestToken:', guestToken);
            
            const response = await cartAPI.addToCart(petId, guestToken);
            
            console.log('=== addToCart response ===');
            console.log('Full response:', response);
            console.log('response.data:', response.data);
            console.log('response.data type:', typeof response.data);
            console.log('response.data.pets:', response.data?.pets);
            console.log('response.data.token:', response.data?.token);
            
            // If this is a guest cart response, save the token
            if (response.data && response.data.token) {
                localStorage.setItem('guestCartToken', response.data.token);
                console.log('Saved guest token:', response.data.token);
            }
            
            return response.data;
        } catch (error) {
            console.error('=== addToCart error ===', error);
            return rejectWithValue(error.response?.data || 'Failed to add to cart');
        }
    }
);

// Get guest cart
export const fetchGuestCart = createAsyncThunk(
    'cart/fetchGuestCart',
    async (token, { rejectWithValue }) => {
        try {
            const response = await cartAPI.getGuestCart(token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch guest cart');
        }
    }
);

// Remove item from guest cart
export const removeFromGuestCart = createAsyncThunk(
    'cart/removeFromGuestCart',
    async ({ petId, token }, { rejectWithValue }) => {
        try {
            const response = await cartAPI.removeFromGuestCart(petId, token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to remove from guest cart');
        }
    }
);

// Remove item from user cart
export const removeFromUserCart = createAsyncThunk(
    'cart/removeFromUserCart',
    async (petId, { rejectWithValue }) => {
        try {
            const response = await cartAPI.removeFromUserCart(petId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to remove from user cart');
        }
    }
);

// Clear user cart
export const clearUserCart = createAsyncThunk(
    'cart/clearUserCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartAPI.clearUserCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to clear user cart');
        }
    }
);

// Merge guest cart to user cart
export const mergeCart = createAsyncThunk(
    'cart/mergeCart',
    async (token, { rejectWithValue }) => {
        try {
            console.log('=== mergeCart called ===');
            console.log('Token:', token);
            
            const response = await cartAPI.mergeCart(token);
            console.log('=== mergeCart response ===');
            console.log('Response:', response);
            
            return response.data;
        } catch (error) {
            console.error('=== mergeCart error ===', error);
            return rejectWithValue(error.response?.data || 'Failed to merge cart');
        }
    }
);

// Clear cart
export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartAPI.clearCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to clear cart');
        }
    }
); 