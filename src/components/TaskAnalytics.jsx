
import React from 'react'

export default function TaskAnalytics() {
  const analyticsData = {
    totalTasks: 156,
    completedTasks: 89,
    inProgressTasks: 45,
    pendingTasks: 22,
    overdueTasks: 8
  }

  const completionRate = Math.round((analyticsData.completedTasks / analyticsData.totalTasks) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Analytics</h1>
          <p className="mt-2 text-lg text-gray-600">Insights and performance metrics for your tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.totalTasks}</div>
              <div className="text-sm text-green-600">+12% from last month</div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.completedTasks}</div>
              <div className="text-sm text-green-600">+8% completion rate</div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.inProgressTasks}</div>
              <div className="text-sm text-gray-600">28% of total tasks</div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600">Pending</h3>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.pendingTasks}</div>
              <div className="text-sm text-gray-600">14% of total tasks</div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
              <div className="text-2xl font-bold text-gray-900">{analyticsData.overdueTasks}</div>
              <div className="text-sm text-red-600">Needs attention</div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Completion Rate</h3>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${completionRate * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{completionRate}%</span>
                </div>
              </div>
              <div className="text-sm text-green-600 mt-2">Great progress!</div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-section">
          <h3>Task Distribution by Priority</h3>
          <div className="priority-chart">
            <div className="priority-bar">
              <div className="priority-label">High Priority</div>
              <div className="priority-progress">
                <div className="priority-fill high" style={{width: '35%'}}></div>
              </div>
              <div className="priority-count">35%</div>
            </div>
            <div className="priority-bar">
              <div className="priority-label">Medium Priority</div>
              <div className="priority-progress">
                <div className="priority-fill medium" style={{width: '45%'}}></div>
              </div>
              <div className="priority-count">45%</div>
            </div>
            <div className="priority-bar">
              <div className="priority-label">Low Priority</div>
              <div className="priority-progress">
                <div className="priority-fill low" style={{width: '20%'}}></div>
              </div>
              <div className="priority-count">20%</div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Team Performance</h3>
          <div className="team-stats">
            <div className="team-member">
              <div className="member-name">John Smith</div>
              <div className="member-tasks">24 tasks completed</div>
              <div className="member-rate">95% completion rate</div>
            </div>
            <div className="team-member">
              <div className="member-name">Sarah Wilson</div>
              <div className="member-tasks">18 tasks completed</div>
              <div className="member-rate">88% completion rate</div>
            </div>
            <div className="team-member">
              <div className="member-name">Mike Johnson</div>
              <div className="member-tasks">21 tasks completed</div>
              <div className="member-rate">92% completion rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
