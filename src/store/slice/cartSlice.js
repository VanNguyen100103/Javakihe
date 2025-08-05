import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchUserCart, 
    addToCart, 
    fetchGuestCart,
    removeFromGuestCart,
    removeFromUserCart,
    clearUserCart,
    mergeCart,
    clearCart
} from '../asyncAction/cartAsyncAction';

const initialState = {
    userCart: {
        items: [],
        total: 0
    },
    guestCart: {
        items: [],
        total: 0
    },
    isLoading: false,
    error: null,
    message: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setGuestCart: (state, action) => {
            state.guestCart = action.payload;
        },
        setUserCart: (state, action) => {
            state.userCart = action.payload;
        },
        clearGuestCart: (state) => {
            state.guestCart = initialState.guestCart;
        },
        // Manual update guest cart with item
        addItemToGuestCart: (state, action) => {
            const { pet } = action.payload;
            if (!state.guestCart.items.find(item => item.pet.id === pet.id)) {
                state.guestCart.items.push({ pet, id: pet.id });
                state.guestCart.total = state.guestCart.items.length;
            }
        }
    },
    extraReducers: (builder) => {
        // Fetch user cart
        builder.addCase(fetchUserCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchUserCart.fulfilled, (state, action) => {
            state.isLoading = false;
            // Backend returns array of pets directly, convert to cart format
            const pets = Array.isArray(action.payload) ? action.payload : [];
            console.log('=== fetchUserCart.fulfilled ===');
            console.log('action.payload:', action.payload);
            console.log('pets array:', pets);
            state.userCart = {
                items: pets.map(pet => ({ pet, id: pet.id })),
                total: pets.length
            };
            console.log('final userCart:', state.userCart);
        });
        builder.addCase(fetchUserCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Add to cart
        builder.addCase(addToCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log('=== addToCart.fulfilled ===');
            console.log('action.payload:', action.payload);
            
            // Backend returns cart data with pets array
            if (action.payload && action.payload.pets) {
                console.log('Pets found in payload:', action.payload.pets.length);
                // Check if this is a guest cart response (has token) or user cart response
                if (action.payload.token) {
                    console.log('This is a guest cart response');
                    // Guest cart response
                    state.guestCart = {
                        items: action.payload.pets.map(pet => ({ pet, id: pet.id })),
                        total: action.payload.pets.length
                    };
                    console.log('Updated guestCart:', state.guestCart);
                } else {
                    console.log('This is a user cart response');
                    // User cart response
                    state.userCart = {
                        items: action.payload.pets.map(pet => ({ pet, id: pet.id })),
                        total: action.payload.pets.length
                    };
                    console.log('Updated userCart:', state.userCart);
                }
            } else {
                console.log('No pets in payload or payload is null');
                // Temporary fix: If no pets in payload but we have a token, 
                // it means it's a guest cart response but pets array is empty
                if (action.payload && action.payload.token) {
                    console.log('Guest cart response with empty pets, creating dummy item');
                    // This is a temporary fix - in real scenario, backend should return pets
                    state.guestCart = {
                        items: [{ pet: { id: 'temp' }, id: 'temp' }],
                        total: 1
                    };
                }
            }
            state.message = 'Item added to cart successfully';
        });
        builder.addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Merge cart
        builder.addCase(mergeCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(mergeCart.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log('=== mergeCart.fulfilled ===');
            console.log('action.payload:', action.payload);
            
            if (action.payload && action.payload.pets) {
                state.userCart = {
                    items: action.payload.pets.map(pet => ({ pet, id: pet.id })),
                    total: action.payload.pets.length
                };
                console.log('Updated userCart after merge:', state.userCart);
            }
            
            // Clear guest cart after successful merge
            state.guestCart = {
                items: [],
                total: 0
            };
            console.log('Cleared guestCart after merge');
            
            state.message = 'Cart merged successfully';
        });
        builder.addCase(mergeCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.error('=== mergeCart.rejected ===', action.payload);
        });

        // Clear cart
        builder.addCase(clearCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(clearCart.fulfilled, (state) => {
            state.isLoading = false;
            state.userCart = initialState.userCart;
            state.message = 'Cart cleared successfully';
        });
        builder.addCase(clearCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch guest cart
        builder.addCase(fetchGuestCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchGuestCart.fulfilled, (state, action) => {
            state.isLoading = false;
            // Backend returns GuestCartResponseDTO with pets array
            if (action.payload.pets) {
                state.guestCart = {
                    items: action.payload.pets.map(pet => ({ pet, id: pet.id })),
                    total: action.payload.pets.length
                };
            } else {
                state.guestCart = initialState.guestCart;
            }
        });
        builder.addCase(fetchGuestCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Remove from guest cart
        builder.addCase(removeFromGuestCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(removeFromGuestCart.fulfilled, (state, action) => {
            state.isLoading = false;
            // Backend returns updated guest cart
            if (action.payload.pets) {
                state.guestCart = {
                    items: action.payload.pets.map(pet => ({ pet, id: pet.id })),
                    total: action.payload.pets.length
                };
            }
            state.message = 'Item removed from cart successfully';
        });
        builder.addCase(removeFromGuestCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Remove from user cart
        builder.addCase(removeFromUserCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(removeFromUserCart.fulfilled, (state, action) => {
            state.isLoading = false;
            // Backend returns updated user cart (array of pets)
            if (Array.isArray(action.payload)) {
                state.userCart = {
                    items: action.payload.map(pet => ({ pet, id: pet.id })),
                    total: action.payload.length
                };
            }
            state.message = 'Item removed from cart successfully';
        });
        builder.addCase(removeFromUserCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Clear user cart
        builder.addCase(clearUserCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(clearUserCart.fulfilled, (state) => {
            state.isLoading = false;
            state.userCart = initialState.userCart;
            state.message = 'Cart cleared successfully';
        });
        builder.addCase(clearUserCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});

export const { 
    clearError, 
    clearMessage, 
    setGuestCart,
    setUserCart,
    addItemToGuestCart
} = cartSlice.actions;
export default cartSlice.reducer; 