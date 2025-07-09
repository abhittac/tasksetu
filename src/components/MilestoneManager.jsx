import React, { useState } from 'react'

// Helper functions moved outside component
const getStatusColor = (status) => {
  const colors = {
    not_started: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
    critical: 'bg-purple-100 text-purple-800'
  }
  return colors[priority] || 'bg-gray-100 text-gray-800'
}

export default function MilestoneManager() {
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      taskName: 'Project Alpha Launch',
      isMilestone: true,
      milestoneType: 'standalone',
      linkedTasks: [1, 2, 3, 4],
      dueDate: '2024-02-15',
      assignedTo: 'John Smith',
      description: 'Complete launch of the new project management system',
      visibility: 'public',
      priority: 'high',
      collaborators: ['Sarah Wilson', 'Mike Johnson'],
      status: 'in_progress',
      progress: 75,
      tasks: [
        { id: 1, title: 'UI Design Complete', completed: true },
        { id: 2, title: 'Backend API Development', completed: true },
        { id: 3, title: 'Testing Phase', completed: false },
        { id: 4, title: 'Deployment', completed: false }
      ]
    },
    {
      id: 2,
      taskName: 'Q1 Marketing Campaign',
      isMilestone: true,
      milestoneType: 'linked',
      linkedTasks: [5, 6, 7],
      dueDate: '2024-03-31',
      assignedTo: 'Emily Davis',
      description: 'Launch comprehensive marketing campaign for Q1',
      visibility: 'private',
      priority: 'medium',
      collaborators: ['Current User'],
      status: 'not_started',
      progress: 0,
      tasks: [
        { id: 5, title: 'Content Strategy', completed: false },
        { id: 6, title: 'Creative Assets', completed: false },
        { id: 7, title: 'Campaign Launch', completed: false }
      ]
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)

  

  return (
    <div className="space-y-6 p-5 h-auto overflow-scroll">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Milestone Manager</h1>
          <p className="mt-2 text-lg text-gray-600">Track and manage project milestones</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Milestone
        </button>
      </div>

      <div className="grid gap-6">
        {milestones.map(milestone => (
          <div key={milestone.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.taskName}</h3>
                <p className="text-gray-600 mb-4">{milestone.description}</p>

                <div className="flex items-center space-x-4 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                    {milestone.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                    {milestone.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {milestone.milestoneType.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Assigned: {milestone.assignedTo}
                  </span>
                  <span className="text-sm text-gray-500">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    👁️ {milestone.visibility}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{milestone.progress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{milestone.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${milestone.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Collaborators</h4>
                <div className="flex flex-wrap gap-2">
                  {milestone.collaborators.map((collaborator, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      👤 {collaborator}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Associated Tasks</h4>
                <div className="space-y-2">
                  {milestone.tasks.map(task => (
                    <div key={task.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        readOnly
                      />
                      <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button className="btn btn-secondary btn-sm">
                Edit
              </button>
              <button className="btn btn-primary btn-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h3>Add New Milestone</h3>
              <button className="close-button" onClick={() => setShowAddForm(false)}>×</button>
            </div>

            <form className="modal-content">
              <div className="form-group">
                <label htmlFor="taskName">Task Name*</label>
                <input
                  type="text"
                  id="taskName"
                  placeholder="Enter milestone title"
                  className="w-full form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="isMilestone" className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isMilestone"
                    defaultChecked={true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Milestone Toggle*</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">Mandatory toggle to mark task as Milestone</p>
              </div>

              <div className="form-group">
                <label htmlFor="milestoneType">Milestone Type</label>
                <select id="milestoneType" className="w-full form-input">
                  <option value="standalone">Standalone</option>
                  <option value="linked">Linked to Tasks</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="linkedTasks">Link to Tasks</label>
                <select multiple id="linkedTasks" className="w-full form-input h-24">
                  <option value="1">UI Design Complete</option>
                  <option value="2">Backend API Development</option>
                  <option value="3">Testing Phase</option>
                  <option value="4">Deployment</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Visible only if Linked is selected — choose tasks/subtasks to monitor</p>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date*</label>
                <input
                  type="date"
                  id="dueDate"
                  className="w-full form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assignedTo">Assigned To</label>
                <select id="assignedTo" className="w-full form-input">
                  <option value="Current User">Current User</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Sarah Wilson">Sarah Wilson</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Emily Davis">Emily Davis</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Describe the milestone... (for background, criteria, purpose)"
                  rows="3"
                  className="w-full form-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="visibility">Visibility</label>
                  <select id="visibility" className="w-full form-input">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select id="priority" className="w-full form-input">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="collaborators">Collaborators</label>
                <select multiple id="collaborators" className="w-full form-input h-20">
                  <option value="Current User">Current User</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Sarah Wilson">Sarah Wilson</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Emily Davis">Emily Davis</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Optional (for updates & comments visibility)</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary rounded-sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-4 rounded-sm">
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}