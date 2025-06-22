
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
      <div className="notification-settings">
        <div className="settings-header">
          <h2>Notification Settings</h2>
          <button 
            className="btn-secondary"
            onClick={() => setShowSettings(false)}
          >
            Back to Notifications
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Delivery Preferences</h3>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Email notifications
              </label>
            </div>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Push notifications
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Due Date Reminders</h3>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.dueDateReminders.enabled}
                  onChange={(e) => handleSettingChange('dueDateReminders.enabled', e.target.checked)}
                />
                <span className="checkmark"></span>
                Enable due date reminders
              </label>
            </div>
            
            {settings.dueDateReminders.enabled && (
              <>
                <div className="setting-item">
                  <label>Remind me:</label>
                  <div className="reminder-days">
                    {[7, 3, 1].map(days => (
                      <label key={days} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.dueDateReminders.daysBeforeDue.includes(days)}
                          onChange={() => handleDueDateReminderChange(days)}
                        />
                        <span className="checkmark"></span>
                        {days} day{days > 1 ? 's' : ''} before
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="setting-item">
                  <label>Reminder time:</label>
                  <input
                    type="time"
                    value={settings.dueDateReminders.time}
                    onChange={(e) => handleSettingChange('dueDateReminders.time', e.target.value)}
                    className="time-input"
                  />
                </div>
              </>
            )}
          </div>

          <div className="settings-section">
            <h3>Overdue Reminders</h3>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.overdueReminders.enabled}
                  onChange={(e) => handleSettingChange('overdueReminders.enabled', e.target.checked)}
                />
                <span className="checkmark"></span>
                Enable overdue reminders
              </label>
            </div>
            
            {settings.overdueReminders.enabled && (
              <div className="setting-item">
                <label>Frequency:</label>
                <select
                  value={settings.overdueReminders.frequency}
                  onChange={(e) => handleSettingChange('overdueReminders.frequency', e.target.value)}
                  className="form-select"
                >
                  <option value="daily">Daily</option>
                  <option value="every3days">Every 3 days</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>Activity Notifications</h3>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.assignmentNotifications}
                  onChange={(e) => handleSettingChange('assignmentNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Task assignments
              </label>
            </div>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.mentionNotifications}
                  onChange={(e) => handleSettingChange('mentionNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                @Mentions in comments
              </label>
            </div>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.statusChangeNotifications}
                  onChange={(e) => handleSettingChange('statusChangeNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Task status changes
              </label>
            </div>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.snoozeWakeupNotifications}
                  onChange={(e) => handleSettingChange('snoozeWakeupNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Snooze wake-up alerts
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Quiet Hours</h3>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.quietHours.enabled}
                  onChange={(e) => handleSettingChange('quietHours.enabled', e.target.checked)}
                />
                <span className="checkmark"></span>
                Enable quiet hours (no notifications)
              </label>
            </div>
            
            {settings.quietHours.enabled && (
              <div className="quiet-hours-times">
                <div className="setting-item">
                  <label>From:</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => handleSettingChange('quietHours.start', e.target.value)}
                    className="time-input"
                  />
                </div>
                <div className="setting-item">
                  <label>To:</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => handleSettingChange('quietHours.end', e.target.value)}
                    className="time-input"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>Weekend Settings</h3>
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.weekendNotifications}
                  onChange={(e) => handleSettingChange('weekendNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                Send notifications on weekends
              </label>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn-primary">Save Settings</button>
            <button 
              className="btn-secondary"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>
          Notifications 
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </h2>
        <div className="notification-actions">
          {unreadCount > 0 && (
            <button 
              className="btn-secondary"
              onClick={markAllAsRead}
            >
              Mark All Read
            </button>
          )}
          <button 
            className="btn-secondary"
            onClick={() => setShowSettings(true)}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="notification-filters">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
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

      <div className="notifications-list">
        {filteredNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${!notification.read ? 'unread' : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-meta">
                <span className="notification-time">{formatTimestamp(notification.timestamp)}</span>
                <span 
                  className="notification-priority"
                  style={{ color: getPriorityColor(notification.priority) }}
                >
                  {notification.priority}
                </span>
              </div>
            </div>
            <div className="notification-actions">
              <button 
                className="btn-action"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteNotification(notification.id)
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="empty-notifications">
          <div className="empty-icon">🔔</div>
          <h3>No notifications</h3>
          <p>
            {filter === 'unread' 
              ? "All caught up! No unread notifications."
              : "You're all set! No notifications to show."
            }
          </p>
        </div>
      )}
    </div>
  )
}
