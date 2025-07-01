
import React, { useState, useEffect } from 'react'

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'New task assigned',
      message: 'You have been assigned "Database Migration"',
      timestamp: '2024-01-22 10:30:00',
      read: false,
      taskId: 1,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'due_date',
      title: 'Task due soon',
      message: 'Task "API Documentation" is due in 3 days',
      timestamp: '2024-01-22 09:00:00',
      read: false,
      taskId: 3,
      priority: 'high'
    },
    {
      id: 3,
      type: 'mention',
      title: 'You were mentioned',
      message: 'John Smith mentioned you in a comment',
      timestamp: '2024-01-22 11:15:00',
      read: true,
      taskId: 1,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'status_change',
      title: 'Task status updated',
      message: 'Task "Mobile App Redesign" was marked as completed',
      timestamp: '2024-01-21 16:45:00',
      read: true,
      taskId: 2,
      priority: 'low'
    },
    {
      id: 5,
      type: 'snooze_wakeup',
      title: 'Snoozed task is back',
      message: 'Task "API Documentation" is no longer snoozed',
      timestamp: '2024-01-22 09:00:00',
      read: false,
      taskId: 3,
      priority: 'medium'
    },
    {
      id: 6,
      type: 'overdue',
      title: 'Task overdue',
      message: 'Task "Security Audit" is 2 days overdue',
      timestamp: '2024-01-22 08:00:00',
      read: false,
      taskId: 4,
      priority: 'critical'
    }
  ])

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dueDateReminders: {
      enabled: true,
      daysBeforeDue: [3, 1],
      time: '09:00'
    },
    overdueReminders: {
      enabled: true,
      frequency: 'daily' // daily, every3days, weekly
    },
    assignmentNotifications: true,
    mentionNotifications: true,
    statusChangeNotifications: true,
    snoozeWakeupNotifications: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    weekendNotifications: false
  })

  const [filter, setFilter] = useState('all')
  const [showSettings, setShowSettings] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const getNotificationIcon = (type) => {
    const icons = {
      assignment: '👤',
      due_date: '⏰',
      overdue: '🚨',
      mention: '💬',
      status_change: '✏️',
      snooze_wakeup: '😴',
      reminder: '🔔'
    }
    return icons[type] || '📝'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#ff4444',
      high: '#ff8800',
      medium: '#0099ff',
      low: '#00aa44'
    }
    return colors[priority] || '#666'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId))
  }

  const handleSettingChange = (path, value) => {
    const keys = path.split('.')
    if (keys.length === 1) {
      setSettings({ ...settings, [keys[0]]: value })
    } else if (keys.length === 2) {
      setSettings({
        ...settings,
        [keys[0]]: {
          ...settings[keys[0]],
          [keys[1]]: value
        }
      })
    }
  }

  const handleDueDateReminderChange = (days) => {
    const updatedDays = settings.dueDateReminders.daysBeforeDue.includes(days)
      ? settings.dueDateReminders.daysBeforeDue.filter(d => d !== days)
      : [...settings.dueDateReminders.daysBeforeDue, days].sort((a, b) => b - a)

    setSettings({
      ...settings,
      dueDateReminders: {
        ...settings.dueDateReminders,
        daysBeforeDue: updatedDays
      }
    })
  }

  // Simulate notification generation
  useEffect(() => {
    const interval = setInterval(() => {
      // This would typically come from a backend service
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newNotification = {
          id: Date.now(),
          type: 'reminder',
          title: 'System reminder',
          message: 'Don\'t forget to check your overdue tasks',
          timestamp: new Date().toISOString(),
          read: false,
          taskId: null,
          priority: 'low'
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (showSettings) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚙️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
                <p className="text-sm text-gray-500">Customize how and when you receive notifications</p>
              </div>
            </div>
            <button 
              className="btn btn-secondary flex items-center space-x-2"
              onClick={() => setShowSettings(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Notifications</span>
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Delivery Preferences */}
            <div className="notification-settings-section">
              <div className="notification-settings-section-header">
                <div className="notification-settings-section-icon">
                  📧
                </div>
                <div>
                  <h3 className="notification-settings-section-title">Delivery Preferences</h3>
                  <p className="notification-settings-section-description">Choose how you want to receive notifications</p>
                </div>
              </div>
              <div className="notification-settings-section-content">
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Email notifications</label>
                    <p className="notification-setting-description">Receive notifications via email</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Push notifications</label>
                    <p className="notification-setting-description">Receive browser push notifications</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Due Date Reminders */}
            <div className="notification-settings-section">
              <div className="notification-settings-section-header">
                <div className="notification-settings-section-icon">
                  ⏰
                </div>
                <div>
                  <h3 className="notification-settings-section-title">Due Date Reminders</h3>
                  <p className="notification-settings-section-description">Get reminded before tasks are due</p>
                </div>
              </div>
              <div className="notification-settings-section-content">
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Enable due date reminders</label>
                    <p className="notification-setting-description">Receive reminders before tasks are due</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.dueDateReminders.enabled}
                      onChange={(e) => handleSettingChange('dueDateReminders.enabled', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
                
                {settings.dueDateReminders.enabled && (
                  <div className="notification-subsection">
                    <div className="notification-subsection-content">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Remind me:</label>
                        <div className="space-y-2">
                          {[7, 3, 1].map(days => (
                            <label key={days} className="notification-checkbox-item">
                              <input
                                type="checkbox"
                                checked={settings.dueDateReminders.daysBeforeDue.includes(days)}
                                onChange={() => handleDueDateReminderChange(days)}
                                className="notification-checkbox"
                              />
                              <span className="notification-checkbox-label">
                                {days} day{days > 1 ? 's' : ''} before due date
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reminder time:</label>
                        <input
                          type="time"
                          value={settings.dueDateReminders.time}
                          onChange={(e) => handleSettingChange('dueDateReminders.time', e.target.value)}
                          className="notification-time-input"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Overdue Reminders */}
            <div className="notification-settings-section">
              <div className="notification-settings-section-header">
                <div className="notification-settings-section-icon">
                  🚨
                </div>
                <div>
                  <h3 className="notification-settings-section-title">Overdue Reminders</h3>
                  <p className="notification-settings-section-description">Get notified about overdue tasks</p>
                </div>
              </div>
              <div className="notification-settings-section-content">
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Enable overdue reminders</label>
                    <p className="notification-setting-description">Receive alerts for overdue tasks</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.overdueReminders.enabled}
                      onChange={(e) => handleSettingChange('overdueReminders.enabled', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
                
                {settings.overdueReminders.enabled && (
                  <div className="notification-subsection">
                    <div className="notification-subsection-content">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequency:</label>
                      <select
                        value={settings.overdueReminders.frequency}
                        onChange={(e) => handleSettingChange('overdueReminders.frequency', e.target.value)}
                        className="notification-select"
                      >
                        <option value="daily">Daily</option>
                        <option value="every3days">Every 3 days</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Notifications */}
            <div className="notification-settings-section">
              <div className="notification-settings-section-header">
                <div className="notification-settings-section-icon">
                  🔔
                </div>
                <div>
                  <h3 className="notification-settings-section-title">Activity Notifications</h3>
                  <p className="notification-settings-section-description">Stay updated on task activity</p>
                </div>
              </div>
              <div className="notification-settings-section-content">
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Task assignments</label>
                    <p className="notification-setting-description">When tasks are assigned to you</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.assignmentNotifications}
                      onChange={(e) => handleSettingChange('assignmentNotifications', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">@Mentions in comments</label>
                    <p className="notification-setting-description">When someone mentions you in a comment</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.mentionNotifications}
                      onChange={(e) => handleSettingChange('mentionNotifications', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Task status changes</label>
                    <p className="notification-setting-description">When task status is updated</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.statusChangeNotifications}
                      onChange={(e) => handleSettingChange('statusChangeNotifications', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Snooze wake-up alerts</label>
                    <p className="notification-setting-description">When snoozed tasks become active again</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.snoozeWakeupNotifications}
                      onChange={(e) => handleSettingChange('snoozeWakeupNotifications', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="notification-settings-section">
              <div className="notification-settings-section-header">
                <div className="notification-settings-section-icon">
                  🌙
                </div>
                <div>
                  <h3 className="notification-settings-section-title">Quiet Hours</h3>
                  <p className="notification-settings-section-description">Set times when notifications are paused</p>
                </div>
              </div>
              <div className="notification-settings-section-content">
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Enable quiet hours</label>
                    <p className="notification-setting-description">Pause notifications during specified hours</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.quietHours.enabled}
                      onChange={(e) => handleSettingChange('quietHours.enabled', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
                
                {settings.quietHours.enabled && (
                  <div className="notification-subsection">
                    <div className="notification-subsection-content">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">From:</label>
                          <input
                            type="time"
                            value={settings.quietHours.start}
                            onChange={(e) => handleSettingChange('quietHours.start', e.target.value)}
                            className="notification-time-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">To:</label>
                          <input
                            type="time"
                            value={settings.quietHours.end}
                            onChange={(e) => handleSettingChange('quietHours.end', e.target.value)}
                            className="notification-time-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Weekend Settings */}
            <div className="notification-settings-section">
              <div className="notification-settings-section-header">
                <div className="notification-settings-section-icon">
                  🏖️
                </div>
                <div>
                  <h3 className="notification-settings-section-title">Weekend Settings</h3>
                  <p className="notification-settings-section-description">Control weekend notifications</p>
                </div>
              </div>
              <div className="notification-settings-section-content">
                <div className="notification-setting-item">
                  <div className="notification-setting-info">
                    <label className="notification-setting-label">Send notifications on weekends</label>
                    <p className="notification-setting-description">Receive notifications on Saturday and Sunday</p>
                  </div>
                  <label className="notification-toggle">
                    <input
                      type="checkbox"
                      checked={settings.weekendNotifications}
                      onChange={(e) => handleSettingChange('weekendNotifications', e.target.checked)}
                    />
                    <span className="notification-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
            <button 
              className="btn btn-secondary"
              onClick={markAllAsRead}
            >
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
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${!notification.read ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                <span className="text-sm">{getNotificationIcon(notification.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                      <span 
                        className="text-xs font-medium"
                        style={{ color: getPriorityColor(notification.priority) }}
                      >
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600 ml-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? "All caught up! No unread notifications."
                : "You're all set! No notifications to show."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
