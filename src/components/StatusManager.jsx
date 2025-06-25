import React, { useState } from 'react'
import StatusFormModal from './StatusFormModal'

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
  const [showFormDrawer, setShowFormDrawer] = useState(false)
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
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Company Status Configuration
          </h1>
          <p className="mt-3 text-xl text-gray-600">Configure custom task statuses for your organization</p>
          <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <button 
              className="btn btn-primary relative overflow-hidden group"
              onClick={() => setShowAddForm(true)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="status-form-modal-overlay">
            <div className="status-form-modal">
              <h2>Create New Status</h2>
              <StatusFormModal
                onSubmit={handleAddStatus}
                onClose={() => setShowAddForm(false)}
                existingStatuses={companyStatuses}
                systemStatuses={systemStatuses}
              />
            </div>
          </div>
        )}

        {editingStatus && (
          <div className="status-form-modal-overlay">
            <div className="status-form-modal">
              <h2>Edit Status</h2>
              <StatusFormModal
                status={editingStatus}
                onSubmit={handleUpdateStatus}
                onClose={() => setEditingStatus(null)}
                existingStatuses={companyStatuses}
                systemStatuses={systemStatuses}
                isEdit={true}
              />
            </div>
          </div>
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

      {/* Slide-in Drawer */}
      {showFormDrawer && (
        <div className={`task-drawer ${showFormDrawer ? 'open' : ''}`}>
          <div className="drawer-overlay" onClick={() => setShowFormDrawer(false)}></div>
          <div className="drawer-content">
            <div className="drawer-header">
              <h2 className="text-2xl font-bold text-gray-900">Create New Status</h2>
              <button 
                onClick={() => setShowFormDrawer(false)}
                className="close-btn"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="drawer-body">
              <StatusFormModal 
                editingStatus={editingStatus}
                onClose={() => setShowFormDrawer(false)}
                onSave={handleAddStatus}
                existingStatuses={companyStatuses}
                systemStatuses={systemStatuses}
              />
            </div>
          </div>
        </div>
      )}
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