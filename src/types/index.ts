
export interface User {
  id: number;
  name: string;
  role: string;
}

export interface Task {
  id: number;
  title: string;
  assignee: string;
  assigneeId: number;
  status: string;
  priority: string;
  dueDate: string;
  category: string;
  progress: number;
  subtaskCount: number;
  collaborators: number[];
  createdBy: string;
  creatorId: number;
  isRecurring?: boolean;
  recurringFromTaskId?: number;
  subtasks?: Subtask[];
  type?: string;
  isApprovalTask?: boolean;
  approvers?: Approver[];
  approvalMode?: string;
  description?: string;
  isMilestone?: boolean;
  milestoneType?: string;
  linkedTasks?: number[];
  visibility?: string;
  tasks?: any[];
}

export interface Subtask {
  id: number;
  title: string;
  assignee: string;
  assigneeId: number;
  status: string;
  priority: string;
  dueDate: string;
  progress: number;
  parentTaskId: number;
  createdBy: string;
  createdAt: string;
  description?: string;
}

export interface Approver {
  id: number;
  name: string;
  role: string;
  status: string;
  comment?: string;
  approvedAt?: string;
}

export interface CompanyStatus {
  id: number;
  code: string;
  label: string;
  description: string;
  color: string;
  isFinal: boolean;
  isDefault: boolean;
  active: boolean;
  order: number;
  systemMapping: string;
  allowedTransitions: string[];
  isSystem: boolean;
  createdAt: string;
  tooltip: string;
}

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
}

export interface RecurringTask {
  id: number;
  title: string;
  description: string;
  assigneeId: number;
  priority: string;
  category: string;
  frequency: string;
  interval: number;
  daysOfWeek?: string[];
  dayOfMonth?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  nextDueDate: string;
  lastGenerated?: string;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: number;
  userId: number;
}
