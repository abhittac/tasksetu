
import React from 'react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Tasks',
      value: '1,234',
      subtitle: 'All time',
      percentage: '+12%',
      trend: 'up',
      icon: '📋',
      color: 'blue'
    },
    {
      title: 'Completed',
      value: '856',
      subtitle: 'This month',
      percentage: '+8%',
      trend: 'up',
      icon: '✅',
      color: 'green'
    },
    {
      title: 'In Progress',
      value: '234',
      subtitle: 'Active tasks',
      percentage: '+3%',
      trend: 'up',
      icon: '⏳',
      color: 'yellow'
    },
    {
      title: 'Overdue',
      value: '12',
      subtitle: 'Need attention',
      percentage: '-5%',
      trend: 'down',
      icon: '⚠️',
      color: 'red'
    }
  ]

  return (
    <div className="min-h-full overflow-scroll bg-gray-50">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your tasks.</p>
        </div>
      </div>
      
      <div className="p-6">
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((task) => (
                  <div key={task} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">T{task}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Task Title {task}</p>
                        <p className="text-sm text-gray-500">Due tomorrow</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="status-badge status-progress">In Progress</span>
                      <span className="priority-badge priority-medium">Medium</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="btn btn-primary">
                <span className="mr-2">➕</span>
                New Task
              </button>
              <button className="btn btn-secondary">
                <span className="mr-2">📊</span>
                View Reports
              </button>
              <button className="btn btn-secondary">
                <span className="mr-2">👥</span>
                Team Tasks
              </button>
              <button className="btn btn-secondary">
                <span className="mr-2">⚙️</span>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
