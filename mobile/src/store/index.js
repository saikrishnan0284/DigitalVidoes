import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import vendorReducer from './slices/vendorSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    vendor: vendorReducer,
    chat: chatReducer,
    notification: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/connected', 'socket/message'],
        ignoredPaths: ['socket.instance']
      }
    })
});
