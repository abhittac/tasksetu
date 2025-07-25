
import React from 'react';
import { useAppSelector } from '../../store';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import { Task } from '../../types';

const Dashboard: React.FC = () => {
  const { tasks } = useAppSelector(state => state.tasks);

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'COMPLETED').length;
    const inProgress = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const pending = tasks.filter(task => task.status === 'PENDING').length;

    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your task management</p>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tasks"
            value={stats.total}
            icon="📋"
            color="blue"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon="🔄"
            color="yellow"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon="⏳"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity tasks={tasks.slice(0, 5)} />
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                📝 Create New Task
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                📊 View Analytics
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                ⚙️ Manage Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
