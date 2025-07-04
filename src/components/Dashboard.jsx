
import React, { useState } from 'react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'
import CreateTask from './CreateTask'

export default function Dashboard() {
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [selectedTaskType, setSelectedTaskType] = useState('regular')

  const handleCreateTask = (taskType) => {
    setSelectedTaskType(taskType)
    setShowCreateTask(true)
  }
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

        {/* Task Creation Tiles */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
              <p className="text-gray-600">Choose the type of task you want to create</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TaskCreationTile
                type="regular"
                title="Simple Task"
                description="Create a standard one-time task"
                icon="📋"
                color="blue"
                onClick={() => handleCreateTask('regular')}
              />
              <TaskCreationTile
                type="recurring"
                title="Recurring Task"
                description="Set up a task that repeats on schedule"
                icon="🔄"
                color="green"
                onClick={() => handleCreateTask('recurring')}
              />
              <TaskCreationTile
                type="milestone"
                title="Milestone"
                description="Create a project checkpoint"
                icon="🎯"
                color="purple"
                onClick={() => handleCreateTask('milestone')}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <button className="btn btn-secondary">
                <span className="mr-2">📅</span>
                Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 z-50 overflow-hidden overlay-animate mt-0">
          <div className="drawer-overlay absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateTask(false)}></div>
          <div className="absolute right-0 top-0 h-full bg-white/95 backdrop-blur-sm flex flex-col modal-animate-slide-right" style={{width: 'min(90vw, 600px)', boxShadow: '-10px 0 50px rgba(0,0,0,0.2)', borderLeft: '1px solid rgba(255,255,255,0.2)'}}>
            <div className="drawer-header">
              <h2 className="text-2xl font-bold text-white">Create New Task</h2>
              <button
                onClick={() => setShowCreateTask(false)}
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
              <CreateTask 
                onClose={() => setShowCreateTask(false)} 
                initialTaskType={selectedTaskType}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Task Creation Tile Component
function TaskCreationTile({ type, title, description, icon, color, onClick }) {
  const colorClasses = {
    blue: 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100',
    green: 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100',
    purple: 'border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100'
  }

  const iconColorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white'
  }

  return (
    <button
      onClick={onClick}
      className={`p-6 border-2 rounded-xl text-left transition-all duration-300 group transform hover:scale-105 hover:shadow-lg ${colorClasses[color]}`}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${iconColorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 mb-2">{title}</h4>
          <p className="text-sm text-gray-600 group-hover:text-gray-700">{description}</p>
        </div>
      </div>
    </button>
  )
}
