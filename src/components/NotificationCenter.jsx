
import React, { useState } from 'react'

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task_assignment',
      title: 'New Task Assigned',
      message: 'You have been assigned to "Database Migration"',
      timestamp: '2024-01-22 09:00',
      read: false,
      priority: 'normal'
    },
    {
      id: 2,
      type: 'due_date',
      title: 'Task Due Tomorrow',
      message: 'API Documentation is due tomorrow',
      timestamp: '2024-01-22 08:30',
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'overdue',
      title: 'Task Overdue',
      message: 'Security Audit is now overdue',
      timestamp: '2024-01-22 08:00',
      read: true,
      priority: 'urgent'
    },
    {
      id: 4,
      type: 'mention',
      title: 'You were mentioned',
      message: '@John mentioned you in Mobile App Redesign',
      timestamp: '2024-01-22 07:45',
      read: false,
      priority: 'normal'
    },
    {
      id: 5,
      type: 'status_change',
      title: 'Task Status Updated',
      message: 'Website Optimization moved to In Progress',
      timestamp: '2024-01-22 07:30',
      read: true,
      priority: 'low'
    },
    {
      id: 6,
      type: 'snooze_wakeup',
      title: 'Task Unsnoozed',
      message: 'API Documentation is now active again',
      timestamp: '2024-01-22 07:00',
      read: false,
      priority: 'normal'
    },
    {
      id: 7,
      type: 'milestone',
      title: 'Milestone Ready',
      message: 'Phase 1 Development milestone is ready for confirmation',
      timestamp: '2024-01-22 06:30',
      read: false,
      priority: 'high'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [showSettings, setShowSettings] = useState(false)

  const getNotificationIcon = (type) => {
    const icons = {
      task_assignment: '👤',
      due_date: '⏰',
      overdue: '🔴',
      mention: '💬',
      status_change: '✏️',
      custom: '🔔',
      snooze_wakeup: '😴',
      milestone: '⭐'
    }
    return icons[type] || '🔔'
  }

  const getPriorityClass = (priority) => {
    return `notification-item ${priority}`
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>Notifications</h2>
        <div className="notification-actions">
          <button className="btn-secondary" onClick={markAllAsRead}>
            Mark All Read
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => setShowSettings(!showSettings)}
          >
            Settings
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
          <option value="unread">Unread</option>
          <option value="task_assignment">Task Assignments</option>
          <option value="due_date">Due Date Reminders</option>
          <option value="overdue">Overdue Tasks</option>
          <option value="mention">Mentions</option>
          <option value="status_change">Status Changes</option>
          <option value="milestone">Milestones</option>
        </select>
      </div>

      {showSettings && <NotificationSettings onClose={() => setShowSettings(false)} />}

      <div className="notification-list">
        {filteredNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={getPriorityClass(notification.priority)}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-timestamp">{notification.timestamp}</div>
            </div>
            <div className="notification-actions">
              {!notification.read && <div className="unread-indicator"></div>}
              <button 
                className="delete-btn"
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
    </div>
  )
}

function NotificationSettings({ onClose }) {
  const [settings, setSettings] = useState({
    channels: {
      inApp: true,
      email: true,
      push: false,
      calendar: false
    },
    types: {
      task_assignment: true,
      due_date: true,
      overdue: true,
      mention: true,
      status_change: false,
      custom: true,
      snooze_wakeup: true,
      milestone: true
    },
    dndWindow: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    },
    smartNudges: true,
    reminderIntervals: {
      due_date: '1', // days before
      overdue: '1'   // hours after
    }
  })

  const handleChannelChange = (channel) => {
    setSettings({
      ...settings,
      channels: {
        ...settings.channels,
        [channel]: !settings.channels[channel]
      }
    })
  }

  const handleTypeChange = (type) => {
    setSettings({
      ...settings,
      types: {
        ...settings.types,
        [type]: !settings.types[type]
      }
    })
  }

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h3>Notification Settings</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="settings-section">
        <h4>Notification Channels</h4>
        <div className="setting-group">
          {Object.entries(settings.channels).map(([channel, enabled]) => (
            <label key={channel} className="setting-item">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => handleChannelChange(channel)}
              />
              <span>{channel.charAt(0).toUpperCase() + channel.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h4>Notification Types</h4>
        <div className="setting-group">
          {Object.entries(settings.types).map(([type, enabled]) => (
            <label key={type} className="setting-item">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => handleTypeChange(type)}
              />
              <span>{type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h4>Do Not Disturb</h4>
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.dndWindow.enabled}
            onChange={(e) => setSettings({
              ...settings,
              dndWindow: { ...settings.dndWindow, enabled: e.target.checked }
            })}
          />
          <span>Enable DND Window</span>
        </label>
        {settings.dndWindow.enabled && (
          <div className="time-range">
            <input
              type="time"
              value={settings.dndWindow.startTime}
              onChange={(e) => setSettings({
                ...settings,
                dndWindow: { ...settings.dndWindow, startTime: e.target.value }
              })}
            />
            <span>to</span>
            <input
              type="time"
              value={settings.dndWindow.endTime}
              onChange={(e) => setSettings({
                ...settings,
                dndWindow: { ...settings.dndWindow, endTime: e.target.value }
              })}
            />
          </div>
        )}
      </div>

      <div className="settings-section">
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.smartNudges}
            onChange={(e) => setSettings({ ...settings, smartNudges: e.target.checked })}
          />
          <span>Smart nudges for idle tasks</span>
        </label>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={onClose}>Save Settings</button>
      </div>
    </div>
  )
}
