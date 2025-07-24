import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import CreateTask from "./CreateTask";
import AnnualSelfAppraisal from "./AnnualSelfAppraisal";
import ApprovalTaskCreator from "./ApprovalTaskCreator";
import NotificationCenter from "./NotificationCenter";

export default function Dashboard() {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState("regular");
  const [showApprovalTaskModal, setShowApprovalTaskModal] = useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showNotificationCenter, setShowNotificationCenter] =
    React.useState(false);
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      type: "assignment",
      title: "New task assigned",
      message: 'You have been assigned "Database Migration"',
      timestamp: "2024-01-22 10:30:00",
      read: false,
      priority: "medium",
    },
    {
      id: 2,
      type: "due_date",
      title: "Task due soon",
      message: 'Task "API Documentation" is due in 3 days',
      timestamp: "2024-01-22 09:00:00",
      read: false,
      priority: "high",
    },
    {
      id: 3,
      type: "mention",
      title: "You were mentioned",
      message: "John Smith mentioned you in a comment",
      timestamp: "2024-01-22 11:15:00",
      read: true,
      priority: "medium",
    },
    {
      id: 4,
      type: "status_change",
      title: "Task status updated",
      message: 'Task "Mobile App Redesign" was marked as completed',
      timestamp: "2024-01-21 16:45:00",
      read: true,
      priority: "low",
    },
    {
      id: 5,
      type: "overdue",
      title: "Task overdue",
      message: 'Task "Security Audit" is 2 days overdue',
      timestamp: "2024-01-22 08:00:00",
      read: false,
      priority: "critical",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const [showSelfAppraisal, setShowSelfAppraisal] = useState(false);

  const handleCreateTask = (taskType) => {
    if (taskType === "approval") {
      setShowApprovalTaskModal(true);
    } else {
      setSelectedTaskType(taskType);
      setShowCreateTask(true);
    }
  };

  const handleCreateApprovalTask = (approvalTaskData) => {
    console.log("Approval task created:", approvalTaskData);
    setShowApprovalTaskModal(false);
  };
  const stats = [
    {
      title: "Total Tasks",
      value: "1,234",
      subtitle: "All time",
      percentage: "+12%",
      trend: "up",
      icon: "📋",
      color: "blue",
    },
    {
      title: "Completed",
      value: "856",
      subtitle: "All time",
      percentage: "+8%",
      trend: "up",
      icon: "✅",
      color: "green",
    },
    {
      title: "In Progress",
      value: "234",
      subtitle: "All time",
      percentage: "+3%",
      trend: "up",
      icon: "⏳",
      color: "yellow",
    },
    {
      title: "Overdue",
      value: "12",
      subtitle: "All time",
      percentage: "-5%",
      trend: "down",
      icon: "⚠️",
      color: "red",
    },
  ];

  const getNotificationIcon = (type) => {
    const icons = {
      assignment: "👤",
      due_date: "⏰",
      overdue: "🚨",
      mention: "💬",
      status_change: "✏️",
      snooze_wakeup: "😴",
      reminder: "🔔",
    };
    return icons[type] || "📝";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: "#ff4444",
      high: "#ff8800",
      medium: "#0099ff",
      low: "#00aa44",
    };
    return colors[priority] || "#666";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
    );
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notification-dropdown")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Sample employee data for demo
  const sampleEmployeeData = {
    employeeId: "EMP001",
    fullName: "John Smith",
    position: "Senior Developer",
    department: "Engineering",
    manager: "Sarah Wilson",
    reviewPeriod: "2024",
    hireDate: "2022-01-15",
  };

  return (
    <div className="min-h-full overflow-scroll bg-gray-50">
      <div className="page-header">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your tasks.
            </p>
          </div>
          <div className="relative notification-dropdown">
            <button
              className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {/* Proper bell icon */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white shadow-lg rounded-lg z-[9999] max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                          !notification.read
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                            <span className="text-sm">
                              {getNotificationIcon(notification.type)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                  <span
                                    className="text-xs font-medium"
                                    style={{
                                      color: getPriorityColor(
                                        notification.priority,
                                      ),
                                    }}
                                  >
                                    {notification.priority}
                                  </span>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 text-4xl mb-2">🔔</div>
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setShowNotificationCenter(true);
                      }}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 ">
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
        <div className="mt-8 mb-4">
          <div className="card">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <TaskCreationTile
                type="regular"
                title="Simple Task"
                icon="📋"
                color="blue"
                onClick={() => handleCreateTask("regular")}
              />
              <TaskCreationTile
                type="recurring"
                title="Recurring Task"
                icon="🔄"
                color="green"
                onClick={() => handleCreateTask("recurring")}
              />
              <TaskCreationTile
                type="milestone"
                title="Milestone"
                icon="🎯"
                color="purple"
                onClick={() => handleCreateTask("milestone")}
              />
              <TaskCreationTile
                type="approval"
                title="Approval Task"
                icon="✅"
                color="orange"
                onClick={() => handleCreateTask("approval")}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Tasks
              </h3>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((task) => (
                <div
                  key={task}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-sm">T{task}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Task Title {task}
                      </p>
                      <p className="text-sm text-gray-500">Due tomorrow</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="status-badge status-progress">
                      In Progress
                    </span>
                    <span className="priority-badge priority-medium">
                      Medium
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Task Creation Tiles */}

      {/* Quick Actions */}
      <div className="mt-8 ">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="quick-actions-grid">
            <button className="btn btn-secondary">
              <span className="mr-2">📊</span>
              View Reports
            </button>
            <button className="btn btn-secondary">
              <span className="mr-2">👥</span>
              Team Tasks
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowSelfAppraisal(true)}
            >
              <span className="mr-2">📝</span>
              Self-Appraisal
            </button>
            <button className="btn btn-secondary">
              <span className="mr-2">⚙️</span>
              Settings
            </button>
            <button className="btn btn-secondary">
              <span className="mr-2">📅</span>
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0  overflow-hidden overlay-animate mt-0">
          <div
            className="drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCreateTask(false)}
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
              <h2 className="text-2xl font-bold text-white">Create New Task</h2>
              <button
                onClick={() => setShowCreateTask(false)}
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
                onClose={() => setShowCreateTask(false)}
                initialTaskType={selectedTaskType}
              />
            </div>
          </div>
        </div>
      )}

      {/* Approval Task Modal */}
      {showApprovalTaskModal && (
        <div className="fixed inset-0  overflow-hidden overlay-animate mt-0">
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
                onClose={() => setShowApprovalTaskModal(false)}
                onSubmit={handleCreateApprovalTask}
              />
            </div>
          </div>
        </div>
      )}

      {/* Annual Self-Appraisal Form */}
      {showSelfAppraisal && (
        <div className="fixed inset-0  overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={() => setShowSelfAppraisal(false)}
          ></div>
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="relative bg-white rounded shadow-lg max-w-3xl mx-auto">
              <div className="flex justify-between items-center bg-gray-100 p-4 border-b">
                <h2 className="text-lg font-semibold">
                  Annual Self-Appraisal Form
                </h2>
                <button
                  onClick={() => setShowSelfAppraisal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <AnnualSelfAppraisal
                  onClose={() => setShowSelfAppraisal(false)}
                  employeeData={sampleEmployeeData}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Center Overlay */}
      {showNotificationCenter && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNotificationCenter(false)}
          ></div>
          <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <h2 className="text-2xl font-bold">Notification Center</h2>
              <button
                onClick={() => setShowNotificationCenter(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
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
            <div className="h-full overflow-hidden">
              <NotificationCenter />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Task Creation Tile Component
function TaskCreationTile({ type, title, description, icon, color, onClick }) {
  const colorClasses = {
    blue: "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer",
    green:
      "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 cursor-pointer",
    purple:
      "border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 cursor-pointer",
    orange:
      "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 cursor-pointer",
  };

  const iconColorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    orange: "bg-orange-500 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 w-[250px] border-2 rounded-xl text-left transition-all duration-300 group transform hover:scale-105 hover:shadow-lg ${colorClasses[color]}`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${iconColorClasses[color]}`}
        >
          <span className="text-lg">{icon}</span>
        </div>
        {/* <div className="flex-1 min-w-0"> */}
        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 ">
          {title}
        </h4>
        {/* <p className="text-sm text-gray-600 group-hover:text-gray-700">
            {description}
          </p> */}
        {/* </div> */}
      </div>
    </button>
  );
}
