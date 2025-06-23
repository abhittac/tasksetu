import React from 'react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'
import Deadlines from './Deadlines'

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Tasks',
      value: '247',
      subtitle: 'All time',
      percentage: '+12%',
      trend: 'up',
      icon: '📋',
      color: 'blue'
    },
    {
      title: 'Completed Today',
      value: '18',
      subtitle: 'Out of 25 due',
      percentage: '72%',
      trend: 'up',
      icon: '✅',
      color: 'green'
    },
    {
      title: 'In Progress',
      value: '34',
      subtitle: 'Active tasks',
      percentage: '-8%',
      trend: 'down',
      icon: '⏳',
      color: 'yellow'
    },
    {
      title: 'Overdue',
      value: '7',
      subtitle: 'Need attention',
      percentage: '+3',
      trend: 'up',
      icon: '⚠️',
      color: 'red'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Welcome back! Here's what's happening with your tasks.</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <button className="btn btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Export Report
          </button>
          <button className="btn btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Deadlines */}
        <div>
          <Deadlines />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-lg">📋</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">View All Tasks</p>
              <p className="text-sm text-gray-500">Manage your tasks</p>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 text-lg">🔄</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Recurring Tasks</p>
              <p className="text-sm text-gray-500">Automate workflows</p>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-lg">📈</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-500">Track performance</p>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-orange-600 text-lg">🎯</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Milestones</p>
              <p className="text-sm text-gray-500">Track progress</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}