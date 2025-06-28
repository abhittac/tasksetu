import React, { useState } from 'react'

// Helper function moved outside component
const getSystemPriorityLabel = (systemCode, systemPriorities) => {
  const systemPriority = systemPriorities.find(p => p.code === systemCode)
  return systemPriority ? systemPriority.label : systemCode
}

// Calculate due date based on priority
export const calculateDueDateFromPriority = (priority, creationDate = new Date()) => {
  const date = new Date(creationDate)
  const prioritySettings = JSON.parse(localStorage.getItem('prioritySettings') || '{}')
  
  // Default days mapping
  const defaultDays = {
    'LOW': 30,
    'MEDIUM': 14,
    'HIGH': 7,
    'CRITICAL': 2,
    'URGENT': 2
  }
  
  const daysToAdd = prioritySettings[priority?.toUpperCase()] || defaultDays[priority?.toUpperCase()] || 7
  date.setDate(date.getDate() + daysToAdd)
  
  return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
}

function CompanyPriorityRow({ priority, systemPriorities, onEdit, onDelete, onSetDefault, canEdit }) {
  // Guard against undefined priority
  if (!priority) {
    return null
  }

  const getTaskCount = (priorityCode) => {
    const mockCounts = {
      'LOW': 45,
      'MEDIUM': 78,
      'HIGH': 23,
      'URGENT': 12,
      'CRITICAL': 5
    }
    return mockCounts[priorityCode] || 0
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900">{priority.name || 'Unnamed Priority'}</td>
      <td className="px-6 py-4">
        <div className="system-mapping-display">
          <span className="system-priority-label text-sm text-gray-600">
            {getSystemPriorityLabel(priority.systemMapping, systemPriorities)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {priority.daysToDue} days
          </span>
          {priority.isDefault && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Default
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onEdit}
            className="btn btn-secondary btn-sm"
            disabled={!canEdit}
          >
            Edit
          </button>
          <button 
            onClick={onDelete}
            className="btn btn-danger btn-sm"
            disabled={!canEdit}
          >
            Delete
          </button>
          <button 
            onClick={onSetDefault}
            className="btn btn-success btn-sm"
            disabled={!canEdit}
          >
            Set Default
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function PriorityManager() {
  const [priorities, setPriorities] = useState([
    { id: 1, name: 'Low Priority', systemMapping: 'LOW', isDefault: false, daysToDue: 30 },
    { id: 2, name: 'Medium Priority', systemMapping: 'MEDIUM', isDefault: true, daysToDue: 14 },
    { id: 3, name: 'High Priority', systemMapping: 'HIGH', isDefault: false, daysToDue: 7 },
    { id: 4, name: 'Critical Priority', systemMapping: 'CRITICAL', isDefault: false, daysToDue: 2 },
    { id: 5, name: 'Urgent Priority', systemMapping: 'URGENT', isDefault: false, daysToDue: 2 }
  ])

  const systemPriorities = [
    { code: 'LOW', label: 'Low' },
    { code: 'MEDIUM', label: 'Medium' },
    { code: 'HIGH', label: 'High' },
    { code: 'CRITICAL', label: 'Critical' },
    { code: 'URGENT', label: 'Urgent' }
  ]

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPriority, setEditingPriority] = useState(null)
  const [formData, setFormData] = useState({ name: '', systemMapping: 'LOW', daysToDue: 7 })

  // Save priority settings to localStorage whenever priorities change
  React.useEffect(() => {
    const settings = {}
    priorities.forEach(priority => {
      settings[priority.systemMapping] = priority.daysToDue
    })
    localStorage.setItem('prioritySettings', JSON.stringify(settings))
  }, [priorities])

  const handleEdit = (priority) => {
    setEditingPriority(priority)
    setFormData({ name: priority.name, systemMapping: priority.systemMapping, daysToDue: priority.daysToDue })
    setShowAddForm(true)
  }

  const handleDelete = (priority) => {
    if (window.confirm(`Are you sure you want to delete "${priority.name}"?`)) {
      setPriorities(priorities.filter(p => p.id !== priority.id))
    }
  }

  const handleSetDefault = (priority) => {
    setPriorities(priorities.map(p => ({ ...p, isDefault: p.id === priority.id })))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingPriority) {
      setPriorities(priorities.map(p => 
        p.id === editingPriority.id 
          ? { ...p, name: formData.name, systemMapping: formData.systemMapping, daysToDue: parseInt(formData.daysToDue) }
          : p
      ))
    } else {
      const newPriority = {
        id: Date.now(),
        name: formData.name,
        systemMapping: formData.systemMapping,
        daysToDue: parseInt(formData.daysToDue),
        isDefault: false
      }
      setPriorities([...priorities, newPriority])
    }
    setShowAddForm(false)
    setEditingPriority(null)
    setFormData({ name: '', systemMapping: 'LOW', daysToDue: 7 })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Priority Manager</h1>
          <p className="mt-2 text-lg text-gray-600">Manage task priorities and their system mappings</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary mt-4 lg:mt-0"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Priority
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingPriority ? 'Edit Priority' : 'Add New Priority'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Priority Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Enter priority name..."
                  required
                />
              </div>
              <div>
                <label className="form-label">System Mapping</label>
                <select
                  value={formData.systemMapping}
                  onChange={(e) => setFormData({ ...formData, systemMapping: e.target.value })}
                  className="form-select"
                >
                  {systemPriorities.map(priority => (
                    <option key={priority.code} value={priority.code}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Days to Due Date</label>
                <input
                  type="number"
                  value={formData.daysToDue}
                  onChange={(e) => setFormData({ ...formData, daysToDue: e.target.value })}
                  className="form-input"
                  placeholder="7"
                  min="1"
                  max="365"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Auto-assign due date after this many days</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingPriority(null)
                  setFormData({ name: '', systemMapping: 'LOW', daysToDue: 7 })
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingPriority ? 'Update Priority' : 'Add Priority'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System Mapping
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days to Due
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priorities.filter(priority => priority && priority.id).map((priority) => (
                <CompanyPriorityRow
                  key={priority.id}
                  priority={priority}
                  systemPriorities={systemPriorities}
                  onEdit={() => handleEdit(priority)}
                  onDelete={() => handleDelete(priority)}
                  onSetDefault={() => handleSetDefault(priority)}
                  canEdit={true}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Helper functions moved outside component
const getTaskCount = (priorityCode) => {
  const mockCounts = {
    'LOW': 89,
    'MEDIUM': 156,
    'HIGH': 67,
    'CRITICAL': 23,
    'URGENT': 8
  }
  return mockCounts[priorityCode] || 0
}

const getSystemPriorityLabel = (systemCode, systemPriorities) => {
  const systemPriority = systemPriorities.find(p => p.code === systemCode)
  return systemPriority ? systemPriority.label : systemCode
}

export default function PriorityManager() {
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'admin' })

  // System-defined priorities (Core Layer - cannot be deleted)
  const [systemPriorities] = useState([
    {
      id: 'SYS_LOW',
      code: 'SYS_LOW',
      label: 'Low',
      description: 'Low priority tasks - flexible timeline',
      color: '#28a745',
      weight: 1,
      defaultDueDays: 30,
      isSystem: true
    },
    {
      id: 'SYS_MEDIUM',
      code: 'SYS_MEDIUM',
      label: 'Medium',
      description: 'Medium priority tasks - standard timeline',
      color: '#ffc107',
      weight: 2,
      defaultDueDays: 14,
      isSystem: true
    },
    {
      id: 'SYS_HIGH',
      code: 'SYS_HIGH',
      label: 'High',
      description: 'High priority tasks - expedited timeline',
      color: '#fd7e14',
      weight: 3,
      defaultDueDays: 7,
      isSystem: true
    },
    {
      id: 'SYS_CRITICAL',
      code: 'SYS_CRITICAL',
      label: 'Critical',
      description: 'Critical priority tasks - urgent attention required',
      color: '#dc3545',
      weight: 4,
      defaultDueDays: 3,
      isSystem: true
    },
    {
      id: 'SYS_URGENT',
      code: 'SYS_URGENT',
      label: 'Urgent',
      description: 'Urgent priority tasks - immediate action required',
      color: '#6f42c1',
      weight: 5,
      defaultDueDays: 1,
      isSystem: true
    }
  ])

  // Company-defined priorities (Custom Layer) - Default Priority Flow
  const [companyPriorities, setCompanyPriorities] = useState([
    {
      id: 1,
      code: 'LOW',
      label: 'Low',
      description: 'Low priority tasks with flexible timeline',
      color: '#28a745',
      weight: 1,
      defaultDueDays: 30,
      isDefault: true,
      active: true,
      order: 1,
      systemMapping: 'SYS_LOW',
      escalationRules: {
        autoEscalateAfterDays: null,
        escalateTo: null
      },
      isSystem: false
    },
    {
      id: 2,
      code: 'MEDIUM',
      label: 'Medium',
      description: 'Standard priority tasks',
      color: '#ffc107',
      weight: 2,
      defaultDueDays: 14,
      isDefault: false,
      active: true,
      order: 2,
      systemMapping: 'SYS_MEDIUM',
      escalationRules: {
        autoEscalateAfterDays: 21,
        escalateTo: 'HIGH'
      },
      isSystem: false
    },
    {
      id: 3,
      code: 'HIGH',
      label: 'High',
      description: 'High priority tasks requiring expedited attention',
      color: '#fd7e14',
      weight: 3,
      defaultDueDays: 7,
      isDefault: false,
      active: true,
      order: 3,
      systemMapping: 'SYS_HIGH',
      escalationRules: {
        autoEscalateAfterDays: 10,
        escalateTo: 'CRITICAL'
      },
      isSystem: false
    },
    {
      id: 4,
      code: 'CRITICAL',
      label: 'Critical',
      description: 'Critical priority tasks requiring urgent attention',
      color: '#dc3545',
      weight: 4,
      defaultDueDays: 3,
      isDefault: false,
      active: true,
      order: 4,
      systemMapping: 'SYS_CRITICAL',
      escalationRules: {
        autoEscalateAfterDays: 5,
        escalateTo: 'URGENT'
      },
      isSystem: false
    },
    {
      id: 5,
      code: 'URGENT',
      label: 'Urgent',
      description: 'Urgent priority tasks requiring immediate action',
      color: '#6f42c1',
      weight: 5,
      defaultDueDays: 1,
      isDefault: false,
      active: true,
      order: 5,
      systemMapping: 'SYS_URGENT',
      escalationRules: {
        autoEscalateAfterDays: null,
        escalateTo: null
      },
      isSystem: false
    }
  ])

  const [showSystemPriorities, setShowSystemPriorities] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFormDrawer, setShowFormDrawer] = useState(false)
  const [editingPriority, setEditingPriority] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)

  const handleAddPriority = (priorityData) => {
    const newPriority = {
      id: Date.now(),
      ...priorityData,
      active: true,
      order: companyPriorities.length + 1,
      isSystem: false
    }
    setCompanyPriorities([...companyPriorities, newPriority])
    setShowAddForm(false)
  }

  const handleUpdatePriority = (updatedPriority) => {
    setCompanyPriorities(companyPriorities.map(priority => 
      priority.id === updatedPriority.id ? updatedPriority : priority
    ))
    setEditingPriority(null)
  }

  const handleDeletePriority = (priorityId, mappingPriorityId) => {
    const priorityToDelete = companyPriorities.find(p => p.id === priorityId)
    const mappingPriority = companyPriorities.find(p => p.id === mappingPriorityId)

    // Mark priority as inactive and create mapping entry
    setCompanyPriorities(companyPriorities.map(priority => 
      priority.id === priorityId ? { 
        ...priority, 
        active: false,
        retiredAt: new Date().toISOString(),
        mappedTo: mappingPriorityId
      } : priority
    ))

    // Log the priority change for audit trail
    console.log('Priority deleted and mapped:', {
      deletedPriority: priorityToDelete.label,
      mappedTo: mappingPriority.label,
      timestamp: new Date().toISOString(),
      affectedTasks: getTaskCount(priorityToDelete.code)
    })

    setDeleteModal(null)
  }

  const handleSetDefault = (priorityId) => {
    setCompanyPriorities(companyPriorities.map(priority => ({
      ...priority,
      isDefault: priority.id === priorityId
    })))
  }

  const handleReorderPriorities = (reorderedPriorities) => {
    const updatedPriorities = reorderedPriorities.map((priority, index) => ({
      ...priority,
      order: index + 1,
      weight: index + 1 // Weight follows order
    }))
    setCompanyPriorities(updatedPriorities)
  }

  const calculateDueDate = (priorityCode) => {
    const priority = companyPriorities.find(p => p.code === priorityCode)
    if (!priority) return null

    const today = new Date()
    const dueDate = new Date(today.getTime() + (priority.defaultDueDays * 24 * 60 * 60 * 1000))
    return dueDate.toISOString().split('T')[0]
  }

  const getEscalationInfo = (priorityCode) => {
    const priority = companyPriorities.find(p => p.code === priorityCode)
    if (!priority || !priority.escalationRules.autoEscalateAfterDays) return null

    return {
      days: priority.escalationRules.autoEscalateAfterDays,
      targetPriority: priority.escalationRules.escalateTo
    }
  }

  const validateBulkPriorityChange = (selectedTasks, newPriorityCode, currentUser) => {
    const errors = []
    const newPriority = companyPriorities.find(p => p.code === newPriorityCode)

    selectedTasks.forEach(task => {
      // Check edit permissions
      if (!canEditTaskPriority(task, currentUser)) {
        errors.push(`No permission to edit task: ${task.title}`)
        return
      }

      // Check priority escalation logic
      const currentPriority = companyPriorities.find(p => p.code === task.priority)
      if (currentPriority && newPriority) {
        if (newPriority.weight < currentPriority.weight) {
          // Downgrading priority might require approval
          if (currentPriority.weight >= 4) { // Critical or Urgent
            errors.push(`Downgrading from ${currentPriority.label} requires manager approval: ${task.title}`)
          }
        }
      }
    })

    return errors
  }

  const canEditTaskPriority = (task, currentUser) => {
    // Edit permissions: Only task assignee, collaborators, or admins
    return (
      task.assigneeId === currentUser.id ||
      task.collaborators?.includes(currentUser.id) ||
      currentUser.role === 'admin'
    )
  }

  const getSystemPriorityLabelMain = (systemCode) => {
    const systemPriority = systemPriorities.find(p => p.code === systemCode)
    return systemPriority ? systemPriority.label : systemCode
  }

  const activePriorities = showSystemPriorities 
    ? [...companyPriorities.filter(p => p.active), ...systemPriorities]
    : companyPriorities.filter(p => p.active)

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Company Priority Configuration
          </h1>
          <p className="mt-3 text-xl text-gray-600">Configure custom task priorities for your organization</p>
          <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
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
              Add Custom Priority
            </button>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showSystemPriorities}
                onChange={(e) => setShowSystemPriorities(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show System Priorities</span>
            </label>
          </div>
          <div className="text-sm text-gray-500">
            Company Priorities: {companyPriorities.filter(p => p.active).length} | 
            System Priorities: {systemPriorities.length}
          </div>
        </div>

        <div className="priority-workflow-diagram">
          <h3>Company Priority Workflow</h3>
          <div className="workflow-visualization">
            {companyPriorities.filter(p => p.active).sort((a, b) => a.order - b.order).map(priority => (
              <div key={priority.id} className="workflow-node">
                <div 
                  className="priority-node company-priority"
                  style={{ backgroundColor: priority.color }}
                >
                  <span className="priority-label">{priority.label}</span>
                  {priority.isDefault && <span className="default-indicator">DEFAULT</span>}
                  <span className="system-mapping">
                    → {getSystemPriorityLabelMain(priority.systemMapping)}
                  </span>
                  <span className="due-days">
                    {priority.defaultDueDays} days
                  </span>
                </div>
                {priority.escalationRules.autoEscalateAfterDays && (
                  <div className="escalation-info">
                    <span className="escalation-text">
                      Auto-escalate to {priority.escalationRules.escalateTo} after {priority.escalationRules.autoEscalateAfterDays} days
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="priority-sections">
          <div className="priority-list company-priorities">
            <div className="section-header">
              <h3>Company Priorities</h3>
              <p>Custom priorities configured for your organization</p>
            </div>
            <div className="priority-table">
              <div className="table-header">
                <div className="th">Order</div>
                <div className="th">Priority</div>
                <div className="th">Code</div>
                <div className="th">System Mapping</div>
                <div className="th">Due Days</div>
                <div className="th">Escalation</div>
                <div className="th">Tasks Using</div>
                <div className="th">Actions</div>
              </div>

              {companyPriorities.filter(p => p.active).sort((a, b) => a.order - b.order).map(priority => (
                <CompanyPriorityRow
                  key={priority.id}
                  priority={priority}
                  systemPriorities={systemPriorities}
                  onEdit={() => setEditingPriority(priority)}
                  onDelete={() => setDeleteModal(priority)}
                  onSetDefault={() => handleSetDefault(priority.id)}
                  canEdit={currentUser.role === 'admin'}
                />
              ))}
            </div>
          </div>

          {showSystemPriorities && (
            <div className="priority-list system-priorities">
              <div className="section-header">
                <h3>System Priorities (Read-Only)</h3>
                <p>Core priorities used for internal logic and analytics</p>
              </div>
              <div className="priority-table">
                <div className="table-header">
                  <div className="th">Priority</div>
                  <div className="th">Code</div>
                  <div className="th">Description</div>
                  <div className="th">Weight</div>
                  <div className="th">Default Due Days</div>
                </div>

                {systemPriorities.map(priority => (
                  <SystemPriorityRow
                    key={priority.id}
                    priority={priority}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {showAddForm && (
          <div className="priority-form-modal-overlay">
            <div className="priority-form-modal">
              <h2>Create New Priority</h2>
              <PriorityFormModal
                onSubmit={handleAddPriority}
                onClose={() => setShowAddForm(false)}
                existingPriorities={companyPriorities}
                systemPriorities={systemPriorities}
              />
            </div>
          </div>
        )}

        {editingPriority && (
          <div className="priority-form-modal-overlay">
            <div className="priority-form-modal">
              <h2>Edit Priority</h2>
              <PriorityFormModal
                priority={editingPriority}
                onSubmit={handleUpdatePriority}
                onClose={() => setEditingPriority(null)}
                existingPriorities={companyPriorities}
                systemPriorities={systemPriorities}
                isEdit={true}
              />
            </div>
          </div>
        )}

        {deleteModal && (
          <DeletePriorityModal
            priority={deleteModal}
            priorities={companyPriorities.filter(p => p.active && p.id !== deleteModal.id)}
            onConfirm={handleDeletePriority}
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
              <h2 className="text-2xl font-bold text-gray-900">Create New Priority</h2>
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
              <PriorityFormModal 
                editingPriority={editingPriority}
                onClose={() => setShowFormDrawer(false)}
                onSave={handleAddPriority}
                existingPriorities={companyPriorities}
                systemPriorities={systemPriorities}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompanyPriorityRow({ priority, systemPriorities, onEdit, onDelete, onSetDefault, canEdit }) {
  const taskCount = getTaskCount(priority.code)

  return (
    <div className="table-row">
      <div className="td">
        <div className="drag-handle">⋮⋮</div>
        <span className="order-number">{priority.order}</span>
      </div>
      <div className="td">
        <div className="priority-display">
          <span 
            className="priority-color-indicator"
            style={{ backgroundColor: priority.color }}
          ></span>
          <span className="priority-name">{priority.label}</span>
          {priority.isDefault && (
            <span className="badge badge-primary">DEFAULT</span>
          )}
        </div>
      </div>
      <div className="td">
        <code className="priority-code">{priority.code}</code>
      </div>
      <div className="td">
        <div className="system-mapping-display">
          <span className="system-priority-label">
            {getSystemPriorityLabel(priority.systemMapping, systemPriorities)}
          </span>
          <code className="system-priority-code">({priority.systemMapping})</code>
        </div>
      </div>
      <div className="td">
        <span className="due-days-display">{priority.defaultDueDays} days</span>
      </div>
      <div className="td">
        <div className="escalation-display">
          {priority.escalationRules.autoEscalateAfterDays ? (
            <span className="escalation-text">
              {priority.escalationRules.autoEscalateAfterDays}d → {priority.escalationRules.escalateTo}
            </span>
          ) : (
            <span className="no-escalation">None</span>
          )}
        </div>
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
              {!priority.isDefault && (
                <button className="btn-action" onClick={onSetDefault}>
                  Set Default
                </button>
              )}
              <button 
                className="btn-action danger" 
                onClick={onDelete}
                disabled={taskCount > 0}
                title={taskCount > 0 ? `Cannot delete: ${taskCount} tasks using this priority` : 'Delete priority'}
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

function SystemPriorityRow({ priority }) {
  return (
    <div className="table-row system-row">
      <div className="td">
        <div className="priority-display">
          <span 
            className="priority-color-indicator"
            style={{ backgroundColor: priority.color }}
          ></span>
          <span className="priority-name">{priority.label}</span>
          <span className="badge badge-secondary">SYSTEM</span>
        </div>
      </div>
      <div className="td">
        <code className="priority-code">{priority.code}</code>
      </div>
      <div className="td">
        <span className="priority-description">{priority.description}</span>
      </div>
      <div className="td">
        <span className="priority-weight">{priority.weight}</span>
      </div>
      <div className="td">
        <span className="due-days-display">{priority.defaultDueDays} days</span>
      </div>
    </div>
  )
}

function DeletePriorityModal({ priority, priorities, onConfirm, onClose }) {
  const [mappingPriorityId, setMappingPriorityId] = useState('')

  const handleConfirm = () => {
    if (mappingPriorityId) {
      onConfirm(priority.id, mappingPriorityId)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Delete Priority: {priority.label}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="warning-message">
            <span className="warning-icon">⚠️</span>
            <p>
              This action will permanently delete the "{priority.label}" priority. 
              All tasks currently using this priority must be mapped to another priority.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="mappingPriority">
              Map existing tasks to priority:*
            </label>
            <select
              id="mappingPriority"
              value={mappingPriorityId}
              onChange={(e) => setMappingPriorityId(e.target.value)}
              required
            >
              <option value="">Select a priority...</option>
              {priorities.map(mappingPriority => (
                <option key={mappingPriority.id} value={mappingPriority.id}>
                  {mappingPriority.label}
                </option>
              ))}
            </select>
            <small className="form-hint">
              All tasks with "{priority.label}" priority will be changed to the selected priority.
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
              disabled={!mappingPriorityId}
            >
              Delete Priority
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
