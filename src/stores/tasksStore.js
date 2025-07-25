import { create } from 'zustand'

const createNotification = (type, taskId, taskTitle, options = {}) => ({
  id: Date.now() + Math.random(),
  type,
  taskId,
  taskTitle,
  message: options.message || `Notification for task "${taskTitle}"`,
  timestamp: new Date().toISOString(),
  read: false,
  ...options
})

const scheduleReminder = (task, type, daysBefore) => {
  const dueDate = new Date(task.dueDate)
  const reminderDate = new Date(dueDate.setDate(dueDate.getDate() - daysBefore))
  const message = `Reminder: Task "${task.title}" due in ${daysBefore} days`

  return {
    id: Date.now() + Math.random(),
    taskId: task.id,
    type,
    scheduledFor: reminderDate.toISOString(),
    message,
    active: true
  }
}

const useTasksStore = create((set, get) => ({
  // Notifications and reminders
  notifications: [],
  reminders: [],
  notificationSettings: {
    taskAssignment: true,
    dueDateReminders: true,
    overdueReminders: true,
    commentMentions: true,
    statusChanges: true,
    customReminders: true,
    snoozeWakeup: true,
    reminderDays: [3, 1], // Days before due date
    deliveryMethod: 'both', // 'app', 'email', 'both'
    quietHours: { enabled: false, start: '22:00', end: '08:00' },
    doNotDisturb: false
  },

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
  addTask: (taskData) => {
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

    set((state) => {
      const notifications = []
      const reminders = []

      // Create assignment notification
      if (state.notificationSettings.taskAssignment && newTask.assigneeId) {
        notifications.push(createNotification('assignment', newTask.id, newTask.title, {
          message: `You have been assigned "${newTask.title}"`,
          assigneeId: newTask.assigneeId,
          priority: newTask.priority || 'medium'
        }))
      }

      // Schedule due date reminders
      if (state.notificationSettings.dueDateReminders && newTask.dueDate) {
        state.notificationSettings.reminderDays.forEach(days => {
          reminders.push(scheduleReminder(newTask, 'due_date', days))
        })
      }

      return {
        tasks: [...state.tasks, newTask],
        notifications: [...state.notifications, ...notifications],
        reminders: [...state.reminders, ...reminders]
      }
    })
  },

  updateTask: (id, updates) => {
    set((state) => {
      const task = state.tasks.find(t => t.id === id)
      if (!task) return state

      const notifications = []

      // Status change notification
      if (updates.status && updates.status !== task.status && state.notificationSettings.statusChanges) {
        notifications.push(createNotification('status_change', id, task.title, {
          message: `Task "${task.title}" status changed from ${task.status} to ${updates.status}`,
          oldStatus: task.status,
          newStatus: updates.status,
          priority: task.priority || 'medium'
        }))
      }

      // Priority change notification
      if (updates.priority && updates.priority !== task.priority) {
        notifications.push(createNotification('priority_change', id, task.title, {
          message: `Task "${task.title}" priority changed from ${task.priority} to ${updates.priority}`,
          oldPriority: task.priority,
          newPriority: updates.priority,
          priority: updates.priority
        }))
      }

      // Assignment change notification
      if (updates.assigneeId && updates.assigneeId !== task.assigneeId && state.notificationSettings.taskAssignment) {
        notifications.push(createNotification('assignment', id, task.title, {
          message: `Task "${task.title}" has been reassigned to you`,
          assigneeId: updates.assigneeId,
          priority: task.priority || 'medium'
        }))
      }

      return {
        tasks: state.tasks.map(t => 
          t.id === id ? { ...t, ...updates } : t
        ),
        notifications: [...state.notifications, ...notifications]
      }
    })
  },

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

  // Notification management
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),

  markNotificationRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    )
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  deleteNotification: (notificationId) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== notificationId)
  })),

  // Reminder management
  addReminder: (reminder) => set((state) => ({
    reminders: [...state.reminders, reminder]
  })),

  snoozeTask: (taskId, snoozeUntil, note = '') => {
    set((state) => {
      const task = state.tasks.find(t => t.id === taskId)
      if (!task) return state

      const notification = createNotification('task_snoozed', taskId, task.title, {
        message: `Task "${task.title}" snoozed until ${new Date(snoozeUntil).toLocaleDateString()}`,
        snoozeUntil,
        note,
        priority: task.priority || 'medium'
      })

      // Schedule wake-up reminder
      const wakeupReminder = {
        id: Date.now() + Math.random(),
        taskId,
        type: 'snooze_wakeup',
        scheduledFor: snoozeUntil,
        message: `Snoozed task "${task.title}" is now active`,
        active: true
      }

      return {
        tasks: state.tasks.map(t =>
          t.id === taskId ? { ...t, snoozedUntil: snoozeUntil, snoozeNote: note } : t
        ),
        notifications: [notification, ...state.notifications],
        reminders: [...state.reminders, wakeupReminder]
      }
    })
  },

  addCustomReminder: (taskId, reminderDate, message) => {
    const task = get().tasks.find(t => t.id === taskId)
    if (!task) return

    const reminder = {
      id: Date.now() + Math.random(),
      taskId,
      type: 'custom',
      scheduledFor: reminderDate,
      message: message || `Reminder for task "${task.title}"`,
      active: true
    }

    set((state) => ({
      reminders: [...state.reminders, reminder]
    }))
  },

  // Check for due notifications and overdue tasks
  checkReminders: () => {
    const now = new Date()
    const state = get()

    state.reminders.forEach(reminder => {
      if (reminder.active && new Date(reminder.scheduledFor) <= now) {
        const task = state.tasks.find(t => t.id === reminder.taskId)
        if (task) {
          let notificationType = reminder.type
          let message = reminder.message

          if (reminder.type === 'due_date') {
            notificationType = 'due_date'
            message = reminder.message
          } else if (reminder.type === 'snooze_wakeup') {
            notificationType = 'snooze_wakeup'
          }

          const notification = createNotification(notificationType, task.id, task.title, {
            message,
            priority: task.priority || 'medium'
          })

          set((prevState) => ({
            notifications: [notification, ...prevState.notifications],
            reminders: prevState.reminders.map(r =>
              r.id === reminder.id ? { ...r, active: false } : r
            )
          }))
        }
      }
    })

    // Check for overdue tasks
    state.tasks.forEach(task => {
      if (task.dueDate && task.status !== 'DONE') {
        const dueDate = new Date(task.dueDate)
        const daysPastDue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24))

        if (daysPastDue > 0 && state.notificationSettings.overdueReminders) {
          // Check if we already sent overdue notification today
          const todayOverdueExists = state.notifications.some(n => 
            n.taskId === task.id && 
            n.type === 'overdue' && 
            new Date(n.timestamp).toDateString() === now.toDateString()
          )

          if (!todayOverdueExists) {
            const notification = createNotification('overdue', task.id, task.title, {
              message: `Task "${task.title}" is ${daysPastDue} ${daysPastDue === 1 ? 'day' : 'days'} overdue`,
              daysPastDue,
              priority: 'critical'
            })

            set((prevState) => ({
              notifications: [notification, ...prevState.notifications]
            }))
          }
        }
      }
    })
  },

  updateNotificationSettings: (settings) => set((state) => ({
    notificationSettings: { ...state.notificationSettings, ...settings }
  })),

  // Get task status helpers
  getTaskStatus: (taskId) => {
    const task = get().tasks.find(t => t.id === taskId)
    if (!task) return null

    const now = new Date()
    const isOverdue = task.dueDate && new Date(task.dueDate) < now && task.status !== 'DONE'
    const isSnoozed = task.snoozedUntil && new Date(task.snoozedUntil) > now
    const hasReminders = get().reminders.some(r => r.taskId === taskId && r.active)

    return {
      isOverdue,
      isSnoozed,
      hasReminders,
      task
    }
  },

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