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