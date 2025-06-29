import React, { useState, useEffect } from 'react'
import TaskDetail from './TaskDetail'
import CreateTask from './CreateTask'

export default function AllTasks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [showSnooze, setShowSnooze] = useState(false);
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'admin' });
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(null);

  const [tasks, setTasks] = useState([
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
      subtasks: [
        { id: 101, status: "completed" },
        { id: 102, status: "in-progress" },
        { id: 103, status: "pending" }
      ]
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
      subtasks: []
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
        { id: 201, status: "completed" },
        { id: 202, status: "completed" }
      ]
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
      subtaskCount: 5,
      collaborators: [1, 2],
      createdBy: "Current User",
      creatorId: 1,
      subtasks: [
        { id: 301, status: "completed" },
        { id: 302, status: "completed" },
        { id: 303, status: "in-progress" },
        { id: 304, status: "pending" },
        { id: 305, status: "pending" }
      ]
    },
  ]);

  // Company-defined statuses
  const [companyStatuses] = useState([
    {
      id: 1,
      code: 'OPEN',
      label: 'Open',
      color: '#6c757d',
      isFinal: false,
      isDefault: true,
      systemMapping: 'SYS_OPEN'
    },
    {
      id: 2,
      code: 'INPROGRESS',
      label: 'In Progress',
      color: '#3498db',
      isFinal: false,
      systemMapping: 'SYS_INPROGRESS'
    },
    {
      id: 3,
      code: 'ONHOLD',
      label: 'On Hold',
      color: '#f39c12',
      isFinal: false,
      systemMapping: 'SYS_ONHOLD'
    },
    {
      id: 4,
      code: 'DONE',
      label: 'Completed',
      color: '#28a745',
      isFinal: true,
      systemMapping: 'SYS_DONE'
    },
    {
      id: 5,
      code: 'CANCELLED',
      label: 'Cancelled',
      color: '#dc3545',
      isFinal: true,
      systemMapping: 'SYS_CANCELLED'
    }
  ]);

  const getStatusLabel = (statusCode) => {
    const status = companyStatuses.find(s => s.code === statusCode);
    return status ? status.label : statusCode;
  };

  const getStatusColor = (statusCode) => {
    const status = companyStatuses.find(s => s.code === statusCode);
    return status ? status.color : '#6c757d';
  };

  const getStatusBadge = (statusCode) => {
    const status = companyStatuses.find(s => s.code === statusCode);
    const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    if (!status) return `${baseClass} bg-gray-100 text-gray-800`;

    // Convert hex to RGB for background opacity
    const hex = status.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return {
      className: `${baseClass} text-white`,
      style: { backgroundColor: status.color }
    };
  };

  // Permission check function
  const canEditTaskStatus = (task) => {
    return (
      task.assigneeId === currentUser.id ||
      task.collaborators?.includes(currentUser.id) ||
      currentUser.role === 'admin' ||
      task.creatorId === currentUser.id
    );
  };

  // Check if task can be marked as completed
  const canMarkAsCompleted = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) return true;

    const incompleteSubtasks = task.subtasks.filter(subtask => 
      subtask.status !== 'completed' && subtask.status !== 'cancelled'
    );

    return incompleteSubtasks.length === 0;
  };

  // Handle status change with validation
  const handleStatusChange = (taskId, newStatusCode, requiresConfirmation = false) => {
    const task = tasks.find(t => t.id === taskId);
    const newStatus = companyStatuses.find(s => s.code === newStatusCode);

    if (!task || !newStatus) return;

    // Check permissions
    if (!canEditTaskStatus(task)) {
      alert('You do not have permission to edit this task status.');
      return;
    }

    // Check sub-task dependencies for completion
    if (newStatusCode === 'DONE' && !canMarkAsCompleted(task)) {
      alert(`Cannot mark task as completed. There are ${task.subtasks.filter(s => s.status !== 'completed' && s.status !== 'cancelled').length} incomplete sub-tasks.`);
      return;
    }

    // Show confirmation for final statuses
    if (newStatus.isFinal && requiresConfirmation) {
      setShowStatusConfirmation({
        taskId,
        newStatusCode,
        taskTitle: task.title,
        statusLabel: newStatus.label
      });
      return;
    }

    // Update task status
    const oldStatus = companyStatuses.find(s => s.code === task.status);
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId 
          ? { ...t, status: newStatusCode, progress: newStatusCode === 'DONE' ? 100 : t.progress }
          : t
      )
    );

    // Log activity (in real app, this would be sent to backend)
    console.log(`Status changed from ${oldStatus?.label || task.status} to ${newStatus.label} by ${currentUser.name}`);
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (newStatusCode) => {
    const selectedTaskObjects = tasks.filter(t => selectedTasks.includes(t.id));
    const errors = [];

    selectedTaskObjects.forEach(task => {
      if (!canEditTaskStatus(task)) {
        errors.push(`No permission to edit: ${task.title}`);
        return;
      }

      if (newStatusCode === 'DONE' && !canMarkAsCompleted(task)) {
        const incompleteCount = task.subtasks.filter(s => s.status !== 'completed' && s.status !== 'cancelled').length;
        errors.push(`"${task.title}" has ${incompleteCount} incomplete sub-tasks`);
        return;
      }
    });

    if (errors.length > 0) {
      alert(`Cannot update some tasks:\n${errors.join('\n')}`);
      return;
    }

    // Update all selected tasks
    setTasks(prevTasks => 
      prevTasks.map(task => 
        selectedTasks.includes(task.id)
          ? { ...task, status: newStatusCode, progress: newStatusCode === 'DONE' ? 100 : task.progress }
          : task
      )
    );

    // Clear selection
    setSelectedTasks([]);
    setShowBulkActions(false);

    const newStatus = companyStatuses.find(s => s.code === newStatusCode);
    console.log(`Bulk updated ${selectedTasks.length} tasks to ${newStatus.label} by ${currentUser.name}`);
  };

  // Handle task selection
  const handleTaskSelection = (taskId, isSelected) => {
    if (isSelected) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedTasks(tasks.map(t => t.id));
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
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, title: editingTitle.trim() } : task,
        ),
      );
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
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
    setShowEditModal(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 px-4">
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
            className="btn btn-primary"
            onClick={() => setShowCreateTaskDrawer(true)}
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
            Add Task
          </button>
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
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="">Bulk Update Status</option>
                {companyStatuses.map(status => (
                  <option key={status.code} value={status.code}>
                    {status.label}
                  </option>
                ))}
              </select>
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

      {/* Export Options */}
      <div className="flex justify-end gap-2">
        <button className="btn btn-secondary btn-sm">Export as CSV</button>
        <button className="btn btn-secondary btn-sm">Export as Excel</button>
      </div>

      {/* Tasks Table */}
      <div className="card p-0 overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedTasks.includes(task.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={(e) => handleTaskSelection(task.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
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
                              <span
                                className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-all duration-200 inline-block flex-1 editable-task-title"
                                onClick={() => handleTaskTitleClick(task)}
                                title="Click to edit"
                              >
                                {task.title}
                              </span>
                              {task.subtaskCount > 0 && (
                                <span 
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                                  title={`${task.subtaskCount} sub-tasks`}
                                  onClick={() => console.log(`View sub-tasks for task ${task.id}`)}
                                >
                                  ⋗ {task.subtaskCount}
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
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-nowrap">
                    <TaskStatusDropdown
                      task={task}
                      currentStatus={task.status}
                      statuses={companyStatuses}
                      onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus, true)}
                      canEdit={canEditTaskStatus(task)}
                      canMarkCompleted={canMarkAsCompleted(task)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={getPriorityBadge(task.priority)}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-nowrap">
                    {task.dueDate}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                <button
                  className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                  onClick={() => setSelectedTaskId(task.id)}
                  title="View task details"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <TaskContextMenu taskId={task.id} />
              </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
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
        <div className={`task-drawer ${showCreateTaskDrawer ? "open" : ""}`}>
          <div
            className="drawer-overlay"
            onClick={() => setShowCreateTaskDrawer(false)}
          ></div>
          <div className="drawer-content">
            <div className="drawer-header">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Task
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
              <CreateTask onClose={() => setShowCreateTaskDrawer(false)} />
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
              false
            );
            setShowStatusConfirmation(null);
          }}
          onCancel={() => setShowStatusConfirmation(null)}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <TaskDetail 
              taskId={selectedTaskId}
              onClose={() => setSelectedTaskId(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Task Status Dropdown Component
function TaskStatusDropdown({ task, currentStatus, statuses, onStatusChange, canEdit, canMarkCompleted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const currentStatusObj = statuses.find(s => s.code === currentStatus);
  const badgeStyle = currentStatusObj ? {
    backgroundColor: currentStatusObj.color,
    color: 'white'
  } : {};

  if (!canEdit) {
    return (
      <div className="relative">
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-help"
          style={badgeStyle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {currentStatusObj?.label || currentStatus}
          <svg className="ml-1 w-3 h-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </span>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
            No permission to edit
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
        style={badgeStyle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentStatusObj?.label || currentStatus}
        <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {statuses.map(status => {
              const isDisabled = status.code === 'DONE' && !canMarkCompleted;

              return (
                <button
                  key={status.code}
                  disabled={isDisabled}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  } ${status.code === currentStatus ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={() => {
                    if (!isDisabled) {
                      onStatusChange(status.code);
                      setIsOpen(false);
                    }
                  }}
                  title={isDisabled ? 'Cannot mark as completed - incomplete sub-tasks' : ''}
                >
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  {status.label}
                  {status.code === currentStatus && (
                    <svg className="ml-auto w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isDisabled && (
                    <svg className="ml-auto w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Status Confirmation Modal Component
function StatusConfirmationModal({ taskTitle, statusLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Confirm Status Change</h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to mark "<strong>{taskTitle}</strong>" as <strong>{statusLabel}</strong>?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskContextMenu({ taskId }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddSubtask = () => {
    console.log(`Add sub-task to task ${taskId}`);
    setIsOpen(false);
  };

  const handleViewSubtasks = () => {
    console.log(`View sub-tasks for task ${taskId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        onClick={() => setIsOpen(!isOpen)}
        title="More options"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={handleAddSubtask}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Sub-task
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={handleViewSubtasks}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              View Sub-tasks
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function TaskEditModal({ task, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: task.title,
    assignee: task.assignee,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    category: task.category,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...task,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 mt-[-24px] backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="form-input w-full"
              placeholder="Enter task title..."
              required
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => handleChange("assignee", e.target.value)}
                className="form-select w-full"
              >
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Sarah Wilson">Sarah Wilson</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="form-select w-full"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="form-select w-full"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="form-input w-full"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="form-select w-full"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Research">Research</option>
                <option value="Marketing">Marketing</option>
                <option value="Support">Support</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}