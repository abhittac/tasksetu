import React, { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AllTasks from './components/AllTasks'
import CreateTask from './components/CreateTask'
import RecurringTaskManager from './components/RecurringTaskManager'
import StatusManager from './components/StatusManager'
import PriorityManager from './components/PriorityManager'
import TaskAnalytics from './components/TaskAnalytics'
import ApprovalManager from './components/ApprovalManager'
import MilestoneManager from './components/MilestoneManager'
import NotificationCenter from './components/NotificationCenter'
import ActivityFeed from './components/ActivityFeed'
import Deadlines from './components/Deadlines'
import TaskDetail from './components/TaskDetail'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  // Handle body lock for drawer
  useEffect(() => {
    if (showCreateTaskDrawer) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [showCreateTaskDrawer])

  const handleNavigateToTask = (taskId) => {
    setSelectedTaskId(taskId)
    setCurrentView('task-detail')
  }

  const handleBackToTasks = () => {
    setSelectedTaskId(null)
    setCurrentView('all-tasks')
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onCreateTask={() => setShowCreateTaskDrawer(true)} />
      case 'all-tasks':
        return <AllTasks onCreateTask={() => setShowCreateTaskDrawer(true)} onNavigateToTask={handleNavigateToTask} />
      case 'task-detail':
        return selectedTaskId ? <TaskDetail taskId={selectedTaskId} onClose={handleBackToTasks} /> : <AllTasks onCreateTask={() => setShowCreateTaskDrawer(true)} onNavigateToTask={handleNavigateToTask} />
      case 'create-task':
        setShowCreateTaskDrawer(true)
        setCurrentView('dashboard')
        return <Dashboard onCreateTask={() => setShowCreateTaskDrawer(true)} />
      case 'recurring-tasks':
        return <RecurringTaskManager />
      case 'status-manager':
        return <StatusManager />
      case 'priority-manager':
        return <PriorityManager />
      case 'analytics':
        return <TaskAnalytics />
      case 'approvals':
        return <ApprovalManager />
      case 'milestones':
        return <MilestoneManager />
      case 'notifications':
        return <NotificationCenter />
      case 'activity':
        return <ActivityFeed />
      case 'deadlines':
        return <Deadlines />
      default:
        return <Dashboard onCreateTask={() => setShowCreateTaskDrawer(true)} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onCreateTask={() => setShowCreateTaskDrawer(true)} />
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Slide-in Drawer */}
      {showCreateTaskDrawer && (
        <div className={`task-drawer ${showCreateTaskDrawer ? 'open' : ''}`}>
          <div className="drawer-overlay" onClick={() => setShowCreateTaskDrawer(false)}></div>
          <div className="drawer-content">
            <div className="drawer-header">
              <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
              <button 
                onClick={() => setShowCreateTaskDrawer(false)}
                className="close-btn"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="drawer-body">
              <CreateTask onClose={() => setShowCreateTaskDrawer(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}