import React from 'react'

export default function Sidebar({ activeSection, setActiveSection }) {
  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'all-tasks', label: 'All Tasks', icon: '📋' },
    { id: 'create-task', label: 'Create Task', icon: '➕' },
    { id: 'assigned-to-me', label: 'Assigned to Me', icon: '👤' },
    { id: 'due-today', label: 'Due Today', icon: '⏰' }
  ]

  const advancedItems = [
    { id: 'recurring-tasks', label: 'Recurring Tasks', icon: '🔄' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ]

  const collaborationItems = [
    { id: 'milestones', label: 'Milestones', icon: '🎯' },
    { id: 'approvals', label: 'Approvals', icon: '✅' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h3>
          <ul className="space-y-1">
            {mainItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                    activeSection === item.id 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Advanced</h3>
          <ul className="space-y-1">
            {advancedItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                    activeSection === item.id 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Collaboration</h3>
          <ul className="space-y-1">
            {collaborationItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                    activeSection === item.id 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}