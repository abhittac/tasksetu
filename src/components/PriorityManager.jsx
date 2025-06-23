
import React, { useState } from 'react'

export default function PriorityManager() {
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'admin' })
  
  // System-defined priorities (Core Layer - cannot be deleted)
  const [systemPriorities] = useState([
    {
      id: 'SYS_LOW',
      code: 'SYS_LOW',
      label: 'Low',
      description: 'System priority for low importance tasks',
      color: '#28a745',
      dueDays: 30,
      isSystem: true
    },
    {
      id: 'SYS_MEDIUM',
      code: 'SYS_MEDIUM',
      label: 'Medium',
      description: 'System priority for medium importance tasks',
      color: '#ffc107',
      dueDays: 14,
      isSystem: true
    },
    {
      id: 'SYS_HIGH',
      code: 'SYS_HIGH',
      label: 'High',
      description: 'System priority for high importance tasks',
      color: '#fd7e14',
      dueDays: 7,
      isSystem: true
    },
    {
      id: 'SYS_CRITICAL',
      code: 'SYS_CRITICAL',
      label: 'Critical',
      description: 'System priority for critical tasks',
      color: '#dc3545',
      dueDays: 2,
      isSystem: true
    }
  ])

  // Company-defined priorities (Custom Layer)
  const [companyPriorities, setCompanyPriorities] = useState([
    {
      id: 1,
      code: 'LOW',
      label: 'Low',
      description: 'Low priority tasks',
      color: '#28a745',
      dueDays: 30,
      isDefault: false,
      active: true,
      order: 1,
      systemMapping: 'SYS_LOW',
      isSystem: false
    },
    {
      id: 2,
      code: 'MEDIUM',
      label: 'Medium',
      description: 'Medium priority tasks',
      color: '#ffc107',
      dueDays: 14,
      isDefault: true,
      active: true,
      order: 2,
      systemMapping: 'SYS_MEDIUM',
      isSystem: false
    },
    {
      id: 3,
      code: 'HIGH',
      label: 'High',
      description: 'High priority tasks',
      color: '#fd7e14',
      dueDays: 7,
      isDefault: false,
      active: true,
      order: 3,
      systemMapping: 'SYS_HIGH',
      isSystem: false
    },
    {
      id: 4,
      code: 'CRITICAL',
      label: 'Critical',
      description: 'Critical priority tasks',
      color: '#dc3545',
      dueDays: 2,
      isDefault: false,
      active: true,
      order: 4,
      systemMapping: 'SYS_CRITICAL',
      isSystem: false
    }
  ])

  const [showSystemPriorities, setShowSystemPriorities] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
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
    setCompanyPriorities(companyPriorities.map(priority => 
      priority.id === priorityId ? { ...priority, active: false } : priority
    ))
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
      order: index + 1
    }))
    setCompanyPriorities(updatedPriorities)
  }

  const getSystemPriorityLabel = (systemCode) => {
    const systemPriority = systemPriorities.find(p => p.code === systemCode)
    return systemPriority ? systemPriority.label : systemCode
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Priority Configuration</h1>
          <p className="mt-2 text-lg text-gray-600">Configure custom task priorities and due date automation</p>
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
        <h3>Priority & Due Date Mapping</h3>
        <div className="workflow-visualization">
          {companyPriorities.filter(p => p.active).sort((a, b) => a.order - b.order).map(priority => (
            <div key={priority.id} className="workflow-node">
              <div 
                className="priority-node company-priority"
                style={{ backgroundColor: priority.color }}
              >
                <span className="priority-label">{priority.label}</span>
                {priority.isDefault && <span className="default-indicator">DEFAULT</span>}
                <span className="due-days">Due in {priority.dueDays} days</span>
                <span className="system-mapping">
                  → {getSystemPriorityLabel(priority.systemMapping)}
                </span>
              </div>
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
              <div className="th">Due Days</div>
              <div className="th">System Mapping</div>
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
                <div className="th">Due Days</div>
                <div className="th">Description</div>
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
        <PriorityFormModal
          onSubmit={handleAddPriority}
          onClose={() => setShowAddForm(false)}
          existingPriorities={companyPriorities}
          systemPriorities={systemPriorities}
        />
      )}

      {editingPriority && (
        <PriorityFormModal
          priority={editingPriority}
          onSubmit={handleUpdatePriority}
          onClose={() => setEditingPriority(null)}
          existingPriorities={companyPriorities}
          systemPriorities={systemPriorities}
          isEdit={true}
        />
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
  )
  )
}

function CompanyPriorityRow({ priority, systemPriorities, onEdit, onDelete, onSetDefault, canEdit }) {
  const getSystemPriorityLabel = (systemCode) => {
    const systemPriority = systemPriorities.find(p => p.code === systemCode)
    return systemPriority ? systemPriority.label : systemCode
  }

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
        <span className="due-days-display">{priority.dueDays} days</span>
      </div>
      <div className="td">
        <div className="system-mapping-display">
          <span className="system-priority-label">
            {getSystemPriorityLabel(priority.systemMapping)}
          </span>
          <code className="system-priority-code">({priority.systemMapping})</code>
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
              <button className="btn-action danger" onClick={onDelete}>
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
        <span className="due-days-display">{priority.dueDays} days</span>
      </div>
      <div className="td">
        <span className="priority-description">{priority.description}</span>
      </div>
    </div>
  )
}

function PriorityFormModal({ priority, onSubmit, onClose, existingPriorities, systemPriorities, isEdit = false }) {
  const [formData, setFormData] = useState({
    code: priority?.code || '',
    label: priority?.label || '',
    description: priority?.description || '',
    color: priority?.color || '#ffc107',
    dueDays: priority?.dueDays || 14,
    systemMapping: priority?.systemMapping || systemPriorities[0]?.code || ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    })
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.code.trim()) {
      newErrors.code = 'Priority code is required'
    } else if (!/^[A-Z_]+$/.test(formData.code)) {
      newErrors.code = 'Priority code must contain only uppercase letters and underscores'
    } else if (!isEdit && existingPriorities.some(p => p.code === formData.code)) {
      newErrors.code = 'Priority code already exists'
    }
    
    if (!formData.label.trim()) {
      newErrors.label = 'Priority label is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Priority description is required'
    }

    if (!formData.systemMapping) {
      newErrors.systemMapping = 'System mapping is required'
    }

    if (formData.dueDays < 1 || formData.dueDays > 365) {
      newErrors.dueDays = 'Due days must be between 1 and 365'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(isEdit ? { ...priority, ...formData } : formData)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Priority' : 'Add New Priority'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="code">Priority Code*</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., URGENT, NORMAL"
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
                placeholder="e.g., Urgent, Normal"
                className={errors.label ? 'error' : ''}
              />
              {errors.label && <span className="error-text">{errors.label}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="color">Priority Color</label>
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
                  placeholder="#ffc107"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dueDays">Default Due Days*</label>
              <input
                type="number"
                id="dueDays"
                name="dueDays"
                value={formData.dueDays}
                onChange={handleChange}
                min="1"
                max="365"
                className={errors.dueDays ? 'error' : ''}
              />
              {errors.dueDays && <span className="error-text">{errors.dueDays}</span>}
              <small className="form-hint">
                Number of days from creation to due date
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="systemMapping">System Mapping*</label>
              <select
                id="systemMapping"
                name="systemMapping"
                value={formData.systemMapping}
                onChange={handleChange}
                required
                className={errors.systemMapping ? 'error' : ''}
              >
                <option value="">Select system priority...</option>
                {systemPriorities.map(sysPriority => (
                  <option key={sysPriority.code} value={sysPriority.code}>
                    {sysPriority.label} ({sysPriority.code})
                  </option>
                ))}
              </select>
              {errors.systemMapping && <span className="error-text">{errors.systemMapping}</span>}
              <small className="form-hint">
                Map this custom priority to a system priority for internal processing
              </small>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe when this priority should be used..."
              rows="3"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? 'Update Priority' : 'Create Priority'}
            </button>
          </div>
        </form>
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
