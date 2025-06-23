
import React from 'react'

export default function Sidebar({ currentPage, setCurrentPage, isOpen, onClose }) {
  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'all-tasks', label: 'All Tasks', icon: '📋' },
    { id: 'create-task', label: 'Create Task', icon: '➕' },
    { id: 'assigned-tasks', label: 'Assigned to Me', icon: '👤' },
    { id: 'due-today', label: 'Due Today', icon: '⏰' }
  ]

  const advancedItems = [
    { id: 'recurring-tasks', label: 'Recurring Tasks', icon: '🔄' },
    { id: 'task-analytics', label: 'Analytics', icon: '📈' }
  ]

  const collaborationItems = [
    { id: 'milestones', label: 'Milestones', icon: '🎯' },
    { id: 'approvals', label: 'Approvals', icon: '✅' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ]

  const handleItemClick = (itemId) => {
    setCurrentPage(itemId)
    if (onClose) {
      onClose() // Close mobile sidebar when item is clicked
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-8">
              {/* Main Section */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Main
                </h3>
                <div className="mt-2 space-y-1">
                  {mainItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        currentPage === item.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Section */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Advanced
                </h3>
                <div className="mt-2 space-y-1">
                  {advancedItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        currentPage === item.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collaboration Section */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Collaboration
                </h3>
                <div className="mt-2 space-y-1">
                  {collaborationItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        currentPage === item.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 flex z-40 ${isOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            
            <nav className="mt-5 px-2 space-y-8">
              {/* Main Section */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Main
                </h3>
                <div className="mt-2 space-y-1">
                  {mainItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        currentPage === item.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Section */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Advanced
                </h3>
                <div className="mt-2 space-y-1">
                  {advancedItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        currentPage === item.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collaboration Section */}
              <div>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Collaboration
                </h3>
                <div className="mt-2 space-y-1">
                  {collaborationItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                        currentPage === item.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
