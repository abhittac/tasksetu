import React from 'react'

export default function Sidebar({ currentView, onViewChange, onCreateTask }) {
  const menuItems = [
    {
      section: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'all-tasks', label: 'All Tasks', icon: '📋' },
        { id: 'create-task', label: 'Create Task', icon: '➕' },
        { id: 'deadlines', label: 'Deadlines', icon: '⏰' },
      ]
    },
    {
      section: 'Management',
      items: [
        { id: 'recurring-tasks', label: 'Recurring Tasks', icon: '🔄' },
        { id: 'approvals', label: 'Approvals', icon: '✅' },
        { id: 'milestones', label: 'Milestones', icon: '🏁' },
        { id: 'status-manager', label: 'Status Manager', icon: '🏷️' },
        { id: 'priority-manager', label: 'Priority Manager', icon: '🎯' },
      ]
    },
    {
      section: 'Insights',
      items: [
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'activity', label: 'Activity Feed', icon: '🔔' },
        { id: 'notifications', label: 'Notifications', icon: '📢' },
      ]
    }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="text-xl font-bold text-gray-900">TaskFlow Pro</h1>
        <p className="text-sm text-gray-500 mt-1">Task Management System</p>
      </div>

      <nav className="sidebar-content">
        {menuItems.map((section) => (
          <div key={section.section} className="nav-section">
            <h3 className="nav-section-title">{section.section}</h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`nav-item w-full text-left ${
                      currentView === item.id ? 'active' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
              <li key="create-task">
                  <button
                    onClick={() => onCreateTask('create-task')}
                    className={`nav-item w-full text-left ${
                      false ? 'active' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="nav-icon">➕</span>
                    Create Task
                  </button>
                </li>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
```Here's the updated `Sidebar` component that passes the `onCreateTask` prop to the "Create Task" button.