import React, { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AllTasks from './components/AllTasks'
import CreateTask from './components/CreateTask'
import RecurringTaskManager from './components/RecurringTaskManager'
import StatusManager from './components/StatusManager'
import PriorityManager from './components/PriorityManager'
import MilestoneManager from './components/MilestoneManager'
import ApprovalManager from './components/ApprovalManager'
import TaskAnalytics from './components/TaskAnalytics'
import NotificationCenter from './components/NotificationCenter'

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
      case 'milestone-manager':
        return <MilestoneManager />
      case 'approval-manager':
        return <ApprovalManager />
      case 'analytics':
        return <TaskAnalytics />
      case 'notifications':
        return <NotificationCenter />
      default:
        return <Dashboard />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb' }}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '24px',
          backgroundColor: '#f9fafb'
        }}>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}