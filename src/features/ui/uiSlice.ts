
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Toast } from '../../types';

interface UIState {
  showCreateTaskDrawer: boolean;
  showCalendarView: boolean;
  selectedTaskId: number | null;
  currentView: string;
  toast: Toast;
  snoozedTasks: Set<number>;
  riskyTasks: Set<number>;
  expandedTasks: Set<number>;
  selectedTasks: number[];
}

const initialState: UIState = {
  showCreateTaskDrawer: false,
  showCalendarView: false,
  selectedTaskId: null,
  currentView: 'dashboard',
  toast: {
    message: '',
    type: 'success',
    isVisible: false,
  },
  snoozedTasks: new Set(),
  riskyTasks: new Set(),
  expandedTasks: new Set(),
  selectedTasks: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowCreateTaskDrawer: (state, action: PayloadAction<boolean>) => {
      state.showCreateTaskDrawer = action.payload;
    },
    setShowCalendarView: (state, action: PayloadAction<boolean>) => {
      state.showCalendarView = action.payload;
    },
    setSelectedTaskId: (state, action: PayloadAction<number | null>) => {
      state.selectedTaskId = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: Toast['type'] }>) => {
      state.toast = {
        ...action.payload,
        isVisible: true,
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    toggleSnoozedTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      const newSet = new Set(state.snoozedTasks);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      state.snoozedTasks = newSet;
    },
    toggleRiskyTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      const newSet = new Set(state.riskyTasks);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      state.riskyTasks = newSet;
    },
    toggleExpandedTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      const newSet = new Set(state.expandedTasks);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      state.expandedTasks = newSet;
    },
    setSelectedTasks: (state, action: PayloadAction<number[]>) => {
      state.selectedTasks = action.payload;
    },
  },
});

export const {
  setShowCreateTaskDrawer,
  setShowCalendarView,
  setSelectedTaskId,
  setCurrentView,
  showToast,
  hideToast,
  toggleSnoozedTask,
  toggleRiskyTask,
  toggleExpandedTask,
  setSelectedTasks,
} = uiSlice.actions;

export default uiSlice.reducer;
