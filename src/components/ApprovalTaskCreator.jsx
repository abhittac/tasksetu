
import React, { useState, useEffect } from 'react'

export default function ApprovalTaskCreator({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    isApprovalTask: false,
    approver: 'Current User',
    approverIds: [],
    approvalMode: 'any',
    dueDate: '',
    autoApproveAfter: '',
    autoApproveEnabled: false,
    description: '',
    attachments: [],
    collaborators: [],
    visibility: 'private',
    priority: 'medium'
  })

  const [dragActive, setDragActive] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  const availableApprovers = [
    { id: 1, name: 'Current User', role: 'manager' },
    { id: 2, name: 'John Smith', role: 'team_lead' },
    { id: 3, name: 'Sarah Wilson', role: 'director' },
    { id: 4, name: 'Mike Johnson', role: 'cfo' },
    { id: 5, name: 'Emily Davis', role: 'admin' },
    { id: 6, name: 'Alex Turner', role: 'legal' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleApproverChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value))
    setFormData({
      ...formData,
      approverIds: selectedIds
    })
  }

  const handleFileUpload = (files) => {
    const newAttachments = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...newAttachments]
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const removeAttachment = (attachmentId) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter(att => att.id !== attachmentId)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Task name is required')
      return
    }

    if (!formData.isApprovalTask) {
      alert('Please toggle "Approval Task" to create an approval task')
      return
    }

    if (formData.approverIds.length === 0) {
      alert('Please select at least one approver')
      return
    }

    if (!formData.dueDate) {
      alert('Due date is required')
      return
    }

    const approvalTask = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      status: 'pending',
      approvers: formData.approverIds.map(id => {
        const approver = availableApprovers.find(a => a.id === id)
        return {
          ...approver,
          status: 'pending',
          comment: null,
          approvedAt: null
        }
      })
    }

    onSubmit(approvalTask)
  }

  return (
    <div className="modal-overlay-blur">
      <div className="modal-container approval-task-creator">
        <div className="modal-header">
          <h2>Create Approval Task</h2>
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
                placeholder="e.g., Budget Approval Q1 2024"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group full-width">
              <label className="checkbox-label approval-toggle">
                <input
                  type="checkbox"
                  name="isApprovalTask"
                  checked={formData.isApprovalTask}
                  onChange={handleChange}
                  required
                />
                <span className="checkmark"></span>
                <strong>This is an Approval Task</strong>
                <span className="toggle-help">✓ Enable approval workflow</span>
              </label>
            </div>

            {formData.isApprovalTask && (
              <>
                <div className="form-group">
                  <label htmlFor="approvers">Approvers *</label>
                  <select
                    id="approvers"
                    name="approvers"
                    multiple
                    value={formData.approverIds}
                    onChange={handleApproverChange}
                    className="multi-select"
                    required
                    size="4"
                  >
                    {availableApprovers.map(approver => (
                      <option key={approver.id} value={approver.id}>
                        {approver.name} ({approver.role})
                      </option>
                    ))}
                  </select>
                  <small className="form-help">Hold Ctrl/Cmd to select multiple approvers</small>
                </div>

                <div className="form-group">
                  <label htmlFor="approvalMode">Approval Mode *</label>
                  <select
                    id="approvalMode"
                    name="approvalMode"
                    value={formData.approvalMode}
                    onChange={handleChange}
                    required
                  >
                    <option value="any">Any One</option>
                    <option value="all">All Must Approve</option>
                    <option value="sequential">Sequential</option>
                  </select>
                  <small className="form-help">
                    {formData.approvalMode === 'any' && 'Any single approver can approve/reject'}
                    {formData.approvalMode === 'all' && 'All approvers must approve'}
                    {formData.approvalMode === 'sequential' && 'Approvers act in order'}
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date *</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="autoApproveEnabled"
                      checked={formData.autoApproveEnabled}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    Enable Auto-Approval
                  </label>
                  {formData.autoApproveEnabled && (
                    <div className="auto-approve-config">
                      <label htmlFor="autoApproveAfter">Auto-Approve After (days):</label>
                      <input
                        type="number"
                        id="autoApproveAfter"
                        name="autoApproveAfter"
                        value={formData.autoApproveAfter}
                        onChange={handleChange}
                        min="1"
                        max="30"
                        placeholder="e.g., 3"
                      />
                      <small className="form-help">Auto-approve if no response after due date + X days</small>
                    </div>
                  )}
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
              </>
            )}
          </div>

          {formData.isApprovalTask && (
            <>
              <div className="form-group full-width">
                <label htmlFor="description">Description / Justification</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide background, criteria, or justification for this approval..."
                  rows="4"
                  maxLength={1000}
                />
              </div>

              <div className="form-group full-width">
                <label>Attachments</label>
                <div 
                  className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="upload-content">
                    <span className="upload-icon">📎</span>
                    <p>Drag & drop files here or <span className="upload-link">browse</span></p>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="file-input-hidden"
                    />
                  </div>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="attachment-list">
                    {formData.attachments.map(attachment => (
                      <div key={attachment.id} className="attachment-item">
                        <span className="attachment-icon">📄</span>
                        <div className="attachment-info">
                          <span className="attachment-name">{attachment.name}</span>
                          <span className="attachment-size">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-attachment"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Approval Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
