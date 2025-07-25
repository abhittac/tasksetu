
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "assignment",
    title: "New Task Assigned",
    message: "You have been assigned to 'Update user authentication system'",
    read: false,
    createdAt: "2024-01-20T10:30:00Z",
    taskId: 1,
    userId: 1,
  },
  {
    id: 2,
    type: "due_date",
    title: "Task Due Soon",
    message: "Task 'Design new landing page' is due in 2 days",
    read: false,
    createdAt: "2024-01-20T09:15:00Z",
    taskId: 2,
    userId: 1,
  },
];

const initialState: NotificationsState = {
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter(n => !n.read).length,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<number>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
