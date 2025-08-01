import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slice/authSlice';
import userReducer from './slice/userSlice';
import petReducer from './slice/petSlice';
import adoptionReducer from './slice/adoptionSlice';
import donationReducer from './slice/donationSlice';
import eventReducer from './slice/eventSlice';
import cartReducer from './slice/cartSlice';
import petManagementReducer from './slice/petManagementSlice';
import userManagementReducer from './slice/userManagementSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'cart'] // Chỉ persist những slice cần thiết
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: persistedUserReducer,
    pet: petReducer,
    adoption: adoptionReducer,
    donation: donationReducer,
    event: eventReducer,
    cart: persistedCartReducer,
    petManagement: petManagementReducer,
    userManagement: userManagementReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

