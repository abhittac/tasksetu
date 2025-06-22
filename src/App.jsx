
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

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
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="admin-panel">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  )
}
