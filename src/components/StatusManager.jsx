import React, { useState } from 'react'

// Helper functions moved outside component
const getTaskCount = (statusCode) => {
  const mockCounts = {
    'OPEN': 142,
    'INPROGRESS': 87,
    'ONHOLD': 23,
    'DONE': 452,
    'CANCELLED': 18
  }
  return mockCounts[statusCode] || 0
}

const getSystemStatusLabel = (systemCode, systemStatuses) => {
  const systemStatus = systemStatuses.find(s => s.code === systemCode)
  return systemStatus ? systemStatus.label : systemCode
}

export default function StatusManager() {
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'admin' })

  // System-defined statuses (Core Layer - cannot be deleted)
  const [systemStatuses] = useState([
    {
      id: 'SYS_NOT_STARTED',
      code: 'SYS_NOT_STARTED',
      label: 'Not Started',
      description: 'System status for tasks not yet started',
      color: '#6c757d',
      isFinal: false,
      isSystem: true
    },
    {
      id: 'SYS_IN_PROGRESS',
      code: 'SYS_IN_PROGRESS',
      label: 'In Progress',
      description: 'System status for active tasks',
      color: '#3498db',
      isFinal: false,
      isSystem: true
    },
    {
      id: 'SYS_ON_HOLD',
      code: 'SYS_ON_HOLD',
      label: 'On Hold',
      description: 'System status for paused tasks',
      color: '#f39c12',
      isFinal: false,
      isSystem: true
    },
    {
      id: 'SYS_COMPLETED',
      code: 'SYS_COMPLETED',
      label: 'Completed',
      description: 'System status for finished tasks',
      color: '#28a745',
      isFinal: true,
      isSystem: true
    },
    {
      id: 'SYS_CANCELLED',
      code: 'SYS_CANCELLED',
      label: 'Cancelled',
      description: 'System status for terminated tasks',
      color: '#dc3545',
      isFinal: true,
      isSystem: true
    }
  ])

  // Company-defined statuses (Custom Layer)
  const [companyStatuses, setCompanyStatuses] = useState([
    {
      id: 1,
      code: 'OPEN',
      label: 'Open',
      description: 'Task is created but not yet started',
      color: '#6c757d',
      isFinal: false,
      isDefault: true,
      active: true,
      order: 1,
      systemMapping: 'SYS_NOT_STARTED',
      allowedTransitions: ['INPROGRESS', 'ONHOLD', 'CANCELLED'],
      isSystem: false
    },
    {
      id: 2,
      code: 'INPROGRESS',
      label: 'In Progress',
      description: 'Task is being worked on',
      color: '#3498db',
      isFinal: false,
      isDefault: false,
      active: true,
      order: 2,
      systemMapping: 'SYS_IN_PROGRESS',
      allowedTransitions: ['ONHOLD', 'DONE', 'CANCELLED'],
      isSystem: false
    },
    {
      id: 3,
      code: 'ONHOLD',
      label: 'On Hold',
      description: 'Task is paused',
      color: '#f39c12',
      isFinal: false,
      isDefault: false,
      active: true,
      order: 3,
      systemMapping: 'SYS_ON_HOLD',
      allowedTransitions: ['INPROGRESS', 'CANCELLED'],
      isSystem: false
    },
    {
      id: 4,
      code: 'DONE',
      label: 'Completed',
      description: 'Task has been completed',
      color: '#28a745',
      isFinal: true,
      isDefault: false,
      active: true,
      order: 4,
      systemMapping: 'SYS_COMPLETED',
      allowedTransitions: [],
      isSystem: false
    },
    {
      id: 5,
      code: 'CANCELLED',
      label: 'Cancelled',
      description: 'Task was terminated intentionally',
      color: '#dc3545',
      isFinal: true,
      isDefault: false,
      active: true,
      order: 5,
      systemMapping: 'SYS_CANCELLED',
      allowedTransitions: [],
      isSystem: false
    }
  ])

  const [showSystemStatuses, setShowSystemStatuses] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStatus, setEditingStatus] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [statusChangeModal, setStatusChangeModal] = useState(null)

  const handleAddStatus = (statusData) => {
    const newStatus = {
      id: Date.now(),
      ...statusData,
      active: true,
      order: companyStatuses.length + 1,
      isSystem: false
    }
    setCompanyStatuses([...companyStatuses, newStatus])
    setShowAddForm(false)
  }

  const handleUpdateStatus = (updatedStatus) => {
    setCompanyStatuses(companyStatuses.map(status => 
      status.id === updatedStatus.id ? updatedStatus : status
    ))
    setEditingStatus(null)
  }

  const handleDeleteStatus = (statusId, mappingStatusId) => {
    const statusToDelete = companyStatuses.find(s => s.id === statusId)
    const mappingStatus = companyStatuses.find(s => s.id === mappingStatusId)

    // Mark status as inactive and create mapping entry
    setCompanyStatuses(companyStatuses.map(status => 
      status.id === statusId ? { 
        ...status, 
        active: false,
        retiredAt: new Date().toISOString(),
        mappedTo: mappingStatusId
      } : status
    ))

    // Log the status change for audit trail
    console.log('Status deleted and mapped:', {
      deletedStatus: statusToDelete.label,
      mappedTo: mappingStatus.label,
      timestamp: new Date().toISOString(),
      affectedTasks: getTaskCount(statusToDelete.code)
    })

    setDeleteModal(null)
  }

  const handleSetDefault = (statusId) => {
    setCompanyStatuses(companyStatuses.map(status => ({
      ...status,
      isDefault: status.id === statusId
    })))
  }

  const handleReorderStatuses = (reorderedStatuses) => {
    const updatedStatuses = reorderedStatuses.map((status, index) => ({
      ...status,
      order: index + 1
    }))
    setCompanyStatuses(updatedStatuses)
  }

  const getValidTransitions = (currentStatusCode, taskData = null) => {
    const currentStatus = companyStatuses.find(s => s.code === currentStatusCode)
    if (!currentStatus) return []

    let validTransitions = currentStatus.allowedTransitions

    // Apply sub-task completion logic
    if (taskData && taskData.subtasks && taskData.subtasks.length > 0) {
      const hasIncompleteSubtasks = taskData.subtasks.some(subtask => 
        subtask.status !== 'DONE' && subtask.status !== 'CANCELLED'
      )

      // Prevent parent task from being marked as completed if sub-tasks are incomplete
      if (hasIncompleteSubtasks) {
        validTransitions = validTransitions.filter(transition => transition !== 'DONE')
      }
    }

    return validTransitions
  }

  const canEditTaskStatus = (task, currentUser) => {
    // Edit permissions: Only task assignee, collaborators, or admins
    return (
      task.assigneeId === currentUser.id ||
      task.collaborators?.includes(currentUser.id) ||
      currentUser.role === 'admin'
    )
  }

  const validateBulkStatusChange = (selectedTasks, newStatusCode, currentUser) => {
    const errors = []

    selectedTasks.forEach(task => {
      // Check edit permissions
      if (!canEditTaskStatus(task, currentUser)) {
        errors.push(`No permission to edit task: ${task.title}`)
        return
      }

      // Check valid transitions
      const validTransitions = getValidTransitions(task.status, task)
      if (!validTransitions.includes(newStatusCode)) {
        errors.push(`Invalid status transition for task: ${task.title}`)
        return
      }

      // Check sub-task completion logic
      if (newStatusCode === 'DONE' && task.subtasks?.length > 0) {
        const incompleteSubtasks = task.subtasks.filter(st => 
          st.status !== 'DONE' && st.status !== 'CANCELLED'
        )
        if (incompleteSubtasks.length > 0) {
          errors.push(`Task "${task.title}" has ${incompleteSubtasks.length} incomplete sub-tasks`)
        }
      }
    })

    return errors
  }

  const getSystemStatusLabelMain = (systemCode) => {
    const systemStatus = systemStatuses.find(s => s.code === systemCode)
    return systemStatus ? systemStatus.label : systemCode
  }

  const activeStatuses = showSystemStatuses 
    ? [...companyStatuses.filter(s => s.active), ...systemStatuses]
    : companyStatuses.filter(s => s.active)

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Status Configuration</h1>
          <p className="mt-2 text-lg text-gray-600">Configure custom task statuses for your organization</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Custom Status
            </button>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showSystemStatuses}
                onChange={(e) => setShowSystemStatuses(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show System Statuses</span>
            </label>
          </div>
          <div className="text-sm text-gray-500">
            Company Statuses: {companyStatuses.filter(s => s.active).length} | 
            System Statuses: {systemStatuses.length}
          </div>
        </div>

        <div className="status-workflow-diagram">
          <h3>Company Status Workflow</h3>
          <div className="workflow-visualization">
            {companyStatuses.filter(s => s.active).sort((a, b) => a.order - b.order).map(status => (
              <div key={status.id} className="workflow-node">
                <div 
                  className="status-node company-status"
                  style={{ backgroundColor: status.color }}
                >
                  <span className="status-label">{status.label}</span>
                  {status.isDefault && <span className="default-indicator">DEFAULT</span>}
                  <span className="system-mapping">
                    → {getSystemStatusLabelMain(status.systemMapping)}
                  </span>
                </div>
                {status.allowedTransitions.length > 0 && (
                  <div className="transitions">
                    {status.allowedTransitions.map(transitionCode => {
                      const targetStatus = companyStatuses.find(s => s.code === transitionCode)
                      return targetStatus ? (
                        <div key={transitionCode} className="transition-arrow">
                          → {targetStatus.label}
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="status-sections">
          <div className="status-list company-statuses">
            <div className="section-header">
              <h3>Company Statuses</h3>
              <p>Custom statuses configured for your organization</p>
            </div>
            <div className="status-table">
              <div className="table-header">
                <div className="th">Order</div>
                <div className="th">Status</div>
                <div className="th">Code</div>
                <div className="th">System Mapping</div>
                <div className="th">Type</div>
                <div className="th">Tasks Using</div>
                <div className="th">Actions</div>
              </div>

              {companyStatuses.filter(s => s.active).sort((a, b) => a.order - b.order).map(status => (
                <CompanyStatusRow
                  key={status.id}
                  status={status}
                  systemStatuses={systemStatuses}
                  onEdit={() => setEditingStatus(status)}
                  onDelete={() => setDeleteModal(status)}
                  onSetDefault={() => handleSetDefault(status.id)}
                  canEdit={currentUser.role === 'admin'}
                />
              ))}
            </div>
          </div>

          {showSystemStatuses && (
            <div className="status-list system-statuses">
              <div className="section-header">
                <h3>System Statuses (Read-Only)</h3>
                <p>Core statuses used for internal logic and analytics</p>
              </div>
              <div className="status-table">
                <div className="table-header">
                  <div className="th">Status</div>
                  <div className="th">Code</div>
                  <div className="th">Description</div>
                  <div className="th">Type</div>
                </div>

                {systemStatuses.map(status => (
                  <SystemStatusRow
                    key={status.id}
                    status={status}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {showAddForm && (
          <StatusFormModal
            onSubmit={handleAddStatus}
            onClose={() => setShowAddForm(false)}
            existingStatuses={companyStatuses}
            systemStatuses={systemStatuses}
          />
        )}

        {editingStatus && (
          <StatusFormModal
            status={editingStatus}
            onSubmit={handleUpdateStatus}
            onClose={() => setEditingStatus(null)}
            existingStatuses={companyStatuses}
            systemStatuses={systemStatuses}
            isEdit={true}
          />
        )}

        {deleteModal && (
          <DeleteStatusModal
            status={deleteModal}
            statuses={companyStatuses.filter(s => s.active && s.id !== deleteModal.id)}
            onConfirm={handleDeleteStatus}
            onClose={() => setDeleteModal(null)}
          />
        )}
      </div>
    </div>
  )
}

function CompanyStatusRow({ status, systemStatuses, onEdit, onDelete, onSetDefault, canEdit }) {
  const taskCount = getTaskCount(status.code)

  return (
    <div className="table-row">
      <div className="td">
        <div className="drag-handle">⋮⋮</div>
        <span className="order-number">{status.order}</span>
      </div>
      <div className="td">
        <div className="status-display">
          <span 
            className="status-color-indicator"
            style={{ backgroundColor: status.color }}
          ></span>
          <span className="status-name">{status.label}</span>
          {status.isDefault && (
            <span className="badge badge-primary">DEFAULT</span>
          )}
        </div>
      </div>
      <div className="td">
        <code className="status-code">{status.code}</code>
      </div>
      <div className="td">
        <div className="system-mapping-display">
          <span className="system-status-label">
            {getSystemStatusLabel(status.systemMapping, systemStatuses)}
          </span>
          <code className="system-status-code">({status.systemMapping})</code>
        </div>
      </div>
      <div className="td">
        <span className={`status-type ${status.isFinal ? 'final' : 'active'}`}>
          {status.isFinal ? 'Final' : 'Active'}
        </span>
      </div>
      <div className="td">
        <div className="task-count-display">
          <span className="task-count-number">{taskCount}</span>
          <span className="task-count-label">tasks</span>
        </div>
      </div>
      <div className="td">
        <div className="action-buttons">
          {canEdit && (
            <>
              <button className="btn-action" onClick={onEdit}>
                Edit
              </button>
              {!status.isDefault && (
                <button className="btn-action" onClick={onSetDefault}>
                  Set Default
                </button>
              )}
              <button 
                className="btn-action danger" 
                onClick={onDelete}
                disabled={taskCount > 0}
                title={taskCount > 0 ? `Cannot delete: ${taskCount} tasks using this status` : 'Delete status'}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SystemStatusRow({ status }) {
  return (
    <div className="table-row system-row">
      <div className="td">
        <div className="status-display">
          <span 
            className="status-color-indicator"
            style={{ backgroundColor: status.color }}
          ></span>
          <span className="status-name">{status.label}</span>
          <span className="badge badge-secondary">SYSTEM</span>
        </div>
      </div>
      <div className="td">
        <code className="status-code">{status.code}</code>
      </div>
      <div className="td">
        <span className="status-description">{status.description}</span>
      </div>
      <div className="td">
        <span className={`status-type ${status.isFinal ? 'final' : 'active'}`}>
          {status.isFinal ? 'Final' : 'Active'}
        </span>
      </div>
    </div>
  )
}

function StatusFormModal({ status, onSubmit, onClose, existingStatuses, systemStatuses, isEdit = false }) {
  const [formData, setFormData] = useState({
    code: status?.code || '',
    label: status?.label || '',
    description: status?.description || '',
    color: status?.color || '#3498db',
    isFinal: status?.isFinal || false,
    systemMapping: status?.systemMapping || systemStatuses[0]?.code || '',
    allowedTransitions: status?.allowedTransitions || []
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const handleTransitionToggle = (statusCode) => {
    const transitions = formData.allowedTransitions
    const updatedTransitions = transitions.includes(statusCode)
      ? transitions.filter(code => code !== statusCode)
      : [...transitions, statusCode]

    setFormData({
      ...formData,
      allowedTransitions: updatedTransitions
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.code.trim()) {
      newErrors.code = 'Status code is required'
    } else if (!/^[A-Z_]+$/.test(formData.code)) {
      newErrors.code = 'Status code must contain only uppercase letters and underscores'
    } else if (!isEdit && existingStatuses.some(s => s.code === formData.code)) {
      newErrors.code = 'Status code already exists'
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Status label is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Status description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(isEdit ? { ...status, ...formData } : formData)
    }
  }

  const availableTransitions = existingStatuses.filter(s => 
    s.active && s.code !== formData.code
  )

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Status' : 'Add New Status'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="code">Status Code*</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., TESTING, REVIEW"
                className={errors.code ? 'error' : ''}
                disabled={isEdit}
              />
              {errors.code && <span className="error-text">{errors.code}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="label">Display Label*</label>
              <input
                type="text"
                id="label"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g., Testing, Under Review"
                className={errors.label ? 'error' : ''}
              />
              {errors.label && <span className="error-text">{errors.label}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="color">Status Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={handleChange}
                  name="color"
                  className="color-hex"
                  placeholder="#3498db"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="systemMapping">System Mapping*</label>
              <select
                id="systemMapping"
                name="systemMapping"
                value={formData.systemMapping}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select system status...</option>
                {systemStatuses.map(sysStatus => (
                  <option key={sysStatus.code} value={sysStatus.code}>
                    {sysStatus.label} ({sysStatus.code})
                  </option>
                ))}
              </select>
              <small className="form-hint">
                Map this custom status to a system status for internal processing
              </small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isFinal"
                  checked={formData.isFinal}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Final Status (No further transitions allowed)
              </label>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe when this status should be used..."
              rows="3"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {!formData.isFinal && (
            <div className="form-group full-width">
              <label>Allowed Transitions</label>
              <p className="form-hint">Select which statuses this status can transition to:</p>
              <div className="transitions-grid">
                {availableTransitions.map(transitionStatus => (
                  <label key={transitionStatus.code} className="transition-option">
                    <input
                      type="checkbox"
                      checked={formData.allowedTransitions.includes(transitionStatus.code)}
                      onChange={() => handleTransitionToggle(transitionStatus.code)}
                    />
                    <span className="transition-label">
                      <span 
                        className="transition-color"
                        style={{ backgroundColor: transitionStatus.color }}
                      ></span>
                      {transitionStatus.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? 'Update Status' : 'Create Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteStatusModal({ status, statuses, onConfirm, onClose }) {
  const [mappingStatusId, setMappingStatusId] = useState('')

  const handleConfirm = () => {
    if (mappingStatusId) {
      onConfirm(status.id, mappingStatusId)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Delete Status: {status.label}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="warning-message">
            <span className="warning-icon">⚠️</span>
            <p>
              This action will permanently delete the "{status.label}" status. 
              All tasks currently using this status must be mapped to another status.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="mappingStatus">
              Map existing tasks to status:*
            </label>
            <select
              id="mappingStatus"
              value={mappingStatusId}
              onChange={(e) => setMappingStatusId(e.target.value)}
              required
            >
              <option value="">Select a status...</option>
              {statuses.map(mappingStatus => (
                <option key={mappingStatus.id} value={mappingStatus.id}>
                  {mappingStatus.label}
                </option>
              ))}
            </select>
            <small className="form-hint">
              All tasks with "{status.label}" status will be changed to the selected status.
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="btn-danger"
              onClick={handleConfirm}
              disabled={!mappingStatusId}
            >
              Delete Status
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}