import React, { useState } from "react";
import CreateTask from "./CreateTask";

export default function AllTasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showSnooze, setShowSnooze] = useState(false);
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Update user authentication system",
      assignee: "John Doe",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-01-25",
      category: "Development",
      progress: 60,
      subtaskCount: 3,
    },
    {
      id: 2,
      title: "Design new landing page",
      assignee: "Jane Smith",
      status: "To Do",
      priority: "Medium",
      dueDate: "2024-01-30",
      category: "Design",
      progress: 0,
      subtaskCount: 0,
    },
    {
      id: 3,
      title: "Fix mobile responsiveness issues",
      assignee: "Mike Johnson",
      status: "Completed",
      priority: "Low",
      dueDate: "2024-01-20",
      category: "Development",
      progress: 100,
      subtaskCount: 2,
    },
    {
      id: 4,
      title: "Conduct user research interviews",
      assignee: "Sarah Wilson",
      status: "In Review",
      priority: "High",
      dueDate: "2024-01-28",
      category: "Research",
      progress: 80,
      subtaskCount: 5,
    },
  ]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      "To Do": "status-badge status-todo",
      "In Progress": "status-badge status-progress",
      "In Review": "status-badge status-review",
      Completed: "status-badge status-completed",
    };
    return statusClasses[status] || "status-badge status-todo";
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

      {/* Filters */}
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
                  className="hover:bg-gray-50 transition-colors"
                >
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
                                  className="parent-task-indicator"
                                  title={`${task.subtaskCount} sub-tasks - Click to view`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(`Opening task ${task.id} with sub-tasks focused`);
                                    // In real implementation, this would open TaskDetail with subtasks tab active
                                  }}
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {task.subtaskCount}
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
                    <span className={getStatusBadge(task.status)}>
                      {task.status}
                    </span>
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
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => handleEditTask(task)}
                        title="Edit task"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <TaskContextMenu taskId={task.id} />
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg
                          className="w-4 h-4"
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