
import { Task, CompanyStatus } from '../types';
import { TASK_STATUSES } from './constants';

export const getTaskType = (task: Task): string => {
  if (task.isApprovalTask) return "Approval Task";
  if (task.isRecurring || task.recurringFromTaskId) return "Recurring Task";
  if (task.category === "Milestone" || task.type === "milestone") return "Milestone";
  return "Simple Task";
};

export const canMarkAsCompleted = (task: Task): boolean => {
  if (!task.subtasks || task.subtasks.length === 0) return true;

  const incompleteSubtasks = task.subtasks.filter(
    (subtask) => subtask.status !== "DONE" && subtask.status !== "CANCELLED"
  );

  return incompleteSubtasks.length === 0;
};

export const getValidStatusTransitions = (
  currentStatusCode: string,
  companyStatuses: CompanyStatus[],
  task?: Task
): string[] => {
  const currentStatus = companyStatuses.find(
    (s) => s.code === currentStatusCode && s.active
  );
  
  if (!currentStatus) return [];

  let validTransitions = currentStatus.allowedTransitions.filter(
    (transitionCode) => {
      const targetStatus = companyStatuses.find(
        (s) => s.code === transitionCode && s.active
      );
      return targetStatus !== null;
    }
  );

  // Apply sub-task completion logic for parent tasks
  if (task && task.subtasks && task.subtasks.length > 0) {
    const hasIncompleteSubtasks = task.subtasks.some(
      (subtask) => subtask.status !== "DONE" && subtask.status !== "CANCELLED"
    );

    // Block completion if sub-tasks are incomplete
    if (hasIncompleteSubtasks) {
      validTransitions = validTransitions.filter(
        (transition) => transition !== "DONE"
      );
    }
  }

  return validTransitions;
};

export const getStatusColor = (statusCode: string, companyStatuses: CompanyStatus[]): string => {
  const status = companyStatuses.find((s) => s.code === statusCode);
  return status ? status.color : "#6c757d";
};

export const getStatusLabel = (statusCode: string, companyStatuses: CompanyStatus[]): string => {
  const status = companyStatuses.find((s) => s.code === statusCode);
  return status ? status.label : statusCode;
};

export const getPriorityColor = (priority: string): string => {
  const colors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Urgent: "bg-red-100 text-red-800",
  };
  return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const calculateTaskProgress = (task: Task): number => {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.progress || 0;
  }

  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.status === "DONE"
  ).length;

  return Math.round((completedSubtasks / task.subtasks.length) * 100);
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === "DONE") return false;
  
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dueDate < today;
};

export const getTasksForDate = (tasks: Task[], date: string): Task[] => {
  return tasks.filter(task => task.dueDate === date);
};

export const filterTasks = (
  tasks: Task[],
  filters: {
    searchTerm: string;
    statusFilter: string;
    priorityFilter: string;
    taskTypeFilter: string;
  }
): Task[] => {
  return tasks.filter((task) => {
    // Apply search filter
    const matchesSearch =
      task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(filters.searchTerm.toLowerCase());

    // Apply status filter
    const matchesStatus =
      filters.statusFilter === "all" ||
      (filters.statusFilter === "todo" && task.status === "OPEN") ||
      (filters.statusFilter === "progress" && task.status === "INPROGRESS") ||
      (filters.statusFilter === "review" && task.status === "ONHOLD") ||
      (filters.statusFilter === "completed" && task.status === "DONE");

    // Apply priority filter
    const matchesPriority =
      filters.priorityFilter === "all" ||
      task.priority.toLowerCase() === filters.priorityFilter.toLowerCase();

    // Apply task type filter
    const taskType = getTaskType(task);
    const matchesTaskType =
      filters.taskTypeFilter === "all" || taskType === filters.taskTypeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesTaskType;
  });
};
