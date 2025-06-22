import React from 'react'

export default function Sidebar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', section: 'main' },
    { id: 'all-tasks', label: 'All Tasks', icon: '📋', section: 'task' },
    { id: 'create-task', label: 'Create Task', icon: '➕', section: 'task' },
    { id: 'recurring-tasks', label: 'Recurring Tasks', icon: '🔄', section: 'task' },
    { id: 'task-analytics', label: 'Task Analytics', icon: '📊', section: 'task' },
    { id: 'assigned-tasks', label: 'Assigned Tasks', icon: '👥', section: 'task' },
    { id: 'due-today', label: 'Due Today', icon: '⏰', section: 'task' },
    { id: 'comments', label: 'Comments & Activity', icon: '💬', section: 'collab' },
    { id: 'attachments', label: 'Files & Links', icon: '📎', section: 'collab' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', section: 'task' },
    { id: 'milestones', label: 'Milestones', icon: '⭐', section: 'task' },
    { id: 'approvals', label: 'Approvals', icon: '✅', section: 'task' }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">T</div>
          <span>TaskGuru</span>
        </div>
        <div className="user-info">
          <span>Admin User</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-label">MAIN</span>
          <ul>
            {navItems.filter(item => item.section === 'main').map(item => (
              <li
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <span className="nav-label">TASK MANAGEMENT</span>
          <ul>
            {navItems.filter(item => item.section === 'task').map(item => (
              <li
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <span className="nav-label">COLLABORATION</span>
          <ul>
            {navItems.filter(item => item.section === 'collab').map(item => (
              <li
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}