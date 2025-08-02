import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchAdoptions, 
    fetchAllAdoptions,
    createAdoption, 
    adoptFromCart,
    submitAdoptionTest,
    updateAdoption, 
    updateAdoptionStatus,
    deleteAdoption 
} from '../asyncAction/adoptionAsyncAction';

const initialState = {
    adoptions: [],
    testResult: null,
    isLoading: false,
    error: null,
    message: null
};

const adoptionSlice = createSlice({
    name: 'adoption',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        clearTestResult: (state) => {
            state.testResult = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch adoptions (user's adoptions)
        builder.addCase(fetchAdoptions.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchAdoptions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.adoptions = action.payload;
        });
        builder.addCase(fetchAdoptions.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Fetch all adoptions (for admin/shelter)
        builder.addCase(fetchAllAdoptions.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchAllAdoptions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.adoptions = action.payload;
        });
        builder.addCase(fetchAllAdoptions.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Create adoption
        builder.addCase(createAdoption.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createAdoption.fulfilled, (state, action) => {
            state.isLoading = false;
            state.adoptions.push(action.payload);
            state.message = 'Đơn xin nhận nuôi đã được gửi thành công!';
        });
        builder.addCase(createAdoption.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update adoption status (for admin/shelter)
        builder.addCase(updateAdoptionStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateAdoptionStatus.fulfilled, (state, action) => {
            console.log('=== updateAdoptionStatus.fulfilled ===');
            console.log('action.payload:', action.payload);
            console.log('typeof action.payload:', typeof action.payload);
            
            state.isLoading = false;
            
            // Check if payload exists and has id
            if (action.payload && action.payload.id) {
                const index = state.adoptions.findIndex(adoption => adoption.id === action.payload.id);
                console.log('Found adoption at index:', index);
                if (index !== -1) {
                    state.adoptions[index] = action.payload;
                    console.log('Updated adoption in state');
                } else {
                    console.log('Adoption not found in state, adding to list');
                    state.adoptions.push(action.payload);
                }
                state.message = 'Cập nhật trạng thái đơn nhận nuôi thành công!';
            } else {
                console.error('Invalid payload in updateAdoptionStatus.fulfilled:', action.payload);
                state.error = 'Dữ liệu cập nhật không hợp lệ!';
            }
        });
        builder.addCase(updateAdoptionStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Adopt from cart
        builder.addCase(adoptFromCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(adoptFromCart.fulfilled, (state, action) => {
            console.log('=== adoptFromCart.fulfilled ===');
            console.log('action.payload:', action.payload);
            console.log('typeof action.payload:', typeof action.payload);
            console.log('Array.isArray(action.payload):', Array.isArray(action.payload));
            
            state.isLoading = false;
            
            // Handle payload correctly - could be array or single object
            if (Array.isArray(action.payload)) {
                console.log('Payload is array, length:', action.payload.length);
                state.adoptions.push(...action.payload);
            } else if (action.payload) {
                console.log('Payload is single object');
                state.adoptions.push(action.payload);
            } else {
                console.log('Payload is null/undefined');
            }
            
            state.message = 'Đã gửi đơn nhận nuôi từ giỏ hàng thành công!';
        });
        builder.addCase(adoptFromCart.rejected, (state, action) => {
            console.log('=== adoptFromCart.rejected ===');
            console.log('action.payload:', action.payload);
            state.isLoading = false;
            state.error = action.payload;
        });

        // Submit adoption test
        builder.addCase(submitAdoptionTest.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(submitAdoptionTest.fulfilled, (state, action) => {
            console.log('=== submitAdoptionTest.fulfilled ===');
            console.log('action.payload:', action.payload);
            state.isLoading = false;
            
            // Kiểm tra payload có hợp lệ không
            if (action.payload && typeof action.payload.score === 'number') {
                state.testResult = action.payload;
                state.message = `Bài test hoàn thành! Điểm của bạn: ${action.payload.score}/100`;
            } else {
                console.error('Invalid payload in submitAdoptionTest.fulfilled:', action.payload);
                state.error = 'Kết quả bài test không hợp lệ!';
            }
        });
        builder.addCase(submitAdoptionTest.rejected, (state, action) => {
            console.log('=== submitAdoptionTest.rejected ===');
            console.log('action.payload:', action.payload);
            state.isLoading = false;
            state.error = action.payload;
        });

        // Update adoption
        builder.addCase(updateAdoption.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateAdoption.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.adoptions.findIndex(adoption => adoption.id === action.payload.id);
            if (index !== -1) {
                state.adoptions[index] = action.payload;
            }
            state.message = 'Cập nhật đơn xin nhận nuôi thành công!';
        });
        builder.addCase(updateAdoption.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Delete adoption
        builder.addCase(deleteAdoption.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteAdoption.fulfilled, (state, action) => {
            state.isLoading = false;
            state.adoptions = state.adoptions.filter(adoption => adoption.id !== action.payload);
            state.message = 'Xóa đơn xin nhận nuôi thành công!';
        });
        builder.addCase(deleteAdoption.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});

export const { clearError, clearMessage, clearTestResult } = adoptionSlice.actions;
export default adoptionSlice.reducer; 