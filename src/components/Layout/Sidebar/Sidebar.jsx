
import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tasks', label: 'All Tasks', icon: '📋' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'approvals', label: 'Approval Manager', icon: '✅' },
    { id: 'milestones', label: 'Milestone Manager', icon: '🎯' },
    { id: 'recurring', label: 'Recurring Tasks', icon: '🔄' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'activity', label: 'Activity Feed', icon: '📝' },
    { id: 'deadlines', label: 'Deadlines', icon: '⏰' },
    { id: 'status', label: 'Status Manager', icon: '🏷️' },
    { id: 'priority', label: 'Priority Manager', icon: '🎯' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">TaskSetu</h1>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
