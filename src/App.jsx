import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AllTasks from './components/AllTasks'
import CreateTask from './components/CreateTask'
import TaskAnalytics from './components/TaskAnalytics'
import RecurringTaskManager from './components/RecurringTaskManager'
import NotificationCenter from './components/NotificationCenter'
import MilestoneManager from './components/MilestoneManager'
import ApprovalManager from './components/ApprovalManager'
import StatusManager from './components/StatusManager'
import PriorityManager from './components/PriorityManager'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'all-tasks':
        return <AllTasks />
      case 'create-task':
        return <CreateTask />
      case 'recurring-tasks':
        return <RecurringTaskManager />
      case 'task-analytics':
        return <TaskAnalytics />
      case 'assigned-tasks':
        return <AllTasks /> // Can be customized later
      case 'due-today':
        return <AllTasks /> // Can be customized later
      case 'notifications':
        return <NotificationCenter />
      case 'milestones':
        return <MilestoneManager />
      case 'approvals':
        return <ApprovalManager />
      case 'status-management':
        return <StatusManager />
      case 'priority-management':
        return <PriorityManager />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-64">
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">TaskFlow</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {renderCurrentPage()}
        </div>
      </main>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}