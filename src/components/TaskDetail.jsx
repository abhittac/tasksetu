import React, { useState, useRef } from 'react'
import TaskComments from './TaskComments'
import ActivityFeed from './ActivityFeed'
import TaskAttachments from './TaskAttachments'

function getStatusLabel(statusCode) {
  const statusMap = {
    'OPEN': 'Open',
    'INPROGRESS': 'In Progress', 
    'ONHOLD': 'On Hold',
    'DONE': 'Completed',
    'CANCELLED': 'Cancelled',
    // Legacy support
    'pending': 'Open',
    'in-progress': 'In Progress',
    'completed': 'Completed'
  }
  return statusMap[statusCode] || statusCode
}

export default function TaskDetail({ taskId, onClose }) {
  const [activeTab, setActiveTab] = useState('details')
  const [showSnoozeModal, setShowSnoozeModal] = useState(false)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [showRiskModal, setShowRiskModal] = useState(false)
  const [showCreateSubtaskDrawer, setShowCreateSubtaskDrawer] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'assignee' })

  // Mock task data - in real app this would come from props or API
  const [task, setTask] = useState({
    id: taskId,
    title: "Database Migration",
    description: "Migrate the existing database from MySQL to PostgreSQL while ensuring data integrity and minimal downtime.",
    status: "in-progress",
    priority: "high",
    assignee: "John Smith",
    assigneeId: 1,
    category: "Backend",
    dueDate: "2024-01-25",
    startDate: "2024-01-15",
    timeEstimate: "40 hours",
    tags: ["database", "migration", "backend"],
    createdBy: "Sarah Wilson",
    creatorId: 2,
    createdAt: "2024-01-15 09:00",
    updatedAt: "2024-01-20 14:30",
    snoozedUntil: null,
    snoozeNote: null,
    taskType: "normal", // normal, milestone, approval
    isRisky: false,
    riskNote: "",
    parentTaskId: null,
    subtasks: [
      { id: 101, title: "Backup existing database", status: "completed", assignee: "John Smith", dueDate: "2024-01-20" },
      { id: 102, title: "Set up PostgreSQL instance", status: "completed", assignee: "Mike Johnson", dueDate: "2024-01-22" },
      { id: 103, title: "Create migration scripts", status: "in-progress", assignee: "Sarah Wilson", dueDate: "2024-01-24" },
      { id: 104, title: "Test data integrity", status: "pending", assignee: "Emily Davis", dueDate: "2024-01-26" },
      { id: 105, title: "Update application configs", status: "pending", assignee: "John Smith", dueDate: "2024-01-27" }
    ],
    linkedItems: [
      { id: 1, type: "task", title: "Update Documentation", status: "pending" },
      { id: 2, type: "document", title: "Migration Plan", status: "completed" },
      { id: 3, type: "form", title: "Migration Checklist", status: "in-progress" }
    ],
    milestones: [
      { id: 1, title: "Database Backup Complete", status: "completed", date: "2024-01-20" },
      { id: 2, title: "Migration Scripts Ready", status: "in-progress", date: "2024-01-24" },
      { id: 3, title: "Full Migration Complete", status: "pending", date: "2024-01-28" }
    ],
    isApprovalTask: false,
    approvalStatus: null,
    reminders: [
      { id: 1, type: "due_date", message: "Due in 3 days", date: "2024-01-25" }
    ],
    forms: [
      { id: 1, title: "Migration Checklist", type: "checklist", status: "in-progress" }
    ],
    collaborators: ["Mike Johnson", "Emily Davis"]
  })

  const tabs = [
    { id: 'details', label: 'Core Info', icon: '📋' },
    { id: 'subtasks', label: 'Subtasks', icon: '📝', count: task.subtasks?.length || 0 },
    { id: 'comments', label: 'Comments', icon: '💬' },
    { id: 'activity', label: 'Activity Feed', icon: '📊' },
    { id: 'attachments', label: 'Files & Links', icon: '📎' },
    { id: 'linked', label: 'Linked Items', icon: '🔗', count: task.linkedItems?.length || 0 },
    { id: 'forms', label: 'Forms', icon: '📄', count: task.forms?.length || 0 }
  ]

  const now = new Date()
  const snoozedUntil = task.snoozedUntil ? new Date(task.snoozedUntil) : null
  const isSnoozed = snoozedUntil && snoozedUntil > now

  // Permission checks
  const permissions = {
    canView: true, // All roles can view
    canEdit: task.creatorId === currentUser.id || task.assigneeId === currentUser.id || currentUser.role === 'admin',
    canReassign: task.creatorId === currentUser.id || currentUser.role === 'admin',
    canDelete: task.creatorId === currentUser.id || currentUser.role === 'admin',
    canComment: true, // All roles can comment
    canAddFiles: true, // All roles can add files
    canChangeStatus: task.assigneeId === currentUser.id || task.creatorId === currentUser.id || currentUser.role === 'admin'
  }

  const handleStatusChange = (newStatus) => {
    setTask({ ...task, status: newStatus })
  }

  const handlePriorityChange = (newPriority) => {
    setTask({ ...task, priority: newPriority })
  }

  const handleSnoozeSubmit = (snoozeData) => {
    setTask({
      ...task,
      snoozedUntil: snoozeData.snoozeUntil,
      snoozeNote: snoozeData.note
    })
    setShowSnoozeModal(false)
  }

  const handleUnsnooze = () => {
    setTask({
      ...task,
      snoozedUntil: null,
      snoozeNote: null
    })
  }

  const handleReassign = (newAssignee) => {
    setTask({
      ...task,
      assignee: newAssignee.name,
      assigneeId: newAssignee.id
    })
    setShowReassignModal(false)
  }

  const handleMarkRisk = (riskData) => {
    setTask({
      ...task,
      isRisky: true,
      riskNote: riskData.note
    })
    setShowRiskModal(false)
  }

  const handleMarkDone = () => {
    if (window.confirm('Mark this task as completed?')) {
      setTask({ ...task, status: 'DONE' })
    }
  }

  const handleCreateSubtask = (subtaskData) => {
    const newSubtask = {
      id: Date.now(),
      ...subtaskData,
      parentTaskId: task.id,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString()
    }
    
    const updatedSubtasks = [...(task.subtasks || []), newSubtask]
    setTask({ ...task, subtasks: updatedSubtasks })
    setShowCreateSubtaskDrawer(false)
    
    // Simulate notification to assignee
    console.log(`Notification sent to ${subtaskData.assignee}: New sub-task "${subtaskData.title}" assigned to you`)
  }

  const handleDeleteTask = (deleteOptions) => {
    // Log the deletion
    console.log(`Task "${task.title}" deleted by ${currentUser.name}`, deleteOptions);
    
    // Close the modal and task detail
    setShowDeleteModal(false);
    onClose();
    
    // In a real app, this would update the parent component's task list
    // and send the deletion request to the backend
  }

  const handleExportTask = () => {
    console.log('Exporting task:', task)
  }

  const getTaskTypeIcon = () => {
    switch (task.taskType) {
      case 'milestone': return '🎯'
      case 'approval': return '✅'
      default: return '📋'
    }
  }

  const getTaskTypeLabel = () => {
    switch (task.taskType) {
      case 'milestone': return 'Milestone'
      case 'approval': return 'Approval'
      default: return 'Normal'
    }
  }

  return (
    <div className="task-detail-fullpage">
      {/* Header Bar */}
      <div className="task-header-bar">
        <div className="header-main-content">
          <div className="task-type-indicator">
            <span className="task-type-icon">{getTaskTypeIcon()}</span>
            <span className="task-type-label">{getTaskTypeLabel()}</span>
          </div>

          <EditableTitle 
            title={task.title} 
            onSave={(newTitle) => setTask({...task, title: newTitle})}
            canEdit={permissions.canEdit}
          />

          <div className="header-controls">
            <StatusDropdown
              status={task.status}
              onChange={handleStatusChange}
              canEdit={permissions.canChangeStatus}
              task={task}
              currentUser={currentUser}
            />

            <PriorityDropdown
              priority={task.priority}
              onChange={handlePriorityChange}
              canEdit={permissions.canEdit}
            />

            <AssigneeSelector
              assignee={task.assignee}
              assigneeId={task.assigneeId}
              onChange={(assignee) => setTask({...task, assignee: assignee.name, assigneeId: assignee.id})}
              canEdit={permissions.canEdit}
            />
          </div>

          <div className="header-badges">
            {task.tags.map(tag => (
              <span key={tag} className="tag-badge">#{tag}</span>
            ))}

            {isSnoozed && (
              <span className="status-indicator snoozed" title={`Snoozed until ${snoozedUntil.toLocaleString()}`}>
                😴 Snoozed
              </span>
            )}

            {task.isRisky && (
              <span className="status-indicator risky" title={`At Risk: ${task.riskNote}`}>
                ⚠️ At Risk
              </span>
            )}

            {task.taskType === 'milestone' && (
              <span className="status-indicator milestone">
                🎯 Milestone
              </span>
            )}

            {task.taskType === 'approval' && (
              <span className="status-indicator approval">
                ✅ Approval Required
              </span>
            )}
          </div>
        </div>

        <button className="close-button" onClick={onClose}>×</button>
      </div>

      {/* Quick Actions Bar */}
      <div className="quick-actions-bar">
        <button 
          className="action-btn primary"
          onClick={() => setShowCreateSubtaskDrawer(true)}
          disabled={!permissions.canEdit}
        >
          ➕ Add Sub-task
        </button>

        <button 
          className="action-btn"
          onClick={() => console.log('Edit task')}
          disabled={!permissions.canEdit}
        >
          ✏️ Edit
        </button>

        <button 
          className="action-btn danger"
          onClick={() => setShowDeleteModal(true)}
          disabled={!permissions.canDelete}
        >
          ❌ Delete
        </button>

        <button 
          className="action-btn"
          onClick={() => setShowReassignModal(true)}
          disabled={!permissions.canReassign}
        >
          🔁 Reassign
        </button>

        {isSnoozed ? (
          <button 
            className="action-btn"
            onClick={handleUnsnooze}
            disabled={!permissions.canEdit}
          >
            ⏰ Unsnooze
          </button>
        ) : (
          <button 
            className="action-btn"
            onClick={() => setShowSnoozeModal(true)}
            disabled={!permissions.canEdit}
          >
            ⏸️ Snooze
          </button>
        )}

        <button 
          className="action-btn warning"
          onClick={() => setShowRiskModal(true)}
          disabled={!permissions.canEdit}
        >
          🧠 Mark Risk
        </button>

        <button 
          className="action-btn success"
          onClick={handleMarkDone}
          disabled={!permissions.canChangeStatus || task.status === 'DONE'}
        >
          ✅ Mark Done
        </button>

        <button 
          className="action-btn"
          onClick={handleExportTask}
        >
          📤 Export
        </button>
      </div>

      {/* Main Content Area */}
      <div className="task-content-area">
        {/* Tabs Navigation */}
        <div className="task-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && <span className="tab-count">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'details' && (
            <CoreInfoPanel 
              task={task} 
              onUpdate={setTask}
              permissions={permissions}
            />
          )}

          {activeTab === 'subtasks' && (
            <SubtasksPanel 
              subtasks={task.subtasks} 
              onCreateSubtask={() => setShowCreateSubtaskDrawer(true)}
              parentTask={task}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'comments' && <TaskComments taskId={taskId} />}
          {activeTab === 'activity' && <ActivityFeed taskId={taskId} />}
          {activeTab === 'attachments' && <TaskAttachments taskId={taskId} />}

          {activeTab === 'linked' && (
            <LinkedItemsPanel linkedItems={task.linkedItems} />
          )}

          {activeTab === 'forms' && (
            <FormsPanel forms={task.forms} taskId={taskId} />
          )}
        </div>
      </div>

      {/* Modals */}
      {showSnoozeModal && (
        <SnoozeModal
          task={task}
          onSubmit={handleSnoozeSubmit}
          onClose={() => setShowSnoozeModal(false)}
        />
      )}

      {showReassignModal && (
        <ReassignModal
          task={task}
          onSubmit={handleReassign}
          onClose={() => setShowReassignModal(false)}
        />
      )}

      {showRiskModal && (
        <RiskModal
          task={task}
          onSubmit={handleMarkRisk}
          onClose={() => setShowRiskModal(false)}
        />
      )}

      {showCreateSubtaskDrawer && (
        <SubtaskDrawer
          parentTask={task}
          currentUser={currentUser}
          onSubmit={handleCreateSubtask}
          onClose={() => setShowCreateSubtaskDrawer(false)}
        />
      )}

      {showDeleteModal && (
        <TaskDeleteModal
          task={task}
          onConfirm={handleDeleteTask}
          onClose={() => setShowDeleteModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

// Task Delete Modal Component for TaskDetail
function TaskDeleteModal({ task, onConfirm, onClose, currentUser }) {
  const [deleteOptions, setDeleteOptions] = useState({
    deleteSubtasks: false,
    deleteAttachments: false,
    confirmed: false
  })

  const hasSubtasks = task?.subtasks && task.subtasks.length > 0
  const hasAttachments = task?.attachments && task.attachments.length > 0
  const hasLinkedItems = task?.linkedItems && task.linkedItems.length > 0

  const handleSubmit = () => {
    if (!deleteOptions.confirmed) {
      alert('Please confirm you understand this action is irreversible')
      return
    }
    onConfirm(deleteOptions)
  }

  const getWarningMessages = () => {
    const warnings = []
    
    if (hasSubtasks) {
      warnings.push(`This task has ${task.subtasks.length} subtask(s). Deleting it will ${deleteOptions.deleteSubtasks ? 'delete all subtasks' : 'orphan them'}.`)
    }
    
    if (hasLinkedItems || hasAttachments) {
      warnings.push('All linked forms and files will also be affected.')
    }

    if (task.createdBy !== currentUser.name && task.assigneeId !== currentUser.id) {
      warnings.push('This task was created by another user.')
    }

    return warnings
  }

  const warnings = getWarningMessages()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">🗑️ Delete Task</h3>
          </div>

          <div className="delete-task-info mb-4">
            <h4 className="text-gray-900 mb-2">Are you sure you want to delete this task?</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">"{task?.title}"</div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                task?.status === 'completed' ? 'bg-green-100 text-green-800' :
                task?.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusLabel(task?.status)}
              </span>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="deletion-warnings mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="text-orange-800 font-medium mb-2">⚠️ Important Notice:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="deletion-options mb-6 space-y-3">
            {hasSubtasks && (
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteOptions.deleteSubtasks}
                  onChange={(e) => setDeleteOptions({
                    ...deleteOptions,
                    deleteSubtasks: e.target.checked
                  })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Also delete all {task.subtasks.length} subtask(s)</div>
                  <div className="text-sm text-gray-600">If unchecked, subtasks will become orphaned</div>
                </div>
              </label>
            )}

            {(hasAttachments || hasLinkedItems) && (
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteOptions.deleteAttachments}
                  onChange={(e) => setDeleteOptions({
                    ...deleteOptions,
                    deleteAttachments: e.target.checked
                  })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Also delete attached forms and files</div>
                  <div className="text-sm text-gray-600">This will permanently remove all attachments</div>
                </div>
              </label>
            )}

            <label className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={deleteOptions.confirmed}
                onChange={(e) => setDeleteOptions({
                  ...deleteOptions,
                  confirmed: e.target.checked
                })}
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
                required
              />
              <div>
                <div className="font-medium text-red-900">I understand this action is irreversible</div>
                <div className="text-sm text-red-700">This task will be permanently deleted</div>
              </div>
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleSubmit}
              disabled={!deleteOptions.confirmed}
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CoreInfoPanel({ task, onUpdate, permissions }) {
  return (
    <div className="core-info-panel">
      <div className="info-grid">
        {/* Description */}
        <div className="info-section full-width">
          <h3>Description</h3>
          <EditableTextArea
            value={task.description}
            onSave={(newDesc) => onUpdate({...task, description: newDesc})}
            canEdit={permissions.canEdit}
            placeholder="Add task description..."
          />
        </div>

        {/* Date Information */}
        <div className="info-section">
          <h4>Timeline</h4>
          <div className="info-field">
            <label>Start Date:</label>
            <EditableDateField
              value={task.startDate}
              onSave={(newDate) => onUpdate({...task, startDate: newDate})}
              canEdit={permissions.canEdit}
            />
          </div>
          <div className="info-field">
            <label>Due Date:</label>
            <EditableDateField
              value={task.dueDate}
              onSave={(newDate) => onUpdate({...task, dueDate: newDate})}
              canEdit={permissions.canEdit}
            />
          </div>
          <div className="info-field">
            <label>Time Estimate:</label>
            <EditableTextField
              value={task.timeEstimate}
              onSave={(newEstimate) => onUpdate({...task, timeEstimate: newEstimate})}
              canEdit={permissions.canEdit}
            />
          </div>
        </div>

        {/* Task Relationships */}
        <div className="info-section">
          <h4>Relationships</h4>
          {task.parentTaskId && (
            <div className="info-field">
              <label>Parent Task:</label>
              <span className="linked-task">Task #{task.parentTaskId}</span>
            </div>
          )}
          <div className="info-field">
            <label>Collaborators:</label>
            <div className="collaborators-list">
              {task.collaborators.map(collab => (
                <span key={collab} className="collaborator-badge">{collab}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Creation Info */}
        <div className="info-section">
          <h4>Task Details</h4>
          <div className="info-field">
            <label>Created By:</label>
            <span>{task.createdBy}</span>
          </div>
          <div className="info-field">
            <label>Created:</label>
            <span>{task.createdAt}</span>
          </div>
          <div className="info-field">
            <label>Last Updated:</label>
            <span>{task.updatedAt}</span>
          </div>
        </div>

        {/* Reminders */}
        {task.reminders.length > 0 && (
          <div className="info-section full-width">
            <h4>Active Reminders</h4>
            <div className="reminders-list">
              {task.reminders.map(reminder => (
                <div key={reminder.id} className="reminder-item">
                  <span className="reminder-icon">⏰</span>
                  <span>{reminder.message}</span>
                  <span className="reminder-date">({reminder.date})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestone Information */}
        {task.taskType === 'milestone' && task.milestones.length > 0 && (
          <div className="info-section full-width">
            <h4>Milestone Progress</h4>
            <div className="milestone-list">
              {task.milestones.map(milestone => (
                <div key={milestone.id} className="milestone-item">
                  <span className={`milestone-icon ${milestone.status}`}>
                    {milestone.status === 'completed' ? '✅' : 
                     milestone.status === 'in-progress' ? '🔄' : '⭐'}
                  </span>
                  <div className="milestone-info">
                    <span className="milestone-title">{milestone.title}</span>
                    <span className="milestone-date">{milestone.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approval Information */}
        {task.taskType === 'approval' && (
          <div className="info-section full-width">
            <h4>Approval Status</h4>
            <div className="approval-info">
              <div className="approval-status">
                <span className={`approval-badge ${task.approvalStatus || 'pending'}`}>
                  {task.approvalStatus || 'Pending Approval'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Risk Information */}
        {task.isRisky && (
          <div className="info-section full-width risk-section">
            <h4>⚠️ Risk Information</h4>
            <div className="risk-details">
              <p>{task.riskNote}</p>
            </div>
          </div>
        )}

        {/* Snooze Information */}
        {task.snoozedUntil && (
          <div className="info-section full-width snooze-section">
            <h4>😴 Snooze Information</h4>
            <div className="snooze-details">
              <div className="snooze-field">
                <strong>Snoozed until:</strong> {new Date(task.snoozedUntil).toLocaleString()}
              </div>
              {task.snoozeNote && (
                <div className="snooze-field">
                  <strong>Snooze note:</strong> {task.snoozeNote}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FormsPanel({ forms, taskId }) {
  return (
    <div className="forms-panel">
      <div className="forms-header">
        <h3>Attached Forms ({forms.length})</h3>
        <button className="btn-primary">+ Add Form</button>
      </div>

      <div className="forms-list">
        {forms.map(form => (
          <div key={form.id} className="form-item">
            <div className="form-icon">📄</div>
            <div className="form-info">
              <h4>{form.title}</h4>
              <span className="form-type">{form.type}</span>
              <span className={`form-status ${form.status}`}>{form.status}</span>
            </div>
            <div className="form-actions">
              <button className="btn-action">View</button>
              <button className="btn-action">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {forms.length === 0 && (
        <div className="empty-forms">
          <p>No forms attached to this task.</p>
        </div>
      )}
    </div>
  )
}

function StatusDropdown({ status, onChange, canEdit, task, currentUser }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)

  // Enhanced statuses with comprehensive business rules
  const statuses = [
    { 
      value: 'OPEN', 
      label: 'Open', 
      color: '#6c757d', 
      isFinal: false,
      description: 'Task is created but not yet started',
      tooltip: 'New task ready to be started',
      allowedTransitions: ['INPROGRESS', 'ONHOLD', 'CANCELLED']
    },
    { 
      value: 'INPROGRESS', 
      label: 'In Progress', 
      color: '#3498db', 
      isFinal: false,
      description: 'Task is being actively worked on',
      tooltip: 'Work is currently in progress on this task',
      allowedTransitions: ['ONHOLD', 'DONE', 'CANCELLED']
    },
    { 
      value: 'ONHOLD', 
      label: 'On Hold', 
      color: '#f39c12', 
      isFinal: false,
      description: 'Task is temporarily paused',
      tooltip: 'Task is paused temporarily',
      allowedTransitions: ['INPROGRESS', 'CANCELLED']
    },
    { 
      value: 'DONE', 
      label: 'Completed', 
      color: '#28a745', 
      isFinal: true,
      description: 'Task has been completed successfully',
      tooltip: 'Task has been successfully completed',
      allowedTransitions: []
    },
    { 
      value: 'CANCELLED', 
      label: 'Cancelled', 
      color: '#dc3545', 
      isFinal: true,
      description: 'Task was terminated intentionally',
      tooltip: 'Task was cancelled and will not be completed',
      allowedTransitions: []
    }
  ]

  const currentStatus = statuses.find(s => s.value === status) || statuses[0]

  // Get valid transitions based on business rules
  const getValidTransitions = () => {
    if (!currentStatus) return [];
    
    return currentStatus.allowedTransitions.filter(transitionCode => {
      // Check sub-task completion logic for DONE status
      if (transitionCode === 'DONE' && task?.subtasks && task.subtasks.length > 0) {
        const incompleteSubtasks = task.subtasks.filter(subtask => 
          subtask.status !== 'DONE' && subtask.status !== 'CANCELLED'
        );
        return incompleteSubtasks.length === 0;
      }
      return true;
    });
  };

  const validTransitions = getValidTransitions();

  const canMarkAsCompleted = () => {
    if (!task?.subtasks || task.subtasks.length === 0) return true;
    
    const incompleteSubtasks = task.subtasks.filter(subtask => 
      subtask.status !== 'DONE' && subtask.status !== 'CANCELLED'
    );
    
    return incompleteSubtasks.length === 0;
  };

  const handleStatusClick = (statusOption) => {
    // Validate transition
    if (!validTransitions.includes(statusOption.value)) {
      alert(`Invalid transition from "${currentStatus.label}" to "${statusOption.label}". Please follow the allowed workflow.`);
      return;
    }

    // Check sub-task dependencies for completion
    if (statusOption.value === 'DONE' && !canMarkAsCompleted()) {
      const incompleteCount = task.subtasks.filter(s => s.status !== 'DONE' && s.status !== 'CANCELLED').length;
      alert(`Cannot mark task as completed. There are ${incompleteCount} incomplete sub-tasks that must be completed or cancelled first.`);
      return;
    }

    // Show confirmation for final statuses
    if (statusOption.isFinal && statusOption.value !== status) {
      setShowConfirmation({
        newStatus: statusOption.value,
        newLabel: statusOption.label,
        description: statusOption.description
      });
      setIsOpen(false);
      return;
    }

    // Direct update for non-final statuses
    onChange(statusOption.value);
    setIsOpen(false);
    
    // Log activity with enhanced details
    logActivity('status_changed', {
      oldStatus: getStatusLabel(status),
      newStatus: statusOption.label,
      user: currentUser.name,
      timestamp: new Date().toISOString(),
      taskId: task.id,
      reason: 'Manual status change'
    });
  };

  const confirmStatusChange = () => {
    onChange(showConfirmation.newStatus);
    
    // Log activity with confirmation
    logActivity('status_changed', {
      oldStatus: getStatusLabel(status),
      newStatus: showConfirmation.newLabel,
      user: currentUser.name,
      timestamp: new Date().toISOString(),
      taskId: task.id,
      reason: 'Final status confirmed',
      confirmed: true
    });
    
    setShowConfirmation(null);
  };

  const logActivity = (type, details) => {
    console.log(`🔄 Status Activity:`, details);
    // In real app, this would be sent to backend for permanent audit trail
  };

  if (!canEdit) {
    return (
      <div className="status-display readonly">
        <span 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white cursor-help"
          style={{ backgroundColor: currentStatus.color }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {getStatusLabel(status)}
          <svg className="ml-1 w-3 h-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </span>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10 max-w-xs">
            {currentStatus.tooltip} (Read-only)
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="status-dropdown relative">
        <button 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white hover:opacity-80 transition-opacity"
          style={{ backgroundColor: currentStatus.color }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {getStatusLabel(status)}
          <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Enhanced tooltip */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10 max-w-xs">
            {currentStatus.tooltip}
          </div>
        )}

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              {/* Current Status */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentStatus.color }}
                  />
                  <span className="font-medium">Current: {currentStatus.label}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{currentStatus.description}</div>
              </div>

              {/* Valid Transitions */}
              {validTransitions.length > 0 ? (
                <div className="py-1">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Available Actions
                  </div>
                  {validTransitions.map(transitionCode => {
                    const targetStatus = statuses.find(s => s.value === transitionCode);
                    if (!targetStatus) return null;

                    return (
                      <button
                        key={transitionCode}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors group"
                        onClick={() => handleStatusClick(targetStatus)}
                      >
                        <span 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: targetStatus.color }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{targetStatus.label}</div>
                          <div className="text-xs text-gray-500">{targetStatus.description}</div>
                        </div>
                        {targetStatus.isFinal && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            Final
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-3 py-4 text-center">
                  <div className="text-sm text-gray-500">No actions available</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {task?.subtasks?.length > 0 && task.subtasks.some(s => s.status !== 'DONE' && s.status !== 'CANCELLED') 
                      ? 'Complete all sub-tasks to proceed' 
                      : 'This is a final status'
                    }
                  </div>
                </div>
              )}

              {/* Status Workflow Info */}
              <div className="border-t border-gray-200 px-3 py-2">
                <div className="text-xs font-medium text-gray-500 mb-2">Status Workflow</div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  {statuses.map((s, index) => (
                    <React.Fragment key={s.value}>
                      <span 
                        className={`px-2 py-1 rounded ${s.value === status ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                      >
                        {s.label}
                      </span>
                      {index < statuses.length - 1 && <span>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Status Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Final Status</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-3">
                  Are you sure you want to mark this task as <strong>{showConfirmation.newLabel}</strong>?
                </p>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm text-orange-800">
                    <div className="font-medium">⚠️ This is a final status</div>
                    <div className="mt-1">{showConfirmation.description}</div>
                    <div className="mt-2 text-xs">This action cannot be easily undone and will be logged in the activity history.</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmation(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmStatusChange}
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PriorityDropdown({ priority, onChange, canEdit }) {
  const [isOpen, setIsOpen] = useState(false)

  const priorities = [
    { value: 'low', label: 'Low', color: '#28a745' },
    { value: 'medium', label: 'Medium', color: '#ffc107' },
    { value: 'high', label: 'High', color: '#fd7e14' },
    { value: 'critical', label: 'Critical', color: '#dc3545' }
  ]

  if (!canEdit) {
    return (
      <div className="priority-display readonly">
        <span className={`priority-badge ${priority}`}>
          {priority}
        </span>
        <span className="readonly-indicator">🔒</span>
      </div>
    )
  }

  return (
    <div className="priority-dropdown">
      <button 
        className={`priority-button ${priority}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {priority}
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="priority-options">
          {priorities.map(priorityOption => (
            <button
              key={priorityOption.value}
              className={`priority-option ${priorityOption.value === priority ? 'selected' : ''}`}
              onClick={() => {
                onChange(priorityOption.value)
                setIsOpen(false)
              }}
            >
              {priorityOption.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function AssigneeSelector({ assignee, assigneeId, onChange, canEdit }) {
  const [isOpen, setIsOpen] = useState(false)

  const teamMembers = [
    { id: 1, name: 'John Smith', avatar: 'JS' },
    { id: 2, name: 'Sarah Wilson', avatar: 'SW' },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ' },
    { id: 4, name: 'Emily Davis', avatar: 'ED' }
  ]

  const currentAssignee = teamMembers.find(m => m.id === assigneeId) || teamMembers[0]

  if (!canEdit) {
    return (
      <div className="assignee-display readonly">
        <span className="assignee-avatar">{currentAssignee.avatar}</span>
        <span className="assignee-name">{assignee}</span>
        <span className="readonly-indicator">🔒</span>
      </div>
    )
  }

  return (
    <div className="assignee-selector">
      <button 
        className="assignee-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="assignee-avatar">{currentAssignee.avatar}</span>
        <span className="assignee-name">{assignee}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="assignee-options">
          {teamMembers.map(member => (
            <button
              key={member.id}
              className={`assignee-option ${member.id === assigneeId ? 'selected' : ''}`}
              onClick={() => {
                onChange(member)
                setIsOpen(false)
              }}
            >
              <span className="assignee-avatar">{member.avatar}</span>
              <span className="assignee-name">{member.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Editable field components
function EditableTitle({ title, onSave, canEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)

  const handleSave = () => {
    if (editValue.trim() && editValue !== title) {
      onSave(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(title)
    setIsEditing(false)
  }

  if (!canEdit) {
    return <h1 className="task-title readonly">{title}</h1>
  }

  if (isEditing) {
    return (
      <div className="editable-title-container">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          autoFocus
          className="editable-title-input"
          maxLength={100}
        />
      </div>
    )
  }

  return (
    <h1 className="task-title editable" onClick={() => setIsEditing(true)}>
      {title}
      <span className="edit-icon">✏️</span>
    </h1>
  )
}

function EditableTextArea({ value, onSave, canEdit, placeholder }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue)
    }
    setIsEditing(false)
  }

  if (!canEdit) {
    return <p className="readonly-text">{value || placeholder}</p>
  }

  if (isEditing) {
    return (
      <div className="editable-textarea-container">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          autoFocus
          className="editable-textarea"
          rows="4"
          placeholder={placeholder}
        />
      </div>
    )
  }

  return (
    <div className="editable-text-display" onClick={() => setIsEditing(true)}>
      <p>{value || placeholder}</p>
      <span className="edit-icon">✏️</span>
    </div>
  )
}

function EditableTextField({ value, onSave, canEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue)
    }
    setIsEditing(false)
  }

  if (!canEdit) {
    return <span className="readonly-text">{value}</span>
  }

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') { setEditValue(value); setIsEditing(false) }
        }}
        autoFocus
        className="editable-input"
      />
    )
  }

  return (
    <span className="editable-field" onClick={() => setIsEditing(true)}>
      {value}
      <span className="edit-icon">✏️</span>
    </span>
  )
}

function EditableDateField({ value, onSave, canEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue)
    }
    setIsEditing(false)
  }

  if (!canEdit) {
    return <span className="readonly-text">{value}</span>
  }

  if (isEditing) {
    return (
      <input
        type="date"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        autoFocus
        className="editable-input"
      />
    )
  }

  return (
    <span className="editable-field" onClick={() => setIsEditing(true)}>
      {value}
      <span className="edit-icon">✏️</span>
    </span>
  )
}

// Existing components (SubtasksPanel, LinkedItemsPanel, etc.)
function SubtasksPanel({ subtasks, onCreateSubtask, parentTask, currentUser }) {
  const [filter, setFilter] = useState('all')
  const [showInlineAdd, setShowInlineAdd] = useState(false)
  const [selectedSubtask, setSelectedSubtask] = useState(null)
  const [subtaskList, setSubtaskList] = useState(subtasks)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const filteredSubtasks = subtaskList.filter(subtask => {
    if (filter === 'all') return true
    return subtask.status === filter
  })

  const handleCreateSubtask = (subtaskData) => {
    const newSubtask = {
      id: Date.now(),
      ...subtaskData,
      parentTaskId: parentTask.id,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name
    }
    setSubtaskList([...subtaskList, newSubtask])
    setShowInlineAdd(false)
  }

  const handleUpdateSubtask = (updatedSubtask) => {
    setSubtaskList(subtaskList.map(st => 
      st.id === updatedSubtask.id ? updatedSubtask : st
    ))
  }

  const handleDeleteSubtask = (subtaskId) => {
    setSubtaskList(subtaskList.filter(st => st.id !== subtaskId))
    if (selectedSubtask?.id === subtaskId) {
      setSelectedSubtask(null)
    }
  }

  const canEditSubtask = (subtask) => {
    return subtask.createdBy === currentUser.name || 
           subtask.assignee === currentUser.name || 
           currentUser.role === 'admin'
  }

  const canDeleteSubtask = (subtask) => {
    return subtask.createdBy === currentUser.name || currentUser.role === 'admin'
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '✅'
      case 'in-progress': return '🔄'
      case 'to-do': return '⭕'
      default: return '⭕'
    }
  }

  const completedCount = subtaskList.filter(st => st.status === 'completed').length
  const progressPercentage = subtaskList.length > 0 ? Math.round((completedCount / subtaskList.length) * 100) : 0

  return (
    <div className="subtasks-panel bg-white border border-gray-200 rounded-lg">
      {/* Collapsible Header */}
      <div 
        className="subtasks-header flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700">
            {isCollapsed ? '▶' : '▼'}
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            Sub-tasks ({subtaskList.length})
          </h3>
          {subtaskList.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{progressPercentage}%</span>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="all">All Status</option>
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button 
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowInlineAdd(true)
              }}
            >
              + Add Sub-task
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="subtasks-content">
          {showInlineAdd && (
            <div className="p-4 border-b border-gray-100 bg-blue-50">
              <InlineSubtaskAdd
                parentTask={parentTask}
                currentUser={currentUser}
                onSubmit={handleCreateSubtask}
                onCancel={() => setShowInlineAdd(false)}
              />
            </div>
          )}

          <div className="subtasks-list">
            {filteredSubtasks.map((subtask, index) => (
              <div 
                key={subtask.id} 
                className={`subtask-item border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedSubtask?.id === subtask.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => setSelectedSubtask(selectedSubtask?.id === subtask.id ? null : subtask)}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">{getStatusIcon(subtask.status)}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {subtask.title}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>Due: {subtask.dueDate}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subtask.priority === 'high' ? 'bg-red-100 text-red-800' :
                          subtask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {subtask.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {subtask.assignee?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 hidden sm:inline">
                        {subtask.assignee}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {canDeleteSubtask(subtask) && (
                      <button
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm('Delete this sub-task?')) {
                            handleDeleteSubtask(subtask.id)
                          }
                        }}
                        title="Delete sub-task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <span className="text-gray-400">
                      {selectedSubtask?.id === subtask.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredSubtasks.length === 0 && !showInlineAdd && (
              <div className="empty-subtasks p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">No sub-tasks found. Break down this task into manageable pieces.</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowInlineAdd(true)}
                >
                  + Create First Sub-task
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-up Panel for Selected Sub-task */}
      {selectedSubtask && (
        <SubtaskSlideUpPanel
          subtask={selectedSubtask}
          onUpdate={handleUpdateSubtask}
          onClose={() => setSelectedSubtask(null)}
          canEdit={canEditSubtask(selectedSubtask)}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

function InlineSubtaskAdd({ parentTask, currentUser, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    assignee: currentUser.name,
    assigneeId: currentUser.id,
    priority: 'low',
    dueDate: parentTask.dueDate,
    status: 'to-do',
    visibility: parentTask.visibility || 'private',
    description: '',
    attachments: []
  })

  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const fieldRefs = useRef([])
  const priorityDueDays = { low: 30, medium: 14, high: 7, critical: 2 }

  const calculateDueDate = (priority) => {
    const today = new Date()
    const daysToAdd = priorityDueDays[priority] || 30
    const dueDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000))
    return dueDate.toISOString().split('T')[0]
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'priority') {
      setFormData({
        ...formData,
        [name]: value,
        dueDate: calculateDueDate(value)
      })
    } else if (name === 'assignee') {
      // In a real app, you'd lookup assignee ID from name
      setFormData({
        ...formData,
        [name]: value,
        assigneeId: value === currentUser.name ? currentUser.id : 2 // Mock ID
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim()) {
      onSubmit(formData)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (e.target.name === 'title' && formData.title.trim()) {
        handleSubmit(e)
      } else {
        // Move to next field
        const nextIndex = currentFieldIndex + 1
        if (nextIndex < fieldRefs.current.length) {
          setCurrentFieldIndex(nextIndex)
          fieldRefs.current[nextIndex]?.focus()
        }
      }
    } else if (e.key === 'Tab') {
      // Handle tab navigation
      const isShift = e.shiftKey
      const nextIndex = isShift ? currentFieldIndex - 1 : currentFieldIndex + 1

      if (nextIndex >= 0 && nextIndex < fieldRefs.current.length) {
        e.preventDefault()
        setCurrentFieldIndex(nextIndex)
        fieldRefs.current[nextIndex]?.focus()
      }
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  const handleFieldFocus = (index) => {
    setCurrentFieldIndex(index)
  }

  return (
    <div className="inline-subtask-add bg-white border border-blue-200 rounded-lg p-4">
      <form onSubmit={handleSubmit} className="subtask-form space-y-4">
        <div className="subtask-form-header">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500 text-lg">📝</span>
            <h4 className="text-lg font-medium text-gray-900">New Sub-task</h4>
          </div>
          <div className="relative">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter sub-task name (max 60 characters)"
              maxLength={60}
              required
              autoFocus
              className="form-input w-full pr-16"
              onKeyDown={handleKeyPress}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {formData.title.length}/60
            </div>
          </div>
        </div>

        <div className="subtask-form-fields">
          <div className="form-row">
            <div className="form-field">
              <label>Assigned To*</label>
              <select
                ref={el => fieldRefs.current[0] = el}
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onFocus={() => handleFieldFocus(0)}
                required
              >
                <option value={currentUser.name}>Myself</option>
                <option value="John Smith">John Smith</option>
                <option value="Sarah Wilson">Sarah Wilson</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Emily Davis">Emily Davis</option>
              </select>
            </div>

            <div className="form-field">
              <label>Priority</label>
              <select
                ref={el => fieldRefs.current[1] = el}
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onFocus={() => handleFieldFocus(1)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-field">
              <label>Due Date*</label>
              <input
                ref={el => fieldRefs.current[2] = el}
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onFocus={() => handleFieldFocus(2)}
                required
              />
            </div>

            <div className="form-field">
              <label>Status</label>
              <select
                ref={el => fieldRefs.current[3] = el}
                name="status"
                value={formData.status}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onFocus={() => handleFieldFocus(3)}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-field full-width">
            <label>Notes/Description</label>
            <textarea
              ref={el => fieldRefs.current[4] = el}
              name="description"
              value={formData.description}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              onFocus={() => handleFieldFocus(4)}
              placeholder="Add details or context for this sub-task..."
              rows="3"
            />
          </div>
        </div>

        <div className="subtask-form-actions flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!formData.title.trim()}>
            Create Sub-task
          </button>
        </div>
      </form>
    </div>
  )
}

function SubtaskSummary({ subtask, isExpanded, onExpand, onUpdate, onDelete, canEdit, canDelete, currentUser }) {
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const handleFieldEdit = (field, currentValue) => {
    if (!canEdit) return
    setEditingField(field)
    setEditValue(currentValue)
  }

  const handleFieldSave = () => {
    if (editingField && editValue !== subtask[editingField]) {
      const updatedSubtask = { ...subtask, [editingField]: editValue }
      onUpdate(updatedSubtask)
    }
    setEditingField(null)
    setEditValue('')
  }

  const handleFieldCancel = () => {
    setEditingField(null)
    setEditValue('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFieldSave()
    } else if (e.key === 'Escape') {
      handleFieldCancel()
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🔄'
      case 'blocked': return '🚫'
      default: return '⏸️'
    }
  }

  const isOverdue = () => {
    const today = new Date().toISOString().split('T')[0]
    return subtask.dueDate < today && subtask.status !== 'completed'
  }

  const isCompleted = subtask.status === 'completed'

  return (
    <div 
      className={`subtask-summary ${isExpanded ? 'expanded' : ''} ${isOverdue() ? 'overdue' : ''} ${isCompleted ? 'completed-task' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="subtask-summary-main" onClick={onExpand}>
        <div className="subtask-info">
          <span className={`status-indicator ${subtask.status}`}>
            {getStatusIcon(subtask.status)}
          </span>

          <div className="subtask-details">
            {editingField === 'title' ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleFieldSave}
                onKeyDown={handleKeyPress}
                autoFocus
                className="inline-edit-input"
                maxLength={60}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h4 
                className={`subtask-title ${isCompleted ? 'completed' : ''} ${canEdit ? 'editable-field' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (canEdit) handleFieldEdit('title', subtask.title)
                }}
              >
                {subtask.title}
                {canEdit && isHovered && <span className="edit-icon-small">✏️</span>}
              </h4>
            )}

            <div className="subtask-meta">
              <div className="assignee-info">
                <span className="assignee-avatar">{subtask.assignee.charAt(0)}</span>
                <span className="assignee-name">{subtask.assignee}</span>
              </div>

              <div className={`due-date ${isOverdue() ? 'overdue' : ''} ${canEdit ? 'editable-field' : ''}`}>
                {editingField === 'dueDate' ? (
                  <input
                    type="date"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleFieldSave}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    className="inline-edit-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (canEdit) handleFieldEdit('dueDate', subtask.dueDate)
                    }}
                  >
                    Due: {subtask.dueDate}
                    {canEdit && isHovered && <span className="edit-icon-small">✏️</span>}
                  </span>
                )}
              </div>

              {editingField === 'priority' ? (
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleFieldSave}
                  onKeyDown={handleKeyPress}
                  autoFocus
                  className="inline-edit-select"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              ) : (
                <span 
                  className={`priority-indicator ${subtask.priority} ${canEdit ? 'editable-field' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (canEdit) handleFieldEdit('priority', subtask.priority)
                  }}
                >
                  {subtask.priority}
                  {canEdit && isHovered && <span className="edit-icon-small">✏️</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="expand-indicator">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      <div className="subtask-actions" onClick={(e) => e.stopPropagation()}>
        {canDelete && (
          <button 
            className="btn-action delete"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this sub-task?')) {
                onDelete(subtask.id)
              }
            }}
            title="Delete sub-task"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}

function SubtaskSlideUpPanel({ subtask, onUpdate, onClose, canEdit, currentUser }) {
  const [formData, setFormData] = useState({
    ...subtask
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...subtask });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div 
        className="relative bg-white rounded-t-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {subtask.status === 'completed' ? '✅' : 
               subtask.status === 'in-progress' ? '🔄' : '⭕'}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sub-task Details</h3>
              <p className="text-sm text-gray-600">Part of parent task</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            )}
            <button
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input w-full"
                  maxLength={100}
                />
              ) : (
                <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">{subtask.title}</p>
              )}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select w-full"
                  >
                    <option value="to-do">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    subtask.status === 'completed' ? 'bg-green-100 text-green-800' :
                    subtask.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {subtask.status.replace('-', ' ')}
                  </span>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                {isEditing ? (
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-select w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    subtask.priority === 'high' ? 'bg-red-100 text-red-800' :
                    subtask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    subtask.priority === 'critical' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {subtask.priority}
                  </span>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                {isEditing ? (
                  <select
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleChange}
                    className="form-select w-full"
                  >
                    <option value="John Smith">John Smith</option>
                    <option value="Sarah Wilson">Sarah Wilson</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Emily Davis">Emily Davis</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {subtask.assignee?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-900">{subtask.assignee}</span>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="form-input w-full"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{subtask.dueDate}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="form-textarea w-full"
                  rows="4"
                  placeholder="Add description..."
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                  <p className="text-gray-900">
                    {subtask.description || 'No description provided.'}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Task Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Created by:</span>
                  <span className="ml-2 text-gray-900">{subtask.createdBy}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(subtask.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Visibility:</span>
                  <span className="ml-2 text-gray-900">{subtask.visibility || 'Private'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Parent Task:</span>
                  <span className="ml-2 text-gray-900">#{subtask.parentTaskId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SubtaskDetailView({ subtask, onUpdate, onClose, canEdit, currentUser }) {
  const [formData, setFormData] = useState({
    ...subtask
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSave = () => {
    onUpdate(formData)
    onClose()
  }

  return (
    <div className="subtask-detail-view">
      <div className="subtask-detail-header">
        <h4>Sub-task Details</h4>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="subtask-detail-content">
        <div className="detail-form">
          <div className="form-row">
            <div className="form-field">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-field">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-field">
              <label>Assignee</label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="John Smith">John Smith</option>
                <option value="Sarah Wilson">Sarah Wilson</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Emily Davis">Emily Davis</option>
              </select>
            </div>
          </div>

          <div className="form-field full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              disabled={!canEdit}
              rows="4"
            />
          </div>
        </div>

        <div className="subtask-meta-info">
          <div className="meta-item">
            <strong>Created:</strong> {new Date(subtask.createdAt).toLocaleString()}
          </div>
          <div className="meta-item">
            <strong>Created by:</strong> {subtask.createdBy}
          </div>
          <div className="meta-item">
            <strong>Visibility:</strong> {subtask.visibility}
          </div>
        </div>

        {canEdit && (
          <div className="subtask-detail-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function LinkedItemsPanel({ linkedItems }) {
  return (
    <div className="linked-items-panel">
      <h3>Linked Items ({linkedItems.length})</h3>
      <div className="linked-items-list">
        {linkedItems.map(item => (
          <div key={item.id} className="linked-item">
            <div className="item-icon">
              {item.type === 'form' ? '📋' : 
               item.type === 'document' ? '📄' : '🔗'}
            </div>
            <div className="item-info">
              <h4>{item.title}</h4>
              <span className="item-type">{item.type}</span>
            </div>
            <span className={`status-badge ${item.status}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EditableInfoItem({ label, value, type, options, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className="info-item editable-info-item">
      <label>{label}</label>
      {isEditing ? (
        <div className="info-edit-container">
          {type === 'select' ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              autoFocus
              className="info-edit-select"
            >
              {options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              autoFocus
              className="info-edit-input"
            />
          )}
        </div>
      ) : (
        <div className="info-display" onClick={() => setIsEditing(true)}>
          <span className={type === 'select' && label === 'Priority' ? `priority-badge ${value}` : ''}>
            {value}
          </span>
          <span className="edit-icon-small">✏️</span>
        </div>
      )}
    </div>
  )
}



function TaskDeleteModal({ task, onConfirm, onClose, currentUser }) {
  const [deleteOptions, setDeleteOptions] = useState({
    deleteSubtasks: false,
    deleteAttachments: false,
    confirmed: false
  })

  const hasSubtasks = task?.subtasks && task.subtasks.length > 0
  const hasAttachments = task?.attachments && task.attachments.length > 0
  const hasLinkedItems = task?.linkedItems && task.linkedItems.length > 0

  const handleSubmit = () => {
    if (!deleteOptions.confirmed) {
      alert('Please confirm you understand this action is irreversible')
      return
    }
    onConfirm(deleteOptions)
  }

  const getWarningMessages = () => {
    const warnings = []
    
    if (hasSubtasks) {
      warnings.push(`This task has ${task.subtasks.length} subtask(s). Deleting it will delete all subtasks.`)
    }
    
    if (hasLinkedItems || hasAttachments) {
      warnings.push('All linked forms and files will also be deleted.')
    }

    if (task.createdBy !== currentUser.name && task.assigneeId !== currentUser.id) {
      warnings.push('This task was created by another user.')
    }

    return warnings
  }

  const warnings = getWarningMessages()

  return (
    <div className="modal-overlay">
      <div className="modal-container delete-task-modal">
        <div className="modal-header">
          <h3>🗑️ Delete Task</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="delete-task-info">
            <h4>Are you sure you want to delete this task?</h4>
            <div className="task-to-delete">
              <strong>"{task?.title}"</strong>
              <span className={`status-badge ${task?.status}`}>
                {getStatusLabel(task?.status)}
              </span>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="deletion-warnings">
              <h4>⚠️ Important Notice:</h4>
              <ul>
                {warnings.map((warning, index) => (
                  <li key={index} className="warning-item">{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="deletion-options">
            {hasSubtasks && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deleteOptions.deleteSubtasks}
                  onChange={(e) => setDeleteOptions({
                    ...deleteOptions,
                    deleteSubtasks: e.target.checked
                  })}
                />
                <span className="checkmark"></span>
                Also delete all {task.subtasks.length} subtask(s)
              </label>
            )}

            {(hasAttachments || hasLinkedItems) && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deleteOptions.deleteAttachments}
                  onChange={(e) => setDeleteOptions({
                    ...deleteOptions,
                    deleteAttachments: e.target.checked
                  })}
                />
                <span className="checkmark"></span>
                Also delete attached forms and files
              </label>
            )}

            <label className="checkbox-label required-confirmation">
              <input
                type="checkbox"
                checked={deleteOptions.confirmed}
                onChange={(e) => setDeleteOptions({
                  ...deleteOptions,
                  confirmed: e.target.checked
                })}
                required
              />
              <span className="checkmark"></span>
              <strong>I understand this action is irreversible</strong>
            </label>
          </div>

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-danger" 
              onClick={handleSubmit}
              disabled={!deleteOptions.confirmed}
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SnoozeModal({ task, onSubmit, onClose }) {
  const [snoozeData, setSnoozeData] = useState({
    snoozeUntil: '',
    note: ''
  })

  // Set default snooze time to next day 9 AM
  React.useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)

    setSnoozeData({
      snoozeUntil: tomorrow.toISOString().slice(0, 16), // Format for datetime-local input
      note: ''
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(snoozeData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Snooze Task: {task?.title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label>Snooze until:</label>
            <input
              type="datetime-local"
              value={snoozeData.snoozeUntil}
              onChange={(e) => setSnoozeData({...snoozeData, snoozeUntil: e.target.value})}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Optional note:</label>
            <textarea
              value={snoozeData.note}
              onChange={(e) => setSnoozeData({...snoozeData, note: e.target.value})}
              placeholder="Reason for snoozing (optional)"
              className="form-input"
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Snooze Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ReassignModal({ task, onSubmit, onClose }) {
  const [assignee, setAssignee] = useState(task.assignee)
  const [assigneeId, setAssigneeId] = useState(task.assigneeId)

  const teamMembers = [
    { id: 1, name: 'John Smith', avatar: 'JS' },
    { id: 2, name: 'Sarah Wilson', avatar: 'SW' },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ' },
    { id: 4, name: 'Emily Davis', avatar: 'ED' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const newAssignee = teamMembers.find(member => member.id === assigneeId)
    onSubmit(newAssignee)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Reassign Task: {task?.title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label>Select new assignee:</label>
            <select
              value={assignee}
              onChange={(e) => {
                setAssignee(e.target.value)
                setAssigneeId(parseInt(e.target.value))
              }}
              required
              className="form-input"
            >
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Reassign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SubtaskDrawer({ parentTask, currentUser, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    assignee: currentUser.name,
    assigneeId: currentUser.id,
    priority: 'medium',
    dueDate: '',
    status: 'pending',
    visibility: parentTask.visibility || 'private',
    description: ''
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // Calculate due date based on priority
  const calculateDueDate = (priority) => {
    const today = new Date()
    const priorityDays = {
      'low': 30,
      'medium': 14,
      'high': 7,
      'critical': 2,
      'urgent': 2
    }
    const daysToAdd = priorityDays[priority] || 14
    const dueDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000))
    return dueDate.toISOString().split('T')[0]
  }

  // Auto-suggest due date when priority changes
  React.useEffect(() => {
    if (formData.priority) {
      setFormData(prev => ({
        ...prev,
        dueDate: calculateDueDate(formData.priority)
      }))
    }
  }, [formData.priority])

  // Team members for assignment
  const teamMembers = [
    { id: 1, name: 'Current User', avatar: 'CU', role: 'assignee' },
    { id: 2, name: 'John Smith', avatar: 'JS', role: 'team' },
    { id: 3, name: 'Sarah Wilson', avatar: 'SW', role: 'team' },
    { id: 4, name: 'Mike Johnson', avatar: 'MJ', role: 'team' },
    { id: 5, name: 'Emily Davis', avatar: 'ED', role: 'team' }
  ]

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim()) {
      onSubmit(formData)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (formData.title.trim()) {
        handleSubmit(e)
      }
    } else if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Tab' && e.target.name === 'title') {
      // Move to assignee field
      e.preventDefault()
      setShowUserDropdown(true)
    }
  }

  const canAssignToOthers = currentUser.role === 'admin' || currentUser.role === 'team'

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📝</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Sub-task</h2>
                <p className="text-sm text-gray-600">Parent: {parentTask.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sub-task Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-task Name *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter sub-task name..."
                  maxLength={100}
                  autoFocus
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
              </div>

              {/* Assignee Search Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to *
                </label>
                <div className="relative">
                  <div 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between hover:border-blue-400 transition-colors"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {teamMembers.find(m => m.id === formData.assigneeId)?.avatar || 'U'}
                        </span>
                      </div>
                      <span className="text-gray-900">{formData.assignee}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {showUserDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div className="p-3 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="py-1">
                        {filteredMembers.map(member => (
                          <button
                            key={member.id}
                            type="button"
                            disabled={!canAssignToOthers && member.id !== currentUser.id}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                              !canAssignToOthers && member.id !== currentUser.id ? 'opacity-50 cursor-not-allowed' : ''
                            } ${formData.assigneeId === member.id ? 'bg-blue-50 text-blue-700' : ''}`}
                            onClick={() => {
                              if (canAssignToOthers || member.id === currentUser.id) {
                                setFormData(prev => ({
                                  ...prev,
                                  assignee: member.name,
                                  assigneeId: member.id
                                }))
                                setShowUserDropdown(false)
                                setSearchTerm('')
                              }
                            }}
                          >
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">{member.avatar}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{member.name}</div>
                              {member.id === currentUser.id && (
                                <div className="text-xs text-gray-500">You</div>
                              )}
                            </div>
                            {!canAssignToOthers && member.id !== currentUser.id && (
                              <span className="text-xs text-gray-400">No permission</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {!canAssignToOthers && (
                  <p className="text-xs text-orange-600 mt-1">
                    You can only assign sub-tasks to yourself. Contact admin for team assignment permissions.
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority (optional)
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="low">Low (30 days)</option>
                  <option value="medium">Medium (14 days)</option>
                  <option value="high">High (7 days)</option>
                  <option value="critical">Critical (2 days)</option>
                  <option value="urgent">Urgent (2 days)</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                  <span className="text-xs text-blue-600 ml-2">(Auto-suggested from priority)</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Due date automatically calculated based on priority. You can override this date.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Add additional details..."
                  rows="3"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>

              {/* Inheritance Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Inherited from Parent Task</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• Visibility: {parentTask.visibility || 'Private'}</div>
                  <div>• Parent Due Date: {parentTask.dueDate}</div>
                  <div>• Category: {parentTask.category || 'None'}</div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.title.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Create Sub-task
              </button>
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> to create • <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> to cancel
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function RiskModal({ task, onSubmit, onClose }) {
  const [riskData, setRiskData] = useState({
    note: task.riskNote || ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(riskData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Mark Task as At Risk: {task?.title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label>Risk Note:</label>
            <textarea
              value={riskData.note}
              onChange={(e) => setRiskData({...riskData, note: e.target.value})}
              placeholder="Describe the risks associated with this task"
              className="form-input"
              rows="4"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Mark as At Risk
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}