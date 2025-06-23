import React, { useState } from 'react'

export default function AllTasks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showSnooze, setShowSnooze] = useState(false)

  const tasks = [
    {
      id: 1,
      title: 'Update user authentication system',
      assignee: 'John Doe',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-01-25',
      category: 'Development',
      progress: 60
    },
    {
      id: 2,
      title: 'Design new landing page',
      assignee: 'Jane Smith',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '2024-01-30',
      category: 'Design',
      progress: 0
    },
    {
      id: 3,
      title: 'Fix mobile responsiveness issues',
      assignee: 'Mike Johnson',
      status: 'Completed',
      priority: 'Low',
      dueDate: '2024-01-20',
      category: 'Development',
      progress: 100
    },
    {
      id: 4,
      title: 'Conduct user research interviews',
      assignee: 'Sarah Wilson',
      status: 'In Review',
      priority: 'High',
      dueDate: '2024-01-28',
      category: 'Research',
      progress: 80
    }
  ]

  const getStatusBadge = (status) => {
    const statusClasses = {
      'To Do': 'status-badge status-todo',
      'In Progress': 'status-badge status-progress',
      'In Review': 'status-badge status-review',
      'Completed': 'status-badge status-completed'
    }
    return statusClasses[status] || 'status-badge status-todo'
  }

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      'Low': 'status-badge priority-low',
      'Medium': 'status-badge priority-medium',
      'High': 'status-badge priority-high',
      'Urgent': 'status-badge priority-urgent'
    }
    return priorityClasses[priority] || 'status-badge priority-low'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p className="mt-2 text-lg text-gray-600">Manage and track all your tasks</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setShowSnooze(!showSnooze)}
            className={`btn ${showSnooze ? 'btn-primary' : 'btn-secondary'}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {showSnooze ? 'Hide' : 'Show'} Snoozed Tasks
          </button>
          <button className="btn btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>

            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select className="form-select">
              <option>All Categories</option>
              <option>Development</option>
              <option>Design</option>
              <option>Research</option>
              <option>Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex justify-end gap-2">
        <button className="btn btn-secondary btn-sm">Export as CSV</button>
        <button className="btn btn-secondary btn-sm">Export as Excel</button>
      </div>

      {/* Tasks Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-gray-600">{task.assignee.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="text-sm text-gray-900">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(task.status)}>{task.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 min-w-[3rem]">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
          <span className="font-medium">97</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn btn-secondary btn-sm">Previous</button>
          <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">2</button>
          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">3</button>
          <button className="btn btn-secondary btn-sm">Next</button>
        </div>
      </div>
    </div>
  )
}