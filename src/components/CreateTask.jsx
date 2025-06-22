
import React, { useState } from 'react'

export default function CreateTask() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignee: '',
    dueDate: '',
    category: '',
    tags: '',
    isRecurring: false,
    isApprovalTask: false,
    approvalMode: 'any',
    approvers: [],
    autoApproveAfter: '',
    recurrence: {
      frequency: 'daily',
      repeatEvery: 1,
      repeatOnDays: [],
      startDate: '',
      endConditionType: 'never',
      endValue: '',
      time: '09:00'
    }
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'isRecurring') {
      setFormData({
        ...formData,
        [name]: checked
      })
    } else if (name.startsWith('recurrence.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        recurrence: {
          ...formData.recurrence,
          [field]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }
  }

  const handleDayToggle = (day) => {
    const days = formData.recurrence.repeatOnDays
    const updatedDays = days.includes(day) 
      ? days.filter(d => d !== day)
      : [...days, day]
    
    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
        repeatOnDays: updatedDays
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Task created:', formData)
    // Add task creation logic here
  }

  return (
    <div className="create-task">
      <div className="page-header">
        <h1>Create New Task</h1>
        <p>Add a new task to your project</p>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Design">Design</option>
              <option value="Documentation">Documentation</option>
              <option value="Security">Security</option>
              <option value="Testing">Testing</option>
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
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignee">Assignee</label>
            <input
              type="text"
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Assign to team member"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task details..."
            rows="4"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., urgent, frontend, api"
          />
        </div>

        {/* Recurring Task Section */}
        <div className="form-group full-width">
          <div className="recurring-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Make this a recurring task
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <div className="approval-task-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isApprovalTask"
                checked={formData.isApprovalTask}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Make this an approval task
            </label>
          </div>
        </div>

        {formData.isApprovalTask && (
          <div className="approval-options">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="approvalMode">Approval Mode</label>
                <select
                  id="approvalMode"
                  name="approvalMode"
                  value={formData.approvalMode}
                  onChange={handleChange}
                >
                  <option value="any">Any One Approver</option>
                  <option value="all">All Must Approve</option>
                  <option value="sequential">Sequential Approval</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="autoApproveAfter">Auto-Approve After (days)</label>
                <input
                  type="number"
                  id="autoApproveAfter"
                  name="autoApproveAfter"
                  value={formData.autoApproveAfter}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="approvers">Select Approvers</label>
              <select
                id="approvers"
                name="approvers"
                value={formData.approvers}
                onChange={handleChange}
                multiple
                className="multi-select"
                required={formData.isApprovalTask}
              >
                <option value="john-smith">John Smith (Manager)</option>
                <option value="sarah-wilson">Sarah Wilson (Director)</option>
                <option value="mike-johnson">Mike Johnson (CFO)</option>
                <option value="emily-davis">Emily Davis (Admin)</option>
              </select>
              <small className="help-text">Hold Ctrl/Cmd to select multiple approvers</small>
            </div>
          </div>
        )}

        {formData.isRecurring && (
          <div className="recurring-options">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="frequency">Frequency</label>
                <select
                  id="frequency"
                  name="recurrence.frequency"
                  value={formData.recurrence.frequency}
                  onChange={handleChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="repeatEvery">Repeat Every</label>
                <div className="repeat-every-group">
                  <input
                    type="number"
                    id="repeatEvery"
                    name="recurrence.repeatEvery"
                    value={formData.recurrence.repeatEvery}
                    onChange={handleChange}
                    min="1"
                    max="365"
                  />
                  <span className="repeat-unit">
                    {formData.recurrence.frequency === 'daily' ? 'day(s)' :
                     formData.recurrence.frequency === 'weekly' ? 'week(s)' :
                     formData.recurrence.frequency === 'monthly' ? 'month(s)' : 'year(s)'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="recurrence.startDate"
                  value={formData.recurrence.startDate}
                  onChange={handleChange}
                  required={formData.isRecurring}
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="recurrence.time"
                  value={formData.recurrence.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            {formData.recurrence.frequency === 'weekly' && (
              <div className="form-group full-width">
                <label>Repeat On Days</label>
                <div className="days-selector">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`day-button ${formData.recurrence.repeatOnDays.includes(day) ? 'selected' : ''}`}
                      onClick={() => handleDayToggle(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="endCondition">End Condition</label>
                <select
                  id="endCondition"
                  name="recurrence.endConditionType"
                  value={formData.recurrence.endConditionType}
                  onChange={handleChange}
                >
                  <option value="never">Never</option>
                  <option value="after">After number of occurrences</option>
                  <option value="on">On specific date</option>
                </select>
              </div>

              {formData.recurrence.endConditionType !== 'never' && (
                <div className="form-group">
                  <label htmlFor="endValue">
                    {formData.recurrence.endConditionType === 'after' ? 'Number of Occurrences' : 'End Date'}
                  </label>
                  <input
                    type={formData.recurrence.endConditionType === 'after' ? 'number' : 'date'}
                    id="endValue"
                    name="recurrence.endValue"
                    value={formData.recurrence.endValue}
                    onChange={handleChange}
                    min={formData.recurrence.endConditionType === 'after' ? '1' : undefined}
                    placeholder={formData.recurrence.endConditionType === 'after' ? 'e.g., 10' : ''}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">
            {formData.isRecurring ? 'Create Recurring Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}
