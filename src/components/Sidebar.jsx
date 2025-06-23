import React from 'react'

export default function Sidebar({ currentPage, setCurrentPage, isOpen, onClose }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', section: 'main' },
    { id: 'all-tasks', label: 'All Tasks', icon: '📋', section: 'main' },
    { id: 'create-task', label: 'Create Task', icon: '➕', section: 'main' },
    { id: 'assigned-tasks', label: 'Assigned to Me', icon: '👤', section: 'main' },
    { id: 'due-today', label: 'Due Today', icon: '⏰', section: 'main' },
    { id: 'recurring-tasks', label: 'Recurring Tasks', icon: '🔄', section: 'advanced' },
    { id: 'task-analytics', label: 'Analytics', icon: '📈', section: 'advanced' },
    { id: 'milestones', label: 'Milestones', icon: '🎯', section: 'collab' },
    { id: 'approvals', label: 'Approvals', icon: '✅', section: 'collab' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', section: 'collab' },
    { id: 'status-management', label: 'Status Management', icon: '🔄', section: 'config' },
    { id: 'priority-management', label: 'Priority Management', icon: '🔥', section: 'config' },
  ]

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId)
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const sections = {
    main: { title: 'Main', items: navItems.filter(item => item.section === 'main') },
    advanced: { title: 'Advanced', items: navItems.filter(item => item.section === 'advanced') },
    collab: { title: 'Collaboration', items: navItems.filter(item => item.section === 'collab') },
    config: { title: 'Configuration', items: navItems.filter(item => item.section === 'config') },
  }

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {Object.entries(sections).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-all duration-200 ${
                        currentPage === item.id
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <span className="font-medium text-sm truncate">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}