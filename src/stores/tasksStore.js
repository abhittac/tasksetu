
import { create } from 'zustand'

const useTasksStore = create((set, get) => ({
  tasks: [
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
      id: 3,
      title: "Fix mobile responsiveness issues",
      assignee: "Mike Johnson",
      assigneeId: 4,
      status: "DONE",
      priority: "Low",
      dueDate: "2024-01-20",
      category: "Development",
      progress: 100,
      subtaskCount: 2,
      collaborators: [1],
      createdBy: "Jane Smith",
      creatorId: 3,
      subtasks: [
        { id: 201, title: "Fix header layout", status: "DONE", assignee: "Mike Johnson", assigneeId: 4, priority: "Medium", dueDate: "2024-01-18", progress: 100, parentTaskId: 3, createdBy: "Jane Smith", createdAt: "2024-01-15T10:00:00Z" },
        { id: 202, title: "Update mobile styles", status: "DONE", assignee: "Mike Johnson", assigneeId: 4, priority: "Medium", dueDate: "2024-01-19", progress: 100, parentTaskId: 3, createdBy: "Jane Smith", createdAt: "2024-01-15T11:00:00Z" },
      ],
    },
    {
      id: 4,
      title: "Conduct user research interviews",
      assignee: "Sarah Wilson",
      assigneeId: 5,
      status: "INPROGRESS",
      priority: "High",
      dueDate: "2024-01-28",
      category: "Research",
      progress: 80,
      subtaskCount: 3,
      collaborators: [1, 2],
      createdBy: "Current User",
      creatorId: 1,
      subtasks: [
        {
          id: 301,
          title: "Prepare interview questions",
          assignee: "Sarah Wilson",
          assigneeId: 5,
          status: "DONE",
          priority: "High",
          dueDate: "2024-01-25",
          progress: 100,
          parentTaskId: 4,
          createdBy: "Current User",
          createdAt: "2024-01-20T09:00:00Z",
        },
        {
          id: 302,
          title: "Schedule participant sessions",
          assignee: "Emily Davis",
          assigneeId: 6,
          status: "INPROGRESS",
          priority: "Medium",
          dueDate: "2024-01-27",
          progress: 60,
          parentTaskId: 4,
          createdBy: "Sarah Wilson",
          createdAt: "2024-01-21T10:00:00Z",
        },
        {
          id: 303,
          title: "Analyze interview data",
          assignee: "Sarah Wilson",
          assigneeId: 5,
          status: "OPEN",
          priority: "High",
          dueDate: "2024-01-30",
          progress: 0,
          parentTaskId: 4,
          createdBy: "Current User",
          createdAt: "2024-01-22T11:00:00Z",
        },
      ],
    },
  ],
  
  selectedTasks: [],
  snoozedTasks: new Set(),
  riskyTasks: new Set(),
  expandedTasks: new Set(),

  // Actions
  addTask: (taskData) => set((state) => {
    const newTask = {
      id: Date.now(),
      subtasks: [],
      subtaskCount: 0,
      collaborators: [],
      createdBy: "Current User",
      creatorId: 1,
      progress: 0,
      ...taskData,
    };
    return { tasks: [...state.tasks, newTask] };
  }),

  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === taskId 
        ? { 
            ...task, 
            ...updates,
            lastModified: new Date().toISOString(),
            lastModifiedBy: "Current User"
          } 
        : task
    )
  })),

  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== taskId),
    selectedTasks: state.selectedTasks.filter(id => id !== taskId)
  })),

  addSubtask: (parentTaskId, subtaskData) => set((state) => {
    const newSubtask = {
      id: Date.now(),
      parentTaskId,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      progress: 0,
      ...subtaskData,
    };

    return {
      tasks: state.tasks.map(task =>
        task.id === parentTaskId
          ? {
              ...task,
              subtasks: [...(task.subtasks || []), newSubtask],
              subtaskCount: (task.subtaskCount || 0) + 1,
            }
          : task
      )
    };
  }),

  updateSubtask: (parentTaskId, subtaskId, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === parentTaskId
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId
                ? { 
                    ...subtask, 
                    ...updates,
                    progress: updates.status === "DONE" ? 100 : subtask.progress
                  }
                : subtask
            ),
          }
        : task
    )
  })),

  deleteSubtask: (parentTaskId, subtaskId) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === parentTaskId
        ? {
            ...task,
            subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId),
            subtaskCount: Math.max(0, (task.subtaskCount || 0) - 1),
          }
        : task
    )
  })),

  // Selection management
  setSelectedTasks: (taskIds) => set({ selectedTasks: taskIds }),
  
  toggleTaskSelection: (taskId) => set((state) => ({
    selectedTasks: state.selectedTasks.includes(taskId)
      ? state.selectedTasks.filter(id => id !== taskId)
      : [...state.selectedTasks, taskId]
  })),

  // Bulk operations
  bulkUpdateStatus: (taskIds, newStatus) => set((state) => ({
    tasks: state.tasks.map(task =>
      taskIds.includes(task.id)
        ? { 
            ...task, 
            status: newStatus,
            progress: newStatus === "DONE" ? 100 : task.progress
          }
        : task
    )
  })),

  bulkDeleteTasks: (taskIds) => set((state) => ({
    tasks: state.tasks.filter(task => !taskIds.includes(task.id)),
    selectedTasks: []
  })),

  // Task state management
  toggleTaskExpansion: (taskId) => set((state) => {
    const newExpanded = new Set(state.expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    return { expandedTasks: newExpanded };
  }),

  toggleSnoozeTask: (taskId) => set((state) => {
    const newSnoozed = new Set(state.snoozedTasks);
    if (newSnoozed.has(taskId)) {
      newSnoozed.delete(taskId);
    } else {
      newSnoozed.add(taskId);
    }
    return { snoozedTasks: newSnoozed };
  }),

  toggleRiskyTask: (taskId) => set((state) => {
    const newRisky = new Set(state.riskyTasks);
    if (newRisky.has(taskId)) {
      newRisky.delete(taskId);
    } else {
      newRisky.add(taskId);
    }
    return { riskyTasks: newRisky };
  }),

  // Status management
  updateTaskStatus: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            status: newStatus,
            progress: newStatus === "DONE" ? 100 : task.progress,
            lastModified: new Date().toISOString(),
            lastModifiedBy: "Current User"
          }
        : task
    )
  })),

  // Getters
  getTaskById: (taskId) => {
    const state = get();
    return state.tasks.find(task => task.id === taskId);
  },

  getSubtaskById: (parentTaskId, subtaskId) => {
    const state = get();
    const parentTask = state.tasks.find(task => task.id === parentTaskId);
    return parentTask?.subtasks.find(subtask => subtask.id === subtaskId);
  },

  // Filters
  getFilteredTasks: (filters) => {
    const state = get();
    return state.tasks.filter(task => {
      // Apply search filter
      const matchesSearch = filters.searchTerm ? 
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(filters.searchTerm.toLowerCase()) : true;

      // Apply status filter
      const matchesStatus = filters.statusFilter === "all" || 
        (filters.statusFilter === "todo" && task.status === "OPEN") ||
        (filters.statusFilter === "progress" && task.status === "INPROGRESS") ||
        (filters.statusFilter === "review" && task.status === "ONHOLD") ||
        (filters.statusFilter === "completed" && task.status === "DONE");

      // Apply priority filter
      const matchesPriority = filters.priorityFilter === "all" ||
        task.priority.toLowerCase() === filters.priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }
}))

export default useTasksStore
