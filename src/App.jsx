
import React, { useState } from 'react'
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

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'all-tasks':
        return <AllTasks />
      case 'create-task':
        return <CreateTask />
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
        return <Dashboard />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="main-content">
        <div className="page-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
