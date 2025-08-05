import { createAsyncThunk } from '@reduxjs/toolkit';
import { eventAPI } from '../../api';
import api from '../../util/axios';

// Fetch events async thunk
export const fetchEvents = createAsyncThunk(
    'event/fetchEvents',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await eventAPI.getEvents(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch events');
        }
    }
);

// Fetch event by ID async thunk
export const fetchEventById = createAsyncThunk(
    'event/fetchEventById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await eventAPI.getEventById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch event');
        }
    }
);

// Create event async thunk
export const createEvent = createAsyncThunk(
    'event/createEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await eventAPI.createEvent(eventData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create event');
        }
    }
);

// Update event async thunk
export const updateEvent = createAsyncThunk(
    'event/updateEvent',
    async ({ id, eventData }, { rejectWithValue }) => {
        try {
            const response = await eventAPI.updateEvent(id, eventData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update event');
        }
    }
);

// Delete event async thunk
export const deleteEvent = createAsyncThunk(
    'event/deleteEvent',
    async (id, { rejectWithValue }) => {
        try {
            await eventAPI.deleteEvent(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete event');
        }
    }
);

// Fetch shelters for event form
export const fetchSheltersForEvent = createAsyncThunk(
    'event/fetchSheltersForEvent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/events/shelters');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch shelters');
        }
    }
);

// Fetch volunteers for event form
export const fetchVolunteersForEvent = createAsyncThunk(
    'event/fetchVolunteersForEvent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/events/volunteers');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch volunteers');
        }
    }
);

// Fetch donors for event form
export const fetchDonorsForEvent = createAsyncThunk(
    'event/fetchDonorsForEvent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/events/donors');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch donors');
        }
    }
); 