
export const TASK_STATUSES = {
  OPEN: 'OPEN',
  INPROGRESS: 'INPROGRESS',
  ONHOLD: 'ONHOLD',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const;

export const TASK_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
} as const;

export const NOTIFICATION_TYPES = {
  ASSIGNMENT: 'assignment',
  DUE_DATE: 'due_date',
  OVERDUE: 'overdue',
  MENTION: 'mention',
  STATUS_CHANGE: 'status_change',
  SNOOZE_WAKEUP: 'snooze_wakeup',
  REMINDER: 'reminder',
} as const;

export const APPROVAL_MODES = {
  ANY: 'any',
  ALL: 'all',
  SEQUENTIAL: 'sequential',
} as const;

export const RECURRING_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const TEAM_MEMBERS = [
  { id: 1, name: "Current User" },
  { id: 2, name: "John Doe" },
  { id: 3, name: "Jane Smith" },
  { id: 4, name: "Mike Johnson" },
  { id: 5, name: "Sarah Wilson" },
  { id: 6, name: "Emily Davis" },
];
