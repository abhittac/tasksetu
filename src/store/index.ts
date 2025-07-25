
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import tasksSlice from '../features/tasks/tasksSlice';
import authSlice from '../features/auth/authSlice';
import uiSlice from '../features/ui/uiSlice';
import notificationsSlice from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    auth: authSlice,
    ui: uiSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
