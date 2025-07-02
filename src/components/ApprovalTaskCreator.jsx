
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden modal-animate-slide-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create Approval Task</h2>
                <p className="text-blue-100 text-sm">Set up a workflow approval process</p>
              </div>
            </div>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white text-xl font-bold"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-8 space-y-8">
            {/* Task Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Task Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="e.g., Budget Approval Q1 2024"
                required
                maxLength={100}
              />
            </div>

            {/* Approval Task Toggle */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <label className="flex items-center space-x-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isApprovalTask"
                    checked={formData.isApprovalTask}
                    onChange={handleChange}
                    required
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    formData.isApprovalTask 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 group-hover:border-green-400'
                  }`}>
                    {formData.isApprovalTask && <span className="text-sm font-bold">✓</span>}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-lg">This is an Approval Task</div>
                  <div className="text-green-700 text-sm">Enable approval workflow with designated approvers</div>
                </div>
              </label>
            </div>

            {formData.isApprovalTask && (
              <div className="space-y-8">
                {/* Approvers & Approval Mode */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Approvers <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="approvers"
                      multiple
                      value={formData.approverIds}
                      onChange={handleApproverChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                      required
                      size="4"
                    >
                      {availableApprovers.map(approver => (
                        <option key={approver.id} value={approver.id} className="py-2">
                          {approver.name} ({approver.role})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple approvers</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Approval Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="approvalMode"
                      value={formData.approvalMode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                      required
                    >
                      <option value="any">Any One Approver</option>
                      <option value="all">All Must Approve</option>
                      <option value="sequential">Sequential Approval</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      {formData.approvalMode === 'any' && 'Any single approver can approve/reject'}
                      {formData.approvalMode === 'all' && 'All approvers must approve'}
                      {formData.approvalMode === 'sequential' && 'Approvers act in order'}
                    </p>
                  </div>
                </div>

                {/* Due Date & Priority */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🟠 High Priority</option>
                      <option value="critical">🔴 Critical Priority</option>
                    </select>
                  </div>
                </div>

                {/* Auto-Approval Settings */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <label className="flex items-center space-x-4 cursor-pointer group mb-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="autoApproveEnabled"
                        checked={formData.autoApproveEnabled}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        formData.autoApproveEnabled 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {formData.autoApproveEnabled && <span className="text-sm font-bold">✓</span>}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Enable Auto-Approval</div>
                      <div className="text-blue-700 text-sm">Automatically approve if no response within deadline</div>
                    </div>
                  </label>
                  
                  {formData.autoApproveEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Auto-Approve After (days)</label>
                        <input
                          type="number"
                          name="autoApproveAfter"
                          value={formData.autoApproveAfter}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          min="1"
                          max="30"
                          placeholder="e.g., 3"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Visibility</label>
                        <select
                          name="visibility"
                          value={formData.visibility}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="private">🔒 Private</option>
                          <option value="public">🌐 Public</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">Description / Justification</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none"
                    placeholder="Provide background, criteria, or justification for this approval..."
                    rows="4"
                    maxLength={1000}
                  />
                  <div className="text-right text-xs text-gray-400">
                    {formData.description.length}/1000 characters
                  </div>
                </div>

                {/* File Attachments */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-800">Attachments</label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📎</span>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Drag & drop files here or 
                          <label className="text-blue-600 hover:text-blue-700 cursor-pointer ml-1 underline">
                            browse
                            <input
                              type="file"
                              multiple
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="sr-only"
                            />
                          </label>
                        </p>
                        <p className="text-sm text-gray-500">Support for images, documents, and PDFs up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Attached Files ({formData.attachments.length})</h4>
                      <div className="space-y-2">
                        {formData.attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📄</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                              onClick={() => removeAttachment(attachment.id)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button 
              type="button" 
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create Approval Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
