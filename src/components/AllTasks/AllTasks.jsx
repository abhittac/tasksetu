import React, { useState, useEffect } from "react";
import CreateTask from "../CreateTask";
import ApprovalTaskCreator from "../ApprovalTaskCreator";
import Toast from "../Toast";
import MilestoneCreator from "../MilestoneCreator";
import TaskStatusDropdown from "./TaskStatusDropdown";
import TaskActionsDropdown from "./TaskActionsDropdown";
import TasksCalendarView from "./TasksCalendarView";
import CalendarDatePicker from "./CalendarDatePicker";
import TaskEditModal from "./TaskEditModal";
import SubtaskCreator from "./SubtaskCreator";
import SubtaskDetailPanel from "./SubtaskDetailPanel";
import TaskDeleteConfirmationModal from "./TaskDeleteConfirmationModal";
import StatusConfirmationModal from "./StatusConfirmationModal";
import SubtaskDeleteConfirmationModal from "./SubtaskDeleteConfirmationModal";
import ApprovalTaskDetailModal from "./ApprovalTaskDetailModal";
import useTasksStore from "../../stores/tasksStore";

export default function AllTasks({ onCreateTask, onNavigateToTask }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showSnooze, setShowSnooze] = useState(false);
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentUser] = useState({
    id: 1,
    name: "Current User",
    role: "admin",
  });
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const [showDeleteSubtaskConfirmation, setShowDeleteSubtaskConfirmation] =
    useState(null);
  const [showTaskTypeDropdown, setShowTaskTypeDropdown] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState("regular");
  const [showApprovalTaskModal, setShowApprovalTaskModal] = useState(false);
  const [showSubtaskCreator, setShowSubtaskCreator] = useState(null);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDateForTask, setSelectedDateForTask] = useState(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedApprovalTask, setSelectedApprovalTask] = useState(null);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });
  // Zustand store
  const {
    tasks,
    selectedTasks,
    snoozedTasks,
    riskyTasks,
    expandedTasks,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    setSelectedTasks,
    toggleTaskSelection,
    bulkUpdateStatus,
    bulkDeleteTasks,
    toggleTaskExpansion,
    toggleSnoozeTask,
    toggleRiskyTask,
    updateTaskStatus,
    getFilteredTasks,
    getTaskStatus,
    addCustomReminder,
    snoozeTask,
  } = useTasksStore();

  // Get tasks from Zustand store
  const { tasks: storeTasks } = useTasksStore();

  // Company-defined statuses with comprehensive management
  const [companyStatuses] = useState([
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
      id: 3,
      code: "ONHOLD",
      label: "On Hold",
      description: "Task is temporarily paused",
      color: "#f39c12",
      isFinal: false,
      isDefault: false,
      active: true,
      order: 3,
      systemMapping: "SYS_ONHOLD",
      allowedTransitions: ["INPROGRESS", "CANCELLED"],
      isSystem: false,
      createdAt: "2024-01-01T00:00:00Z",
      tooltip: "Task is paused temporarily",
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
    {
      id: 5,
      code: "CANCELLED",
      label: "Cancelled",
      description: "Task was terminated intentionally",
      color: "#dc3545",
      isFinal: true,
      isDefault: false,
      active: true,
      order: 5,
      systemMapping: "SYS_CANCELLED",
      allowedTransitions: [],
      isSystem: false,
      createdAt: "2024-01-01T00:00:00Z",
      tooltip: "Task was cancelled and will not be completed",
    },
  ]);

  // Status change history for activity tracking
  const [statusHistory, setStatusHistory] = useState([]);

  // Legacy status mapping for retroactive handling
  const [statusMappings] = useState([]);

  // Task type detection function
  const getTaskType = (task) => {
    if (task.isApprovalTask) return "Approval Task";
    if (task.isRecurring || task.recurringFromTaskId) return "Recurring Task";
    if (task.category === "Milestone" || task.type === "milestone")
      return "Milestone";
    return "Simple Task";
  };

  const getStatusLabel = (statusCode) => {
    const status = companyStatuses.find((s) => s.code === statusCode);
    return status ? status.label : statusCode;
  };

  const getStatusColor = (statusCode) => {
    const status = companyStatuses.find((s) => s.code === statusCode);
    return status ? status.color : "#6c757d";
  };

  const getStatusBadge = (statusCode) => {
    const status = companyStatuses.find((s) => s.code === statusCode);
    const baseClass =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    if (!status) return `${baseClass} bg-gray-100 text-gray-800`;

    const hex = status.color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return {
      className: `${baseClass} text-white`,
      style: { backgroundColor: status.color },
    };
  };

  // Permission check function
  const canEditTaskStatus = (task) => {
    return (
      task.assigneeId === currentUser.id ||
      task.collaborators?.includes(currentUser.id) ||
      currentUser.role === "admin" ||
      task.creatorId === currentUser.id
    );
  };

  // Check if task can be marked as completed
  const canMarkAsCompleted = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) return true;

    const incompleteSubtasks = task.subtasks.filter(
      (subtask) =>
        subtask.status !== "completed" && subtask.status !== "cancelled",
    );

    return incompleteSubtasks.length === 0;
  };

  // Get valid status transitions based on business rules
  const getValidStatusTransitions = (currentStatusCode, task = null) => {
    const currentStatus = companyStatuses.find(
      (s) => s.code === currentStatusCode && s.active,
    );
    if (!currentStatus) return [];

    let validTransitions = currentStatus.allowedTransitions.filter(
      (transitionCode) => {
        const targetStatus = companyStatuses.find(
          (s) => s.code === transitionCode && s.active,
        );
        return targetStatus !== null;
      },
    );

    // Apply sub-task completion logic for parent tasks
    if (task && task.subtasks && task.subtasks.length > 0) {
      const hasIncompleteSubtasks = task.subtasks.some(
        (subtask) =>
          subtask.status !== "DONE" && subtask.status !== "CANCELLED",
      );

      // Block completion if sub-tasks are incomplete
      if (hasIncompleteSubtasks) {
        validTransitions = validTransitions.filter(
          (transition) => transition !== "DONE",
        );
      }
    }

    return validTransitions;
  };

  // Log status change for activity tracking and audit trail
  const logStatusChange = (
    taskId,
    oldStatusCode,
    newStatusCode,
    userId,
    reason = null,
  ) => {
    const historyEntry = {
      id: Date.now(),
      taskId,
      oldStatusCode,
      newStatusCode,
      changedBy: userId,
      changedAt: new Date().toISOString(),
      reason,
      oldStatusLabel: getStatusLabel(oldStatusCode),
      newStatusLabel: getStatusLabel(newStatusCode),
    };

    setStatusHistory((prev) => [...prev, historyEntry]);
    console.log("Status Change Logged:", historyEntry);
  };

  // Apply legacy status mapping for retroactive compatibility
  const applyStatusMapping = (statusCode) => {
    const mapping = statusMappings.find((m) => m.oldStatusCode === statusCode);
    return mapping ? mapping.newStatusCode : statusCode;
  };

  // Handle status change with comprehensive validation
  const handleStatusChange = (
    taskId,
    newStatusCode,
    requiresConfirmation = false,
    reason = null,
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    const newStatus = companyStatuses.find(
      (s) => s.code === newStatusCode && s.active,
    );

    if (!task || !newStatus) {
      console.error("Invalid task or status code provided");
      return;
    }

    // Check edit permissions
    if (!canEditTaskStatus(task)) {
      alert("You do not have permission to edit this task status.");
      return;
    }

    // Validate status transition
    const validTransitions = getValidStatusTransitions(task.status, task);
    if (!validTransitions.includes(newStatusCode)) {
      const currentStatusObj = companyStatuses.find(
        (s) => s.code === task.status,
      );
      alert(
        `Invalid status transition from "${currentStatusObj?.label || task.status}" to "${newStatus.label}". Please follow the allowed workflow.`,
      );
      return;
    }

    // Check sub-task completion logic
    if (newStatusCode === "DONE" && !canMarkAsCompleted(task)) {
      const incompleteCount = task.subtasks.filter(
        (s) => s.status !== "completed" && s.status !== "cancelled",
      ).length;
      alert(
        `Cannot mark task as completed. There are ${incompleteCount} incomplete sub-tasks that must be completed or cancelled first.`,
      );
      return;
    }

    // Show confirmation for final statuses
    if (newStatus.isFinal && requiresConfirmation) {
      setShowStatusConfirmation({
        taskId,
        newStatusCode,
        taskTitle: task.title,
        statusLabel: newStatus.label,
        reason,
      });
      return;
    }

    // Execute status change
    executeStatusChange(taskId, newStatusCode, reason);
  };

  // Execute the actual status change
  const executeStatusChange = (taskId, newStatusCode, reason = null) => {
    const task = tasks.find((t) => t.id === taskId);
    const oldStatusCode = task.status;

    // Update task status using store
    updateTaskStatus(taskId, newStatusCode);

    // Log the status change for audit trail
    logStatusChange(
      taskId,
      oldStatusCode,
      newStatusCode,
      currentUser.id,
      reason,
    );

    // Show success notification
    const oldStatus = companyStatuses.find((s) => s.code === oldStatusCode);
    const newStatus = companyStatuses.find((s) => s.code === newStatusCode);
    console.log(
      `✅ Status updated: "${task.title}" changed from "${oldStatus?.label || oldStatusCode}" to "${newStatus.label}"`,
    );
  };

  // Permission check for task deletion
  const canDeleteTask = (task) => {
    return (
      task.creatorId === currentUser.id ||
      task.assigneeId === currentUser.id ||
      currentUser.role === "admin"
    );
  };

  // Handle task deletion with integrity checks
  const handleDeleteTask = (taskId, options = {}) => {
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      console.error("Task not found");
      return;
    }

    // Check permissions
    if (!canDeleteTask(task)) {
      alert("You do not have permission to delete this task.");
      return;
    }

    // Show confirmation modal with task details
    setShowDeleteConfirmation({
      task,
      options: {
        deleteSubtasks: false,
        deleteAttachments: false,
        deleteLinkedItems: false,
        ...options,
      },
    });
  };

  // Execute task deletion
  const executeTaskDeletion = (taskId, options) => {
    const task = tasks.find((t) => t.id === taskId);

    // Remove task from list using store
    deleteTask(taskId);

    // Handle subtasks deletion
    if (options.deleteSubtasks && task.subtasks && task.subtasks.length > 0) {
      console.log(
        `Deleted ${task.subtasks.length} subtasks for task: ${task.title}`,
      );
    }

    // Handle attachments/linked items
    if (
      options.deleteAttachments &&
      task.linkedItems &&
      task.linkedItems.length > 0
    ) {
      console.log(
        `Deleted ${task.linkedItems.length} linked items for task: ${task.title}`,
      );
    }

    // Log activity for audit trail
    logActivity("task_deleted", {
      taskId: task.id,
      taskTitle: task.title,
      deletedBy: currentUser.name,
      timestamp: new Date().toISOString(),
      options: options,
    });

    // Show success toast notification
    showToast(`Task "${task.title}" deleted successfully`, "success");

    // Close confirmation modal
    setShowDeleteConfirmation(null);
  };

  // Handle bulk task deletion
  const handleBulkDeleteTasks = () => {
    const selectedTaskObjects = tasks.filter((t) =>
      selectedTasks.includes(t.id),
    );
    const errors = [];

    selectedTaskObjects.forEach((task) => {
      if (!canDeleteTask(task)) {
        errors.push(`No permission to delete: ${task.title}`);
      }
    });

    if (errors.length > 0) {
      alert(`Cannot delete some tasks:\n${errors.join("\n")}`);
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedTasks.length} selected tasks? This action cannot be undone.`,
      )
    ) {
      bulkDeleteTasks(selectedTasks);
      setShowBulkActions(false);
      showToast(
        `${selectedTaskObjects.length} tasks deleted successfully`,
        "success",
      );
    }
  };

  const logActivity = (type, details) => {
    console.log(`🔄 Activity Log:`, details);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, isVisible: true });
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (newStatusCode) => {
    const selectedTaskObjects = tasks.filter((t) =>
      selectedTasks.includes(t.id),
    );
    const errors = [];

    selectedTaskObjects.forEach((task) => {
      if (!canEditTaskStatus(task)) {
        errors.push(`No permission to edit: ${task.title}`);
        return;
      }

      if (newStatusCode === "DONE" && !canMarkAsCompleted(task)) {
        const incompleteCount = task.subtasks.filter(
          (s) => s.status !== "completed" && s.status !== "cancelled",
        ).length;
        errors.push(
          `"${task.title}" has ${incompleteCount} incomplete sub-tasks`,
        );
        return;
      }
    });

    if (errors.length > 0) {
      alert(`Cannot update some tasks:\n${errors.join("\n")}`);
      return;
    }

    // Update all selected tasks using store
    bulkUpdateStatus(selectedTasks, newStatusCode);

    // Clear selection
    setShowBulkActions(false);

    const newStatus = companyStatuses.find((s) => s.code === newStatusCode);
    console.log(
      `Bulk updated ${selectedTasks.length} tasks to ${newStatus.label} by ${currentUser.name}`,
    );
  };

  // Handle task selection
  const handleTaskSelection = (taskId, isSelected) => {
    toggleTaskSelection(taskId);
  };

  // Handle select all
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedTasks(tasks.map((t) => t.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      Low: "status-badge priority-low",
      Medium: "status-badge priority-medium",
      High: "status-badge priority-high",
      Urgent: "status-badge priority-urgent",
    };
    return priorityClasses[priority] || "status-badge priority-low";
  };

  const handleTaskTitleClick = (task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const handleTitleSave = (taskId) => {
    if (
      editingTitle.trim() &&
      editingTitle !== tasks.find((t) => t.id === taskId)?.title
    ) {
      updateTask(taskId, { title: editingTitle.trim() });
    }
    setEditingTaskId(null);
    setEditingTitle("");
  };

  const handleTitleCancel = () => {
    setEditingTaskId(null);
    setEditingTitle("");
  };

  const handleTitleKeyDown = (e, taskId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleSave(taskId);
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleTitleCancel();
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleSaveEditedTask = (updatedTask) => {
    updateTask(updatedTask.id, updatedTask);
    setShowEditModal(false);
    setEditingTask(null);
  };

  const handleViewTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);

    // If it's an approval task, show the approval modal
    if (task && task.isApprovalTask) {
      setSelectedApprovalTask(task);
      setShowApprovalTaskModal(true);
      return;
    }

    // Navigate to task detail page for regular tasks
    if (onNavigateToTask) {
      onNavigateToTask(taskId);
    }
  };

  // Toggle task expansion
  const handleToggleTaskExpansion = (taskId) => {
    toggleTaskExpansion(taskId);
  };

  // Create new subtask
  const handleCreateSubtask = (parentTaskId, subtaskData) => {
    const subtaskToAdd = {
      title: subtaskData.title,
      assignee: subtaskData.assignee || currentUser.name,
      assigneeId: subtaskData.assigneeId || currentUser.id,
      status: subtaskData.status || "OPEN",
      priority: subtaskData.priority || "Medium",
      dueDate: subtaskData.dueDate,
      description: subtaskData.description || "",
    };

    addSubtask(parentTaskId, subtaskToAdd);
    setShowSubtaskCreator(null);

    // Auto-expand parent task to show new subtask
    toggleTaskExpansion(parentTaskId);
  };

  // Update subtask
  const handleUpdateSubtask = (parentTaskId, updatedSubtask) => {
    updateSubtask(parentTaskId, updatedSubtask.id, updatedSubtask);
    setSelectedSubtask(null);
  };

  // Delete subtask
  const handleDeleteSubtask = (parentTaskId, subtaskId) => {
    const parentTask = tasks.find((t) => t.id === parentTaskId);
    const subtask = parentTask?.subtasks.find((s) => s.id === subtaskId);

    deleteSubtask(parentTaskId, subtaskId);

    // Show success toast notification
    if (subtask) {
      showToast(`Sub-task "${subtask.title}" deleted successfully`, "success");
    }

    setSelectedSubtask(null);
    setShowDeleteSubtaskConfirmation(null);
  };

  // Handle subtask status change
  const handleSubtaskStatusChange = (parentTaskId, subtaskId, newStatus) => {
    updateSubtask(parentTaskId, subtaskId, { status: newStatus });
  };

  const handleAddSubtask = (taskId) => {
    setShowSubtaskCreator(taskId);
  };

  const handleToggleSubtasks = (taskId) => {
    handleToggleTaskExpansion(taskId);
  };

  // Handle calendar date selection
  const handleCalendarDateSelect = (selectedDate) => {
    setSelectedDateForTask(selectedDate);
    setShowCalendarModal(false);

    // Open appropriate task creation modal based on selected type
    if (selectedTaskType === "approval") {
      setShowApprovalTaskModal(true);
    } else if (selectedTaskType === "milestone") {
      setShowMilestoneModal(true);
    } else {
      setShowCreateTaskDrawer(true);
    }
  };

  // Handle task type selection from dropdown
  const handleTaskTypeSelect = (taskType) => {
    setSelectedTaskType(taskType);
    setShowTaskTypeDropdown(false);

    // Always show calendar first for all task types
    setShowCalendarModal(true);
  };

  const handleCreateApprovalTask = (approvalTaskData) => {
    // Add the approval task to the tasks list
    const newTask = {
      title: approvalTaskData.title,
      assignee: "Current User",
      assigneeId: 1,
      status: "OPEN",
      priority: approvalTaskData.priority || "Medium",
      dueDate: approvalTaskData.dueDate,
      category: "Approval",
      isApprovalTask: true,
      approvers: approvalTaskData.approvers || [],
      approvalMode: approvalTaskData.approvalMode || "any",
      description: approvalTaskData.description || "",
    };

    addTask(newTask);
    setShowApprovalTaskModal(false);
    setSelectedDateForTask(null);
    console.log("Approval task created:", newTask);
  };

  const handleCreateMilestone = (milestoneData) => {
    // Add the milestone to the tasks list
    const newTask = {
      title: milestoneData.title,
      assignee: milestoneData.assignee || "Current User",
      assigneeId: milestoneData.assigneeId || 1,
      status: milestoneData.milestoneType === "linked" ? "not_started" : "OPEN",
      priority: milestoneData.priority || "Medium",
      dueDate: milestoneData.dueDate || selectedDateForTask,
      category: "Milestone",
      collaborators: milestoneData.collaborators || [],
      type: "milestone",
      description: milestoneData.description || "",
      isMilestone: true,
      milestoneType: milestoneData.milestoneType || "standalone",
      linkedTasks: milestoneData.linkedTasks || [],
      visibility: milestoneData.visibility || "private",
      // For linked milestones, create mock task dependencies
      tasks:
        milestoneData.milestoneType === "linked" &&
        milestoneData.linkedTasks.length > 0
          ? milestoneData.linkedTasks.map((taskId) => {
              const taskNames = {
                1: "UI Design Complete",
                2: "Backend API Development",
                3: "Testing Phase",
                4: "Deployment",
              };
              return {
                id: taskId,
                title: taskNames[taskId] || `Task ${taskId}`,
                completed: false,
              };
            })
          : [],
    };

    addTask(newTask);
    setShowMilestoneModal(false);
    setSelectedDateForTask(null);
    console.log("Milestone created:", newTask);
  };

  // Handle task snooze
  const handleSnoozeTask = (taskId) => {
    toggleSnoozeTask(taskId);
    if (snoozedTasks.has(taskId)) {
      showToast("Task un-snoozed successfully", "success");
    } else {
      showToast("Task snoozed successfully", "success");
    }
  };

  // Handle mark as risk
  const handleMarkAsRisk = (taskId) => {
    toggleRiskyTask(taskId);
    if (riskyTasks.has(taskId)) {
      showToast("Task risk status removed", "success");
    } else {
      showToast("Task marked as risky", "warning");
    }
  };

  // Apply filters to tasks
  const filteredTasks = storeTasks.filter((task) => {
    // Apply search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "todo" && task.status === "OPEN") ||
      (statusFilter === "progress" && task.status === "INPROGRESS") ||
      (statusFilter === "review" && task.status === "ONHOLD") ||
      (statusFilter === "completed" && task.status === "DONE");

    // Apply priority filter
    const matchesPriority =
      priorityFilter === "all" ||
      task.priority.toLowerCase() === priorityFilter.toLowerCase();

    // Apply task type filter
    const taskType = getTaskType(task);
    const matchesTaskType =
      taskTypeFilter === "all" || taskType === taskTypeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesTaskType
    );
  });

  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Helper function to get task visual indicators
  const getTaskIndicators = (task) => {
    const status = getTaskStatus(task.id);
    const indicators = [];

    if (status?.isOverdue) {
      indicators.push({
        icon: "🔴",
        text: "Overdue",
        className: "bg-red-100 text-red-800 border-red-200",
      });
    }

    if (status?.isSnoozed) {
      indicators.push({
        icon: "🔕",
        text: "Snoozed",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      });
    }

    if (status?.hasReminders) {
      indicators.push({
        icon: "⏰",
        text: "Has Reminders",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      });
    }

    return indicators;
  };

  return (
    <div className="space-y-6 px-4 py-6 h-auto overflow-scroll">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage and track all your tasks
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowSnooze(!showSnooze)}
            className={`btn ${showSnooze ? "btn-primary" : "btn-secondary"}`}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {showSnooze ? "Hide" : "Show"} Snoozed Tasks
          </button>
          <button
            className={`btn ${
              showCalendarView ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setShowCalendarView(!showCalendarView)}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {showCalendarView ? "Hide Calendar" : "Calendar View"}
          </button>
          <div className="relative">
            <button
              className="btn btn-primary"
              onClick={() => handleTaskTypeSelect("regular")}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Task
            </button>
            <button
              className="btn btn-primary ml-1 px-2"
              onClick={() => setShowTaskTypeDropdown(!showTaskTypeDropdown)}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {showTaskTypeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTaskTypeDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
                    Task Types
                  </div>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                    onClick={() => handleTaskTypeSelect("regular")}
                  >
                    <span className="text-lg">📋</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        Simple Task
                      </div>
                      <div className="text-sm text-gray-500">
                        Standard one-time task
                      </div>
                    </div>
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                    onClick={() => handleTaskTypeSelect("recurring")}
                  >
                    <span className="text-lg">🔄</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        Recurring Task
                      </div>
                      <div className="text-sm text-gray-500">
                        Repeats on schedule
                      </div>
                    </div>
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                    onClick={() => handleTaskTypeSelect("milestone")}
                  >
                    <span className="text-lg">🎯</span>
                    <div>
                      <div className="font-medium text-gray-900">Milestone</div>
                      <div className="text-sm text-gray-500">
                        Project checkpoint
                      </div>
                    </div>
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                    onClick={() => handleTaskTypeSelect("approval")}
                  >
                    <span className="text-lg">✅</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        Approval Task
                      </div>
                      <div className="text-sm text-gray-500">
                        Requires approval workflow
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>

          {selectedTasks.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                {selectedTasks.length} selected
              </span>
              <select
                className="form-select text-sm"
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value);
                    e.target.value = "";
                  }
                }}
                defaultValue=""
              >
                <option value="">Bulk Update Status</option>
                {companyStatuses.map((status) => (
                  <option key={status.code} value={status.code}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleBulkDeleteTasks}
                title="Delete selected tasks"
              >
                🗑️ Delete
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedTasks([])}
              >
                Clear Selection
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={taskTypeFilter}
              onChange={(e) => setTaskTypeFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Task Types</option>
              <option value="Simple Task">Simple Task</option>
              <option value="Recurring Task">Recurring Task</option>
              <option value="Milestone">Milestone</option>
              <option value="Approval Task">Approval Task</option>
            </select>

            <select className="form-select">
              <option>All Categories</option>
              <option>Development</option>
              <option>Design</option>
              <option>Research</option>
              <option>Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar View Section */}
      {showCalendarView && (
        <div className="card">
          <TasksCalendarView
            tasks={tasks}
            onTaskClick={handleViewTask}
            onClose={() => setShowCalendarView(false)}
          />
        </div>
      )}

      {/* Export Options */}
      <div className="flex justify-end gap-2 ">
        <button className="btn btn-secondary btn-md">Export as CSV</button>
        <button className="btn btn-secondary btn-md">Export as Excel</button>
      </div>

      {/* Tasks Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12 text-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      selectedTasks.length === tasks.length && tasks.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                  Task
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                  Assignee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <tr
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedTasks.includes(task.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={(e) =>
                          handleTaskSelection(task.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            {/* Expansion control for tasks with subtasks */}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <button
                                onClick={() =>
                                  handleToggleTaskExpansion(task.id)
                                }
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors hover:text-gray-600 transition-colors"
                                title={
                                  expandedTasks.has(task.id)
                                    ? "Collapse subtasks"
                                    : "Expand subtasks"
                                }
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="5"
                                    cy="5"
                                    r="2"
                                    fill="currentColor"
                                  />
                                  <circle
                                    cx="5"
                                    cy="12"
                                    r="2"
                                    fill="currentColor"
                                  />
                                  <circle
                                    cx="5"
                                    cy="19"
                                    r="2"
                                    fill="currentColor"
                                  />

                                  <path
                                    d="M5 7V10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="M5 14V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />

                                  <path
                                    d="M7 12H14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="M7 19H14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                </svg>

                                {task.subtasks.length}
                              </button>
                            )}

                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onBlur={() => handleTitleSave(task.id)}
                                onKeyDown={(e) => handleTitleKeyDown(e, task.id)}
                                className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                                autoFocus
                                maxLength={100}
                              />
                            ) : (
                              <>
                                {task.isRecurring && (
                                  <span
                                    className="text-green-600 cursor-help"
                                    title="Recurring Task – generated from a pattern"
                                  >
                                    🔁
                                  </span>
                                )}
                                {task.isApprovalTask && (
                                  <span
                                    className="text-orange-600 cursor-help"
                                    title="Approval Task – requires approval workflow"
                                  >
                                    ✅
                                  </span>
                                )}
                                {(task.category === "Milestone" ||
                                  task.type === "milestone") && (
                                  <span
                                    className="text-purple-600 cursor-help"
                                    title="Milestone – project checkpoint"
                                  >
                                    🎯
                                  </span>
                                )}
                                <span
                                  className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-all duration-200 inline-block flex-1 editable-task-title"
                                  onClick={() => handleTaskTitleClick(task)}
                                  title="Click to edit"
                                >
                                  {task.title}
                                  {riskyTasks.has(task.id) && (
                                    <span
                                      className="ml-2 text-orange-500"
                                      title="Risky Task"
                                    >
                                      ⚠️
                                    </span>
                                  )}
                                  {snoozedTasks.has(task.id) && (
                                    <span
                                      className="ml-2 text-yellow-500"
                                      title="Snoozed Task"
                                    >
                                      ⏸️
                                    </span>
                                  )}
                                </span>

                                {task.recurringFromTaskId && (
                                  <span
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 cursor-pointer hover:bg-green-200 transition-colors"
                                    title={`Recurring from Task #${task.recurringFromTaskId}`}
                                    onClick={() =>
                                      console.log(
                                        `View master task ${task.recurringFromTaskId}`,
                                      )
                                    }
                                  >
                                    📋 #{task.recurringFromTaskId}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-600">
                            {task.assignee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {task.assignee}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-nowrap text-left">
                      <TaskStatusDropdown
                        task={task}
                        currentStatus={task.status}
                        statuses={companyStatuses}
                        onStatusChange={(newStatus) =>
                          handleStatusChange(task.id, newStatus, true)
                        }
                        canEdit={canEditTaskStatus(task)}
                        canMarkCompleted={canMarkAsCompleted(task)}
                      />
                    </td>
                    <td className="px-6 py-4 text-nowrap">
                      <span className={getPriorityBadge(task.priority)}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-nowrap">
                      {task.dueDate}
                    </td>
                    <td className="px-6 py-4 text-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 min-w-[3rem]">
                          {task.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-nowrap">
                      <div className="flex items-center justify-center">
                        <TaskActionsDropdown
                          task={task}
                          onView={() => handleViewTask(task.id)}
                          onCreateSubtask={() => handleAddSubtask(task.id)}
                          onSnooze={() => handleSnoozeTask(task.id)}
                          onMarkAsRisk={() => handleMarkAsRisk(task.id)}
                          onMarkAsDone={() =>
                            handleStatusChange(task.id, "DONE", true)
                          }
                          onDelete={() => handleDeleteTask(task.id)}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Subtask Rows */}
                  {expandedTasks.has(task.id) &&
                    task.subtasks &&
                    task.subtasks.map((subtask) => (
                      <tr
                        key={`subtask-${subtask.id}`}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors border-l-4 border-l-blue-300"
                      >
                        <td className="px-6 py-3"></td>
                        <td className="px-6 py-3">
                          <div className="pl-8">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-500">↳</span>
                              <span
                                className="font-medium text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() =>
                                  setSelectedSubtask({
                                    ...subtask,
                                    parentTaskId: task.id,
                                  })
                                }
                                title="Click to view/edit subtask"
                              >
                                {subtask.title}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 pl-7">
                              Sub-task of "{task.title}"
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-medium text-gray-600">
                                {subtask.assignee
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">
                              {subtask.assignee}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-left">
                          <TaskStatusDropdown
                            task={subtask}
                            currentStatus={subtask.status}
                            statuses={companyStatuses}
                            onStatusChange={(newStatus) =>
                              handleSubtaskStatusChange(
                                task.id,
                                subtask.id,
                                newStatus,
                              )
                            }
                            canEdit={canEditTaskStatus(subtask)}
                            canMarkCompleted={true}
                          />
                        </td>
                        <td className="px-6 py-3">
                          <span className={getPriorityBadge(subtask.priority)}>
                            {subtask.priority}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {subtask.dueDate}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                              <div
                                className="bg-primary-600 h-1.5 rounded-full"
                                style={{ width: `${subtask.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 min-w-[3rem]">
                              {subtask.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors p-1"
                              onClick={() =>
                                setSelectedSubtask({
                                  ...subtask,
                                  parentTaskId: task.id,
                                })
                              }
                              title="View/Edit subtask"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors p-1"
                              onClick={() =>
                                setShowDeleteSubtaskConfirmation({
                                  taskId: task.id,
                                  subtaskId: subtask.id,
                                  subtaskTitle: subtask.title,
                                })
                              }
                              title="Delete Sub-task"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex bg-white rounded-md shadow-md p-3 items-center justify-between">
        <div className="text-sm  text-gray-700">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">4</span> of{" "}
          <span className="font-medium">97</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn btn-secondary btn-sm">Previous</button>
          <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
            2
          </button>
          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
            3
          </button>
          <button className="btn btn-secondary btn-sm">Next</button>
        </div>
      </div>

      {/* Slide-in Drawer */}
      {showCreateTaskDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden overlay-animate mt-0">
          <div
            className="drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCreateTaskDrawer(false)}
          ></div>
          <div
            className="absolute right-0 top-0 h-full bg-white/95 backdrop-blur-sm flex flex-col modal-animate-slide-right"
            style={{
              width: "min(90vw, 900px)",
              boxShadow: "-10px 0 50px rgba(0,0,0,0.2)",
              borderLeft: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div className="drawer-header">
              <h2 className="text-2xl font-bold text-white">
                Create New Task
                {selectedDateForTask &&
                  ` for ${new Date(selectedDateForTask).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}`}
              </h2>
              <button
                onClick={() => setShowCreateTaskDrawer(false)}
                className="close-btn"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="drawer-body">
              <CreateTask
                onClose={() => {
                  setShowCreateTaskDrawer(false);
                  setSelectedDateForTask(null);
                }}
                initialTaskType={selectedTaskType}
                preFilledDate={selectedDateForTask}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {showEditModal && editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleSaveEditedTask}
          onClose={() => {
            setShowEditModal(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Status Confirmation Modal */}
      {showStatusConfirmation && (
        <StatusConfirmationModal
          taskTitle={showStatusConfirmation.taskTitle}
          statusLabel={showStatusConfirmation.statusLabel}
          onConfirm={() => {
            handleStatusChange(
              showStatusConfirmation.taskId,
              showStatusConfirmation.newStatusCode,
              false,
            );
            setShowStatusConfirmation(null);
          }}
          onCancel={() => setShowStatusConfirmation(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <TaskDeleteConfirmationModal
          task={showDeleteConfirmation.task}
          options={showDeleteConfirmation.options}
          onConfirm={(finalOptions) =>
            executeTaskDeletion(
              showDeleteConfirmation.task.id,
              finalOptions,
            )
          }
          onCancel={() => setShowDeleteConfirmation(null)}
          currentUser={currentUser}
        />
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <CalendarDatePicker
          onClose={() => {
            setShowCalendarModal(false);
            setSelectedTaskType("regular");
          }}
          onDateSelect={handleCalendarDateSelect}
          taskType={selectedTaskType}
        />
      )}

      {/* Approval Task Creator Modal */}
      {showApprovalTaskModal && !selectedApprovalTask && (
        <div className="fixed inset-0 z-50 overflow-hidden overlay-animate mt-0">
          <div
            className="drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowApprovalTaskModal(false)}
          ></div>
          <div
            className="absolute right-0 top-0 h-full bg-white/95 backdrop-blur-sm flex flex-col modal-animate-slide-right"
            style={{
              width: "min(90vw, 600px)",
              boxShadow: "-10px 0 50px rgba(0,0,0,0.2)",
              borderLeft: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div className="drawer-header">
              <h2 className="text-2xl font-bold text-white">
                Create Approval Task
                {selectedDateForTask &&
                  ` for ${new Date(selectedDateForTask).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}`}
              </h2>
              <button
                onClick={() => setShowApprovalTaskModal(false)}
                className="close-btn"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="drawer-body">
              <ApprovalTaskCreator
                onClose={() => {
                  setShowApprovalTaskModal(false);
                  setSelectedDateForTask(null);
                }}
                onSubmit={handleCreateApprovalTask}
                preFilledDate={selectedDateForTask}
                selectedDate={selectedDateForTask}
              />
            </div>
          </div>
        </div>
      )}

      {/* Subtask Creator Modal */}
      {showSubtaskCreator && (
        <SubtaskCreator
          parentTask={tasks.find((t) => t.id === showSubtaskCreator)}
          onClose={() => setShowSubtaskCreator(null)}
          onSubmit={(subtaskData) =>
            handleCreateSubtask(showSubtaskCreator, subtaskData)
          }
          currentUser={currentUser}
        />
      )}

      {/* Subtask Detail Panel */}
      {selectedSubtask && (
        <SubtaskDetailPanel
          subtask={selectedSubtask}
          parentTask={tasks.find((t) => t.id === selectedSubtask.parentTaskId)}
          onClose={() => setSelectedSubtask(null)}
          onUpdate={(updatedSubtask) =>
            handleUpdateSubtask(selectedSubtask.parentTaskId, updatedSubtask)
          }
          onDelete={() =>
            handleDeleteSubtask(
              selectedSubtask.parentTaskId,
              selectedSubtask.id,
            )
          }
          currentUser={currentUser}
        />
      )}

      {/* Milestone Creation Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 overflow-hidden overlay-animate mt-0">
          <div
            className="drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMilestoneModal(false)}
          ></div>
          <div
            className="absolute right-0 top-0 h-full bg-white/95 backdrop-blur-sm flex flex-col modal-animate-slide-right"
            style={{
              width: "min(90vw, 800px)",
              boxShadow: "-10px 0 50px rgba(0,0,0,0.2)",
              borderLeft: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div className="drawer-header">
              <h2 className="text-2xl font-bold text-white">
                Create Milestone
                {selectedDateForTask &&
                  ` for ${new Date(selectedDateForTask).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}`}
              </h2>
              <button
                onClick={() => setShowMilestoneModal(false)}
                className="close-btn"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="drawer-body">
              <MilestoneCreator
                onClose={() => {
                  setShowMilestoneModal(false);
                  setSelectedDateForTask(null);
                }}
                onSubmit={handleCreateMilestone}
                preFilledDate={selectedDateForTask}
                selectedDate={selectedDateForTask}
              />
            </div>
          </div>
        </div>
      )}

      {/* Approval Task Detail Modal */}
      {showApprovalTaskModal && selectedApprovalTask && (
        <ApprovalTaskDetailModal
          task={selectedApprovalTask}
          onClose={() => {
            setShowApprovalTaskModal(false);
            setSelectedApprovalTask(null);
          }}
          currentUser={currentUser}
          onApproval={(taskId, approverId, action, comment) => {
            // Handle approval action
            setTasks((prevTasks) =>
              prevTasks.map((task) => {
                if (task.id !== taskId) return task;

                const updatedApprovers = task.approvers.map((approver) => {
                  if (approver.id === approverId) {
                    return {
                      ...approver,
                      status: action,
                      comment: comment || null,
                      approvedAt: new Date().toISOString(),
                    };
                  }
                  return approver;
                });

                // Determine overall task status based on approval mode
                let newStatus = task.status;
                if (action === "approved") {
                  if (task.approvalMode === "any") {
                    newStatus = "DONE";
                  } else if (task.approvalMode === "all") {
                    const allApproved = updatedApprovers.every(
                      (a) => a.status === "approved",
                    );
                    if (allApproved) newStatus = "DONE";
                  }
                } else if (action === "rejected") {
                  newStatus = "CANCELLED";
                }

                return {
                  ...task,
                  approvers: updatedApprovers,
                  status: newStatus,
                };
              }),
            );

            // Close modal after action
            setShowApprovalTaskModal(false);
            setSelectedApprovalTask(null);
          }}
        />
      )}

      {/* Sub-task Delete Confirmation Modal */}
      {showDeleteSubtaskConfirmation && (
        <SubtaskDeleteConfirmationModal
          subtaskTitle={showDeleteSubtaskConfirmation.subtaskTitle}
          onConfirm={() =>
            handleDeleteSubtask(
              showDeleteSubtaskConfirmation.taskId,
              showDeleteSubtaskConfirmation.subtaskId,
            )
          }
          onCancel={() => setShowDeleteSubtaskConfirmation(null)}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}