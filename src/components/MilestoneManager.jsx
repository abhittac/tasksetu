
import React, { useState } from 'react'

export default function MilestoneManager() {
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "Phase 1 Development Complete",
      type: "linked",
      status: "ready_for_confirmation",
      assignee: "John Smith",
      assigneeId: 1,
      dueDate: "2024-01-25",
      description: "Complete all core backend functionality and initial frontend setup",
      visibility: "private",
      priority: "high",
      collaborators: ["Sarah Wilson", "Mike Johnson"],
      linkedTasks: [
        { id: 101, title: "Database Setup", status: "completed" },
        { id: 102, title: "API Endpoints", status: "completed" },
        { id: 103, title: "Frontend Integration", status: "completed" }
      ],
      confirmed: false,
      createdBy: "Project Manager",
      createdAt: "2024-01-15",
      isAchieved: false
    },
    {
      id: 2,
      title: "Security Audit Complete",
      type: "standalone",
      status: "pending",
      assignee: "Emily Davis",
      assigneeId: 4,
      dueDate: "2024-02-01",
      description: "Complete comprehensive security review and vulnerability assessment",
      visibility: "public",
      priority: "critical",
      collaborators: ["Security Team"],
      linkedTasks: [],
      confirmed: false,
      createdBy: "Security Team",
      createdAt: "2024-01-20",
      isAchieved: false
    },
    {
      id: 3,
      title: "MVP Launch Ready",
      type: "linked",
      status: "in_progress",
      assignee: "Sarah Wilson",
      assigneeId: 3,
      dueDate: "2024-02-15",
      description: "All MVP features complete and ready for production deployment",
      visibility: "public",
      priority: "critical",
      collaborators: ["John Smith", "Emily Davis"],
      linkedTasks: [
        { id: 201, title: "Testing Complete", status: "in-progress" },
        { id: 202, title: "Documentation", status: "pending" },
        { id: 203, title: "Deployment Setup", status: "completed" }
      ],
      confirmed: false,
      createdBy: "Product Owner",
      createdAt: "2024-01-18",
      isAchieved: false
    }
  ])

  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'admin' })
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Available tasks for linking (in real app, this would come from API)
  const [availableTasks] = useState([
    { id: 101, title: "Database Setup", status: "completed" },
    { id: 102, title: "API Endpoints", status: "completed" },
    { id: 103, title: "Frontend Integration", status: "completed" },
    { id: 201, title: "Testing Complete", status: "in-progress" },
    { id: 202, title: "Documentation", status: "pending" },
    { id: 203, title: "Deployment Setup", status: "completed" },
    { id: 301, title: "User Authentication", status: "completed" },
    { id: 302, title: "Payment Integration", status: "in-progress" },
    { id: 303, title: "Email Notifications", status: "pending" }
  ])

  const getMilestoneStatus = (milestone) => {
    if (milestone.isAchieved) return 'achieved'
    if (milestone.confirmed) return 'confirmed'
    if (milestone.type === 'standalone') return milestone.status
    
    const allLinkedCompleted = milestone.linkedTasks.every(task => task.status === 'completed')
    return allLinkedCompleted ? 'ready_for_confirmation' : 'in_progress'
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge pending',
      in_progress: 'status-badge in-progress',
      ready_for_confirmation: 'status-badge ready',
      confirmed: 'status-badge confirmed',
      achieved: 'status-badge achieved'
    }
    return statusClasses[status] || 'status-badge'
  }

  const canConfirmMilestone = (milestone) => {
    return (milestone.assigneeId === currentUser.id || currentUser.role === 'admin') 
           && getMilestoneStatus(milestone) === 'ready_for_confirmation'
  }

  const canMarkAchieved = (milestone) => {
    return (milestone.assigneeId === currentUser.id || currentUser.role === 'admin') 
           && milestone.confirmed && !milestone.isAchieved
  }

  const confirmMilestone = (milestoneId) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, confirmed: true, status: 'confirmed' }
        : milestone
    ))
  }

  const markMilestoneAchieved = (milestoneId) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, isAchieved: true, achievedAt: new Date().toISOString() }
        : milestone
    ))
  }

  const getCompletionPercentage = (milestone) => {
    if (milestone.type === 'standalone') return milestone.status === 'completed' ? 100 : 0
    if (milestone.linkedTasks.length === 0) return 0
    
    const completedTasks = milestone.linkedTasks.filter(task => task.status === 'completed').length
    return Math.round((completedTasks / milestone.linkedTasks.length) * 100)
  }

  const handleCreateMilestone = (milestoneData) => {
    const newMilestone = {
      id: Date.now(),
      ...milestoneData,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
      confirmed: false,
      isAchieved: false,
      status: 'pending'
    }
    setMilestones([...milestones, newMilestone])
    setShowCreateModal(false)
  }

  const filteredMilestones = milestones.filter(milestone => {
    const status = getMilestoneStatus(milestone)
    const statusMatch = filter === 'all' || status === filter
    const typeMatch = typeFilter === 'all' || milestone.type === typeFilter
    return statusMatch && typeMatch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⭐ Milestone Tasks</h1>
          <p className="mt-2 text-lg text-gray-600">Track and manage project milestones and significant checkpoints</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="ready_for_confirmation">Ready for Confirmation</option>
              <option value="confirmed">Confirmed</option>
              <option value="achieved">Achieved</option>
            </select>
            <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="standalone">Standalone</option>
              <option value="linked">Linked to Tasks</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <span className="mr-2">⭐</span>
            Create Milestone
          </button>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMilestones.map(milestone => {
            const status = getMilestoneStatus(milestone)
            const completionPercentage = getCompletionPercentage(milestone)
            
            return (
              <div key={milestone.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {milestone.isAchieved ? '🏆' : '⭐'}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${milestone.priority === 'critical' ? 'bg-red-100 text-red-800' : milestone.priority === 'high' ? 'bg-orange-100 text-orange-800' : milestone.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {milestone.priority}
                      </span>
                    </div>
                  </div>
                  <span className={`status-badge ${status === 'achieved' ? 'status-completed' : status === 'confirmed' ? 'bg-blue-100 text-blue-800' : status === 'ready_for_confirmation' ? 'bg-green-100 text-green-800' : status === 'in_progress' ? 'status-progress' : 'status-todo'}`}>
                    {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

              <div className="milestone-body">
                <div className="milestone-meta">
                  <div className="meta-item">
                    <span className="meta-label">Type:</span>
                    <span className="meta-value">{milestone.type}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Assignee:</span>
                    <span className="meta-value">{milestone.assignee}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Due Date:</span>
                    <span className="meta-value">{milestone.dueDate}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Visibility:</span>
                    <span className="meta-value">{milestone.visibility}</span>
                  </div>
                </div>

                {milestone.description && (
                  <div className="milestone-description">
                    <p>{milestone.description}</p>
                  </div>
                )}

                {milestone.collaborators.length > 0 && (
                  <div className="collaborators-section">
                    <span className="meta-label">Collaborators:</span>
                    <div className="collaborator-list">
                      {milestone.collaborators.map((collaborator, index) => (
                        <span key={index} className="collaborator-badge">
                          {collaborator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {milestone.type === 'linked' && (
                  <div className="linked-tasks">
                    <h4>Linked Tasks ({milestone.linkedTasks.length})</h4>
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{completionPercentage}% Complete</span>
                    </div>
                    <div className="task-list">
                      {milestone.linkedTasks.map(task => (
                        <div key={task.id} className="linked-task">
                          <span className={`task-status ${task.status}`}>
                            {task.status === 'completed' ? '✅' : 
                             task.status === 'in-progress' ? '🔄' : '⏳'}
                          </span>
                          <span className="task-title">{task.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {status === 'ready_for_confirmation' && (
                  <div className="milestone-alert">
                    <span className="alert-icon">🎯</span>
                    <span>All dependencies complete! Ready for confirmation.</span>
                  </div>
                )}
              </div>

              <div className="milestone-actions">
                <button 
                  className="btn-action"
                  onClick={() => setSelectedMilestone(milestone)}
                >
                  View Details
                </button>
                {canConfirmMilestone(milestone) && (
                  <button 
                    className="btn-primary"
                    onClick={() => confirmMilestone(milestone.id)}
                  >
                    Confirm Milestone
                  </button>
                )}
                {canMarkAchieved(milestone) && (
                  <button 
                    className="btn-success"
                    onClick={() => markMilestoneAchieved(milestone.id)}
                  >
                    🏆 Mark Achieved
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filteredMilestones.length === 0 && (
          <div className="empty-milestones">
            <div className="empty-content">
              <span className="empty-icon">⭐</span>
              <h3>No milestones found</h3>
              <p>Create your first milestone to track important project checkpoints.</p>
              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                ⭐ Create First Milestone
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedMilestone && (
        <MilestoneDetail 
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onConfirm={confirmMilestone}
          onMarkAchieved={markMilestoneAchieved}
          canConfirm={canConfirmMilestone(selectedMilestone)}
          canMarkAchieved={canMarkAchieved(selectedMilestone)}
        />
      )}

      {showCreateModal && (
        <CreateMilestoneModal
          availableTasks={availableTasks}
          onSubmit={handleCreateMilestone}
          onClose={() => setShowCreateModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

function CreateMilestoneModal({ availableTasks, onSubmit, onClose, currentUser }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'standalone',
    linkedTasks: [],
    dueDate: '',
    assignee: currentUser.name,
    assigneeId: currentUser.id,
    description: '',
    visibility: 'private',
    priority: 'medium',
    collaborators: []
  })

  const [errors, setErrors] = useState({})
  const [availableCollaborators] = useState([
    'John Smith', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis', 'Security Team'
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleLinkedTasksChange = (taskId) => {
    const task = availableTasks.find(t => t.id === parseInt(taskId))
    const updatedTasks = formData.linkedTasks.some(t => t.id === parseInt(taskId))
      ? formData.linkedTasks.filter(t => t.id !== parseInt(taskId))
      : [...formData.linkedTasks, task]
    
    setFormData({ ...formData, linkedTasks: updatedTasks })
  }

  const handleCollaboratorToggle = (collaborator) => {
    const updatedCollaborators = formData.collaborators.includes(collaborator)
      ? formData.collaborators.filter(c => c !== collaborator)
      : [...formData.collaborators, collaborator]
    
    setFormData({ ...formData, collaborators: updatedCollaborators })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task name is required'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }
    
    if (!formData.assignee) {
      newErrors.assignee = 'Assignee is required'
    }
    
    if (formData.type === 'linked' && formData.linkedTasks.length === 0) {
      newErrors.linkedTasks = 'At least one task must be selected for linked milestones'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container large-modal">
        <div className="modal-header">
          <h2>⭐ Create Milestone Task</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Task Name *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter milestone name"
                className={errors.title ? 'error' : ''}
                maxLength={100}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="type">Milestone Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="standalone">Standalone</option>
                <option value="linked">Linked to Tasks</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={errors.dueDate ? 'error' : ''}
              />
              {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="assignee">Assigned To *</label>
              <select
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className={errors.assignee ? 'error' : ''}
              >
                <option value="John Smith">John Smith</option>
                <option value="Sarah Wilson">Sarah Wilson</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Emily Davis">Emily Davis</option>
              </select>
              {errors.assignee && <span className="error-message">{errors.assignee}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="visibility">Visibility</label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>

          {formData.type === 'linked' && (
            <div className="form-group full-width">
              <label>Link to Tasks *</label>
              <div className="task-selection">
                {availableTasks.map(task => (
                  <label key={task.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.linkedTasks.some(t => t.id === task.id)}
                      onChange={() => handleLinkedTasksChange(task.id)}
                    />
                    <span className="checkmark"></span>
                    <span className="task-info">
                      <span className="task-title">{task.title}</span>
                      <span className={`task-status ${task.status}`}>
                        {task.status === 'completed' ? '✅' : 
                         task.status === 'in-progress' ? '🔄' : '⏳'}
                        {task.status.replace('-', ' ')}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.linkedTasks && <span className="error-message">{errors.linkedTasks}</span>}
            </div>
          )}

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the milestone criteria, purpose, and background..."
              rows="4"
            />
          </div>

          <div className="form-group full-width">
            <label>Collaborators</label>
            <div className="collaborator-selection">
              {availableCollaborators.map(collaborator => (
                <label key={collaborator} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.collaborators.includes(collaborator)}
                    onChange={() => handleCollaboratorToggle(collaborator)}
                  />
                  <span className="checkmark"></span>
                  {collaborator}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              ⭐ Create Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MilestoneDetail({ milestone, onClose, onConfirm, onMarkAchieved, canConfirm, canMarkAchieved }) {
  const status = milestone.isAchieved ? 'achieved' :
                milestone.confirmed ? 'confirmed' :
                milestone.type === 'standalone' ? milestone.status :
                milestone.linkedTasks.every(task => task.status === 'completed') ? 'ready_for_confirmation' : 'in_progress'

  return (
    <div className="milestone-detail-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <span className="milestone-icon">
              {milestone.isAchieved ? '🏆' : '⭐'}
            </span>
            {milestone.title}
          </h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="milestone-info">
            <div className="info-grid">
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge ${status}`}>
                  {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="info-item">
                <label>Type:</label>
                <span>{milestone.type}</span>
              </div>
              <div className="info-item">
                <label>Priority:</label>
                <span className={`priority-badge ${milestone.priority}`}>
                  {milestone.priority}
                </span>
              </div>
              <div className="info-item">
                <label>Assignee:</label>
                <span>{milestone.assignee}</span>
              </div>
              <div className="info-item">
                <label>Due Date:</label>
                <span>{milestone.dueDate}</span>
              </div>
              <div className="info-item">
                <label>Visibility:</label>
                <span>{milestone.visibility}</span>
              </div>
            </div>

            {milestone.description && (
              <div className="description-section">
                <h4>Description</h4>
                <p>{milestone.description}</p>
              </div>
            )}

            {milestone.collaborators.length > 0 && (
              <div className="collaborators-section">
                <h4>Collaborators</h4>
                <div className="collaborator-list">
                  {milestone.collaborators.map((collaborator, index) => (
                    <span key={index} className="collaborator-badge">
                      {collaborator}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {milestone.type === 'linked' && (
            <div className="dependencies-section">
              <h3>Task Dependencies</h3>
              <div className="dependency-list">
                {milestone.linkedTasks.map(task => (
                  <div key={task.id} className="dependency-item">
                    <span className={`dependency-status ${task.status}`}>
                      {task.status === 'completed' ? '✅' : 
                       task.status === 'in-progress' ? '🔄' : '⏳'}
                    </span>
                    <span className="dependency-title">{task.title}</span>
                    <span className={`status-badge ${task.status}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="milestone-timeline">
            <div className="timeline-item">
              <strong>Created:</strong> {milestone.createdAt} by {milestone.createdBy}
            </div>
            {milestone.confirmed && (
              <div className="timeline-item">
                <strong>Confirmed:</strong> Ready for achievement marking
              </div>
            )}
            {milestone.isAchieved && (
              <div className="timeline-item achieved">
                <strong>🏆 Achieved:</strong> {new Date(milestone.achievedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          {canConfirm && (
            <button 
              className="btn-primary"
              onClick={() => {
                onConfirm(milestone.id)
                onClose()
              }}
            >
              Confirm Milestone
            </button>
          )}
          {canMarkAchieved && (
            <button 
              className="btn-success"
              onClick={() => {
                onMarkAchieved(milestone.id)
                onClose()
              }}
            >
              🏆 Mark Achieved
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
