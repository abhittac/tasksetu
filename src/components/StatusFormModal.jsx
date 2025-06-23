
import React, { useState } from 'react'

function StatusFormModal({ status, onSubmit, onClose, existingStatuses, systemStatuses, isEdit = false }) {
  const [formData, setFormData] = useState({
    code: status?.code || '',
    label: status?.label || '',
    color: status?.color || '#3B82F6',
    systemMapping: status?.systemMapping || '',
    isFinal: status?.isFinal || false,
    allowedTransitions: status?.allowedTransitions || []
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="form-group">
            <label htmlFor="code">Status Code*</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              disabled={isEdit}
              className="form-input"
              placeholder="e.g., IN_PROGRESS"
            />
            <small className="form-hint">
              Unique identifier for this status (cannot be changed after creation)
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
              placeholder="e.g., In Progress"
            />
            <small className="form-hint">
              User-friendly name displayed in the interface
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="color">Status Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-10 rounded border border-gray-300"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="form-input flex-1"
                placeholder="#3B82F6"
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

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Status' : 'Create Status'}
          </button>
        </div>
      </form>
    </>
  )
}

export default StatusFormModal
