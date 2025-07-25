import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AllTasks from "./components/AllTasks";
import CreateTask from "./components/CreateTask";
import RecurringTaskManager from "./components/RecurringTaskManager";
import StatusManager from "./components/StatusManager";
import PriorityManager from "./components/PriorityManager";
import TaskAnalytics from "./components/TaskAnalytics";
import ApprovalManager from "./components/ApprovalManager";
import MilestoneManager from "./components/MilestoneManager";
import NotificationCenter from "./components/NotificationCenter";
import ActivityFeed from "./components/ActivityFeed";
import Deadlines from "./components/Deadlines";
import TaskDetail from "./components/TaskDetail";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleNavigateToTask = (taskId) => {
    setSelectedTaskId(taskId);
    setCurrentView("task-detail");
  };

  const handleBackToTasks = () => {
    setSelectedTaskId(null);
    setCurrentView("all-tasks");
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onCreateTask={() => setShowCreateTaskDrawer(true)} />;
      case "all-tasks":
        return (
          <AllTasks
            onCreateTask={() => setShowCreateTaskDrawer(true)}
            onNavigateToTask={handleNavigateToTask}
          />
        );
      case "task-detail":
        return selectedTaskId ? (
          <TaskDetail taskId={selectedTaskId} onClose={handleBackToTasks} />
        ) : (
          <AllTasks
            onCreateTask={() => setShowCreateTaskDrawer(true)}
            onNavigateToTask={handleNavigateToTask}
          />
        );
      case "create-task":
        setShowCreateTaskDrawer(true);
        setCurrentView("dashboard");
        return <Dashboard onCreateTask={() => setShowCreateTaskDrawer(true)} />;
      case "recurring-tasks":
        return <RecurringTaskManager />;
      case "status-manager":
        return <StatusManager />;
      case "priority-manager":
        return <PriorityManager />;
      case "analytics":
        return <TaskAnalytics />;
      case "approvals":
        return <ApprovalManager />;
      case "milestones":
        return <MilestoneManager />;
      case "notifications":
        return <NotificationCenter />;
      case "activity":
        return <ActivityFeed />;
      case "deadlines":
        return <Deadlines />;
      default:
        return <Dashboard onCreateTask={() => setShowCreateTaskDrawer(true)} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreateTask={() => setShowCreateTaskDrawer(true)}
      />
      <main className="main-content">{renderContent()}</main>

      {/* Slide-in Drawer */}
      {showCreateTaskDrawer && (
        <div className={`task-drawer ${showCreateTaskDrawer ? "open" : ""}`}>
          <div
            className="drawer-overlay"
            onClick={() => setShowCreateTaskDrawer(false)}
          ></div>
          <div className="drawer-content">
            <div className="drawer-header">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Task
              </h2>
              <button
                onClick={() => setShowCreateTaskDrawer(false)}
                className="close-btn"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
  );
}
import React, { useState } from 'react';
import { MainLayout } from './components/Layout';
import { Dashboard, AllTasks, CreateTask } from './pages';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const getPageTitle = (tab) => {
    const titles = {
      dashboard: 'Dashboard',
      tasks: 'All Tasks',
      calendar: 'Calendar',
      approvals: 'Approval Manager',
      milestones: 'Milestone Manager',
      recurring: 'Recurring Tasks',
      analytics: 'Analytics',
      notifications: 'Notifications',
      activity: 'Activity Feed',
      deadlines: 'Deadlines',
      status: 'Status Manager',
      priority: 'Priority Manager'
    };
    return titles[tab] || 'TaskSetu';
  };

  const handleCreateTask = () => {
    setShowCreateTask(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    console.log('Task clicked:', task);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <AllTasks onTaskClick={handleTaskClick} />;
      case 'calendar':
        return <div className="text-center py-12 text-gray-500">Calendar view coming soon...</div>;
      case 'approvals':
        return <div className="text-center py-12 text-gray-500">Approval Manager coming soon...</div>;
      case 'milestones':
        return <div className="text-center py-12 text-gray-500">Milestone Manager coming soon...</div>;
      case 'recurring':
        return <div className="text-center py-12 text-gray-500">Recurring Tasks coming soon...</div>;
      case 'analytics':
        return <div className="text-center py-12 text-gray-500">Analytics coming soon...</div>;
      case 'notifications':
        return <div className="text-center py-12 text-gray-500">Notifications coming soon...</div>;
      case 'activity':
        return <div className="text-center py-12 text-gray-500">Activity Feed coming soon...</div>;
      case 'deadlines':
        return <div className="text-center py-12 text-gray-500">Deadlines coming soon...</div>;
      case 'status':
        return <div className="text-center py-12 text-gray-500">Status Manager coming soon...</div>;
      case 'priority':
        return <div className="text-center py-12 text-gray-500">Priority Manager coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <MainLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title={getPageTitle(activeTab)}
        onCreateTask={handleCreateTask}
      >
        {renderContent()}
      </MainLayout>

      <CreateTask
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
      />
    </div>
  );
}

export default App;
