import React, { useState, useEffect } from "react";
import useTasksStore from "../stores/tasksStore";

export default function NotificationCenter() {
  const { 
    notifications, 
    notificationSettings,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    updateNotificationSettings,
    checkReminders 
  } = useTasksStore();

  const [staticNotifications] = useState([
    {
      id: 1,
      type: "assignment",
      title: "New task assigned",
      message: 'You have been assigned "Database Migration"',
      timestamp: "2024-01-22 10:30:00",
      read: false,
      taskId: 1,
      priority: "medium",
    },
    {
      id: 2,
      type: "due_date",
      title: "Task due soon",
      message: 'Task "API Documentation" is due in 3 days',
      timestamp: "2024-01-22 09:00:00",
      read: false,
      taskId: 3,
      priority: "high",
    },
    {
      id: 3,
      type: "mention",
      title: "You were mentioned",
      message: "John Smith mentioned you in a comment",
      timestamp: "2024-01-22 11:15:00",
      read: true,
      taskId: 1,
      priority: "medium",
    },
    {
      id: 4,
      type: "status_change",
      title: "Task status updated",
      message: 'Task "Mobile App Redesign" was marked as completed',
      timestamp: "2024-01-21 16:45:00",
      read: true,
      taskId: 2,
      priority: "low",
    },
    {
      id: 5,
      type: "snooze_wakeup",
      title: "Snoozed task is back",
      message: 'Task "API Documentation" is no longer snoozed',
      timestamp: "2024-01-22 09:00:00",
      read: false,
      taskId: 3,
      priority: "medium",
    },
    {
      id: 6,
      type: "overdue",
      title: "Task overdue",
      message: 'Task "Security Audit" is 2 days overdue',
      timestamp: "2024-01-22 08:00:00",
      read: false,
      taskId: 4,
      priority: "critical",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);

  // Combine dynamic notifications from store with static ones for demo
  const allNotifications = [...notifications, ...staticNotifications];
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  // Check for reminders periodically
  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkReminders]);

  const filteredNotifications = allNotifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

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

  const markAsRead = (notificationId) => {
    markNotificationRead(notificationId);
  };

  const markAllAsRead = () => {
    markAllNotificationsRead();
  };

  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId);
  };

  const handleSettingChange = (path, value) => {
    const keys = path.split(".");
    if (keys.length === 1) {
      updateNotificationSettings({ [keys[0]]: value });
    } else if (keys.length === 2) {
      updateNotificationSettings({
        [keys[0]]: {
          ...notificationSettings[keys[0]],
          [keys[1]]: value,
        },
      });
    }
  };

  const handleDueDateReminderChange = (days) => {
    const updatedDays = settings.dueDateReminders.daysBeforeDue.includes(days)
      ? settings.dueDateReminders.daysBeforeDue.filter((d) => d !== days)
      : [...settings.dueDateReminders.daysBeforeDue, days].sort(
          (a, b) => b - a,
        );

    setSettings({
      ...settings,
      dueDateReminders: {
        ...settings.dueDateReminders,
        daysBeforeDue: updatedDays,
      },
    });
  };

  // Simulate notification generation
  useEffect(() => {
    const interval = setInterval(() => {
      // This would typically come from a backend service
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        const newNotification = {
          id: Date.now(),
          type: "reminder",
          title: "System reminder",
          message: "Don't forget to check your overdue tasks",
          timestamp: new Date().toISOString(),
          read: false,
          taskId: null,
          priority: "low",
        };
        setNotifications((prev) => [newNotification, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (showSettings) {
    return (
      <NotificationSettings
        settings={notificationSettings}
        onSettingsChange={updateNotificationSettings}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="space-y-6 p-5 h-auto overflow-scroll">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={markAllAsRead}>
              Mark All Read
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={() => setShowSettings(true)}
          >
            <span className="mr-2">⚙️</span>
            Settings
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="assignment">Assignments</option>
            <option value="due_date">Due Date Reminders</option>
            <option value="overdue">Overdue Alerts</option>
            <option value="mention">Mentions</option>
            <option value="status_change">Status Changes</option>
            <option value="snooze_wakeup">Snooze Wake-ups</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${!notification.read ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                <span className="text-sm">
                  {getNotificationIcon(notification.type)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: getPriorityColor(notification.priority),
                        }}
                      >
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 ml-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">
              {filter === "unread"
                ? "All caught up! No unread notifications."
                : "You're all set! No notifications to show."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationSettings({ settings, onSettingsChange, onBack }) {
  const [activeSection, setActiveSection] = useState("delivery");

  const handleToggle = (setting) => {
    onSettingsChange({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const sections = [
    { id: "delivery", label: "Delivery", icon: "📨", count: 2 },
    { id: "reminders", label: "Reminders", icon: "⏰", count: 3 },
    { id: "advanced", label: "Advanced", icon: "⚙️", count: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Compact Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h1 className="text-xl font-bold text-gray-900">Notification Settings</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Compact Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    activeSection === section.id
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{section.icon}</span>
                    <span>{section.label}</span>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    activeSection === section.id ? "bg-white/20" : "bg-gray-200"
                  }`}>
                    {section.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Compact Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Delivery Preferences */}
              {activeSection === "delivery" && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">📨</span>
                    <h2 className="text-lg font-bold text-gray-900">Delivery Preferences</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span>📧</span>
                        <div>
                          <h3 className="font-medium text-gray-900">Email notifications</h3>
                          <p className="text-sm text-gray-600">Task assignments, updates, deadlines</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={() => handleToggle("emailNotifications")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span>🔔</span>
                        <div>
                          <h3 className="font-medium text-gray-900">Push notifications</h3>
                          <p className="text-sm text-gray-600">Real-time browser alerts</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={() => handleToggle("pushNotifications")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Due Date Reminders */}
              {activeSection === "reminders" && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">⏰</span>
                    <h2 className="text-lg font-bold text-gray-900">Due Date Reminders</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <h3 className="font-medium text-gray-900">Enable due date reminders</h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.dueDateReminders}
                            onChange={() => handleToggle("dueDateReminders")}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>

                      {settings.dueDateReminders && (
                        <div className="space-y-3 pt-3 border-t border-gray-200">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Remind me:</h4>
                            <div className="space-y-2">
                              {[
                                { days: 7, label: "7 days before" },
                                { days: 3, label: "3 days before" },
                                { days: 1, label: "1 day before" },
                              ].map(({ days, label }) => (
                                <label key={days} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={(settings.dueDateReminders?.daysBeforeDue || []).includes(days)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        const currentDays = settings.dueDateReminders?.daysBeforeDue || [];
                                        const newDays = [...currentDays, days].sort((a, b) => b - a);
                                        onSettingsChange({
                                          ...settings,
                                          dueDateReminders: {
                                            ...settings.dueDateReminders,
                                            daysBeforeDue: newDays,
                                          },
                                        });
                                      } else {
                                        const currentDays = settings.dueDateReminders?.daysBeforeDue || [];
                                        const newDays = currentDays.filter((d) => d !== days);
                                        onSettingsChange({
                                          ...settings,
                                          dueDateReminders: {
                                            ...settings.dueDateReminders,
                                            daysBeforeDue: newDays,
                                          },
                                        });
                                      }
                                    }}
                                    className="w-4 h-4 text-orange-600 rounded"
                                  />
                                  <span className="text-sm text-gray-700">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Reminder time:</h4>
                            <input
                              type="time"
                              value={settings.dueDateReminders?.time || "09:00"}
                              onChange={(e) =>
                                onSettingsChange({
                                  ...settings,
                                  dueDateReminders: {
                                    ...settings.dueDateReminders,
                                    time: e.target.value,
                                  },
                                })
                              }
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activeSection === "advanced" && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">⚙️</span>
                    <h2 className="text-lg font-bold text-gray-900">Advanced Settings</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <span>🔕</span>
                        Quiet Hours
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Start</label>
                          <input type="time" defaultValue="22:00" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">End</label>
                          <input type="time" defaultValue="08:00" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <span>📊</span>
                        Digest Settings
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="digest" value="none" defaultChecked className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">Send immediately</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="digest" value="hourly" className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">Hourly digest</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="digest" value="daily" className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">Daily digest</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <span>🚨</span>
                        Priority Filter
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { level: "low", label: "Low", color: "bg-green-100 text-green-800" },
                          { level: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
                          { level: "high", label: "High", color: "bg-orange-100 text-orange-800" },
                          { level: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
                        ].map(({ level, label, color }) => (
                          <label key={level} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}