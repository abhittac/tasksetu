
import React from 'react';
import { Card } from '../../components/UI';

const Dashboard = () => {
  const stats = [
    { title: 'Total Tasks', value: '24', icon: '📋', color: 'blue' },
    { title: 'In Progress', value: '8', icon: '🔄', color: 'yellow' },
    { title: 'Completed', value: '16', icon: '✅', color: 'green' },
    { title: 'Overdue', value: '3', icon: '⚠️', color: 'red' }
  ];

  const recentTasks = [
    { id: 1, title: 'User authentication system', assignee: 'John Doe', status: 'In Progress' },
    { id: 2, title: 'Design new landing page', assignee: 'Jane Smith', status: 'To Do' },
    { id: 3, title: 'Fix mobile responsiveness', assignee: 'Mike Johnson', status: 'Done' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-600">{task.assignee}</div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              📋 Create New Task
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              📅 View Calendar
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              📊 View Analytics
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
