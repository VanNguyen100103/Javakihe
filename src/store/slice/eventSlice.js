import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchEvents, 
    fetchEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    fetchSheltersForEvent,
    fetchVolunteersForEvent,
    fetchDonorsForEvent
} from '../asyncAction/eventAsyncAction';

const initialState = {
    events: [],
    currentEvent: null,
    shelters: [], // Add shelters state
    volunteers: [], // Add volunteers state
    donors: [], // Add donors state
    isLoading: false,
    error: null,
    message: null,
    pagination: {
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10
    },
    filters: {
        search: '',
        category: '',
        status: '',
        dateFrom: '',
        dateTo: ''
    }
};

const eventSlice = createSlice({
    name: 'event',
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
        setCurrentEvent: (state, action) => {
            state.currentEvent = action.payload;
        },
        clearCurrentEvent: (state) => {
            state.currentEvent = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch events
        builder.addCase(fetchEvents.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            state.isLoading = false;
            // Đảm bảo events luôn là array
            if (Array.isArray(action.payload)) {
                state.events = action.payload;
            } else if (action.payload.content && Array.isArray(action.payload.content)) {
                state.events = action.payload.content;
            } else {
                state.events = [];
            }
            state.pagination = action.payload.pageable ? {
                page: action.payload.pageable.pageNumber,
                size: action.payload.pageable.pageSize,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages
            } : {
                page: 0,
                size: 10,
                totalElements: Array.isArray(action.payload) ? action.payload.length : 0,
                totalPages: 1
            };
        });
        builder.addCase(fetchEvents.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch event by ID
        builder.addCase(fetchEventById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchEventById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentEvent = action.payload;
        });
        builder.addCase(fetchEventById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Create event
        builder.addCase(createEvent.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createEvent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.events.unshift(action.payload);
            state.message = 'Event created successfully';
        });
        builder.addCase(createEvent.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update event
        builder.addCase(updateEvent.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.events.findIndex(event => event.id === action.payload.id);
            if (index !== -1) {
                state.events[index] = action.payload;
            }
            if (state.currentEvent && state.currentEvent.id === action.payload.id) {
                state.currentEvent = action.payload;
            }
            state.message = 'Event updated successfully';
        });
        builder.addCase(updateEvent.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Delete event
        builder.addCase(deleteEvent.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteEvent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.events = state.events.filter(event => event.id !== action.payload);
            if (state.currentEvent && state.currentEvent.id === action.payload) {
                state.currentEvent = null;
            }
            state.message = 'Event deleted successfully';
        });
        builder.addCase(deleteEvent.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch shelters for event form
        builder.addCase(fetchSheltersForEvent.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchSheltersForEvent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.shelters = action.payload;
        });
        builder.addCase(fetchSheltersForEvent.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch volunteers for event form
        builder.addCase(fetchVolunteersForEvent.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchVolunteersForEvent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.volunteers = action.payload;
        });
        builder.addCase(fetchVolunteersForEvent.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch donors for event form
        builder.addCase(fetchDonorsForEvent.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchDonorsForEvent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.donors = action.payload;
        });
        builder.addCase(fetchDonorsForEvent.rejected, (state, action) => {
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
    setCurrentEvent, 
    clearCurrentEvent 
} = eventSlice.actions;
export default eventSlice.reducer; 