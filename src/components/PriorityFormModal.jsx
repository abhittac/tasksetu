
import React, { useState } from 'react'

function PriorityFormModal({ priority, onSubmit, onClose, existingPriorities, systemPriorities, isEdit = false }) {
  const [formData, setFormData] = useState({
    code: priority?.code || '',
    label: priority?.label || '',
    color: priority?.color || '#28a745',
    systemMapping: priority?.systemMapping || '',
    defaultDueDays: priority?.defaultDueDays || 14,
    weight: priority?.weight || 1,
    escalationRules: priority?.escalationRules || {
      autoEscalateAfterDays: null,
      escalateTo: null
    }
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleEscalationChange = (field, value) => {
    setFormData({
      ...formData,
      escalationRules: {
        ...formData.escalationRules,
        [field]: value === '' ? null : value
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const higherPriorities = existingPriorities.filter(p => 
    p.weight > formData.weight && p.active && p.id !== priority?.id
  )

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="form-group">
            <label htmlFor="code">Priority Code*</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              disabled={isEdit}
              className="form-input"
              placeholder="e.g., HIGH_PRIORITY"
            />
            <small className="form-hint">
              Unique identifier for this priority (cannot be changed after creation)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="label">Display Label*</label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., High Priority"
            />
            <small className="form-hint">
              User-friendly name displayed in the interface
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="color">Priority Color</label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 rounded-2xl border-2 border-gray-200 pointer-events-none"></div>
              </div>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="form-input flex-1"
                placeholder="#28a745"
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: formData.color }}
              ></div>
            </div>
            <small className="form-hint">
              Choose a color that represents this priority level visually
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
              className="form-select"
            >
              <option value="">Select system priority...</option>
              {systemPriorities.map(sysPriority => (
                <option key={sysPriority.code} value={sysPriority.code}>
                  {sysPriority.label} ({sysPriority.code})
                </option>
              ))}
            </select>
            <small className="form-hint">
              Map this custom priority to a system priority for internal processing
            </small>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="defaultDueDays">Default Due Days*</label>
              <input
                type="number"
                id="defaultDueDays"
                name="defaultDueDays"
                value={formData.defaultDueDays}
                onChange={handleChange}
                required
                min="1"
                max="365"
                className="form-input"
                placeholder="14"
              />
              <small className="form-hint">
                Number of days from creation to due date for this priority
              </small>
            </div>

            <div className="form-field">
              <label htmlFor="weight">Priority Weight*</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                min="1"
                max="10"
                className="form-input"
                placeholder="1"
              />
              <small className="form-hint">
                Weight for sorting (1=lowest, 10=highest)
              </small>
            </div>
          </div>

          <div className="form-group">
            <label>Auto-Escalation Rules</label>
            <div className="escalation-fields space-y-4">
              <div className="form-field">
                <label htmlFor="autoEscalateAfterDays">Auto-escalate after (days)</label>
                <input
                  type="number"
                  id="autoEscalateAfterDays"
                  value={formData.escalationRules.autoEscalateAfterDays || ''}
                  onChange={(e) => handleEscalationChange('autoEscalateAfterDays', e.target.value)}
                  min="1"
                  max="365"
                  className="form-input"
                  placeholder="Leave empty to disable"
                />
                <small className="form-hint">
                  Automatically escalate tasks after this many days overdue
                </small>
              </div>

              <div className="form-field">
                <label htmlFor="escalateTo">Escalate to priority</label>
                <select
                  id="escalateTo"
                  value={formData.escalationRules.escalateTo || ''}
                  onChange={(e) => handleEscalationChange('escalateTo', e.target.value)}
                  className="form-select"
                  disabled={!formData.escalationRules.autoEscalateAfterDays}
                >
                  <option value="">Select target priority...</option>
                  {higherPriorities.map(higherPriority => (
                    <option key={higherPriority.code} value={higherPriority.code}>
                      {higherPriority.label}
                    </option>
                  ))}
                </select>
                <small className="form-hint">
                  Target priority level for escalation
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Priority' : 'Create Priority'}
          </button>
        </div>
      </form>
    </>
  )
}

export default PriorityFormModal
