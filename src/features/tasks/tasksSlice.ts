
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, Subtask, CompanyStatus } from '../../types';

interface TasksState {
  tasks: Task[];
  companyStatuses: CompanyStatus[];
  statusHistory: any[];
  filters: {
    searchTerm: string;
    statusFilter: string;
    priorityFilter: string;
    taskTypeFilter: string;
    sortBy: string;
  };
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Update user authentication system",
    assignee: "John Doe",
    assigneeId: 2,
    status: "INPROGRESS",
    priority: "High",
    dueDate: "2024-01-25",
    category: "Development",
    progress: 60,
    subtaskCount: 3,
    collaborators: [1, 3],
    createdBy: "Current User",
    creatorId: 1,
    isRecurring: false,
    subtasks: [
      {
        id: 101,
        title: "Setup OAuth providers",
        assignee: "John Doe",
        assigneeId: 2,
        status: "DONE",
        priority: "High",
        dueDate: "2024-01-22",
        progress: 100,
        parentTaskId: 1,
        createdBy: "Current User",
        createdAt: "2024-01-15T09:00:00Z",
      },
      {
        id: 102,
        title: "Implement session management",
        assignee: "Jane Smith",
        assigneeId: 3,
        status: "INPROGRESS",
        priority: "High",
        dueDate: "2024-01-24",
        progress: 75,
        parentTaskId: 1,
        createdBy: "Current User",
        createdAt: "2024-01-16T10:00:00Z",
      },
      {
        id: 103,
        title: "Add password reset flow",
        assignee: "Mike Johnson",
        assigneeId: 4,
        status: "OPEN",
        priority: "Medium",
        dueDate: "2024-01-26",
        progress: 0,
        parentTaskId: 1,
        createdBy: "Current User",
        createdAt: "2024-01-17T11:00:00Z",
      },
    ],
  },
  {
    id: 2,
    title: "Design new landing page",
    assignee: "Jane Smith",
    assigneeId: 3,
    status: "OPEN",
    priority: "Medium",
    dueDate: "2024-01-30",
    category: "Design",
    progress: 0,
    subtaskCount: 0,
    collaborators: [],
    createdBy: "Current User",
    creatorId: 1,
    subtasks: [],
  },
  {
    id: 8,
    title: "Budget Approval for Q2",
    assignee: "Finance Team",
    assigneeId: 8,
    status: "OPEN",
    priority: "High",
    dueDate: "2024-01-31",
    category: "Approval",
    progress: 0,
    subtaskCount: 0,
    collaborators: [],
    createdBy: "Current User",
    creatorId: 1,
    isApprovalTask: true,
    approvers: [
      { id: 1, name: "Current User", role: "Admin", status: "pending" },
      { id: 9, name: "Finance Director", role: "Director", status: "pending" },
    ],
    approvalMode: "all",
    subtasks: [],
  },
];

const initialCompanyStatuses: CompanyStatus[] = [
  {
    id: 1,
    code: "OPEN",
    label: "Open",
    description: "Task is created but not yet started",
    color: "#6c757d",
    isFinal: false,
    isDefault: true,
    active: true,
    order: 1,
    systemMapping: "SYS_OPEN",
    allowedTransitions: ["INPROGRESS", "ONHOLD", "CANCELLED"],
    isSystem: false,
    createdAt: "2024-01-01T00:00:00Z",
    tooltip: "New task ready to be started",
  },
  {
    id: 2,
    code: "INPROGRESS",
    label: "In Progress",
    description: "Task is being actively worked on",
    color: "#3498db",
    isFinal: false,
    isDefault: false,
    active: true,
    order: 2,
    systemMapping: "SYS_INPROGRESS",
    allowedTransitions: ["ONHOLD", "DONE", "CANCELLED"],
    isSystem: false,
    createdAt: "2024-01-01T00:00:00Z",
    tooltip: "Work is currently in progress on this task",
  },
  {
    id: 4,
    code: "DONE",
    label: "Completed",
    description: "Task has been completed successfully",
    color: "#28a745",
    isFinal: true,
    isDefault: false,
    active: true,
    order: 4,
    systemMapping: "SYS_DONE",
    allowedTransitions: [],
    isSystem: false,
    createdAt: "2024-01-01T00:00:00Z",
    tooltip: "Task has been successfully completed",
  },
];

const initialState: TasksState = {
  tasks: initialTasks,
  companyStatuses: initialCompanyStatuses,
  statusHistory: [],
  filters: {
    searchTerm: '',
    statusFilter: 'all',
    priorityFilter: 'all',
    taskTypeFilter: 'all',
    sortBy: 'dueDate',
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: number; status: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
        task.progress = action.payload.status === "DONE" ? 100 : task.progress;
      }
    },
    addSubtask: (state, action: PayloadAction<{ parentTaskId: number; subtask: Subtask }>) => {
      const task = state.tasks.find(t => t.id === action.payload.parentTaskId);
      if (task) {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push(action.payload.subtask);
        task.subtaskCount = (task.subtaskCount || 0) + 1;
      }
    },
    updateSubtask: (state, action: PayloadAction<{ parentTaskId: number; subtask: Subtask }>) => {
      const task = state.tasks.find(t => t.id === action.payload.parentTaskId);
      if (task && task.subtasks) {
        const subtaskIndex = task.subtasks.findIndex(s => s.id === action.payload.subtask.id);
        if (subtaskIndex !== -1) {
          task.subtasks[subtaskIndex] = action.payload.subtask;
        }
      }
    },
    deleteSubtask: (state, action: PayloadAction<{ parentTaskId: number; subtaskId: number }>) => {
      const task = state.tasks.find(t => t.id === action.payload.parentTaskId);
      if (task && task.subtasks) {
        task.subtasks = task.subtasks.filter(s => s.id !== action.payload.subtaskId);
        task.subtaskCount = Math.max(0, (task.subtaskCount || 0) - 1);
      }
    },
    setFilters: (state, action: PayloadAction<Partial<TasksState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    bulkUpdateTasks: (state, action: PayloadAction<{ taskIds: number[]; updates: Partial<Task> }>) => {
      const { taskIds, updates } = action.payload;
      state.tasks = state.tasks.map(task => 
        taskIds.includes(task.id) ? { ...task, ...updates } : task
      );
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  setFilters,
  bulkUpdateTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
