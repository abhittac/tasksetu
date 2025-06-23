import React from 'react'

export default function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'all-tasks', label: 'All Tasks', icon: '📋' },
    { id: 'create-task', label: 'Create Task', icon: '➕' },
    { id: 'recurring-tasks', label: 'Recurring Tasks', icon: '🔄' },
    { id: 'status-manager', label: 'Status Manager', icon: '🏷️' },
    { id: 'priority-manager', label: 'Priority Manager', icon: '🎯' },
    { id: 'milestone-manager', label: 'Milestone Manager', icon: '🏆' },
    { id: 'approval-manager', label: 'Approval Manager', icon: '✅' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ]

  const sidebarStyle = {
    width: '256px',
    backgroundColor: 'white',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  }

  const headerStyle = {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb'
  }

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  }

  const contentStyle = {
    flex: 1,
    padding: '16px 12px',
    overflowY: 'auto'
  }

  const menuItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '4px',
    backgroundColor: isActive ? '#dbeafe' : 'transparent',
    color: isActive ? '#1d4ed8' : '#374151',
    transition: 'all 0.2s ease'
  })

  const iconStyle = {
    marginRight: '12px',
    fontSize: '16px'
  }

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Task Manager</h1>
      </div>

      <div style={contentStyle}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            padding: '0 12px',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Main
          </div>

          {menuItems.map((item) => (
            <div
              key={item.id}
              style={menuItemStyle(currentView === item.id)}
              onClick={() => setCurrentView(item.id)}
              onMouseOver={(e) => {
                if (currentView !== item.id) {
                  e.target.style.backgroundColor = '#f3f4f6'
                }
              }}
              onMouseOut={(e) => {
                if (currentView !== item.id) {
                  e.target.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={iconStyle}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}