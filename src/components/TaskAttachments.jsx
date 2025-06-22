
import React, { useState } from 'react'

export default function TaskAttachments({ taskId }) {
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      name: 'migration-plan.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'database-schema.sql',
      size: '156 KB',
      type: 'sql',
      uploadedBy: 'John Smith',
      uploadedAt: '2024-01-18'
    },
    {
      id: 3,
      name: 'backup-verification.xlsx',
      size: '890 KB',
      type: 'excel',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-01-20'
    }
  ])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const attachment = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString().split('T')[0]
      }
      setAttachments(prev => [...prev, attachment])
    })
  }

  const handleRemove = (attachmentId) => {
    setAttachments(attachments.filter(att => att.id !== attachmentId))
  }

  return (
    <div className="task-attachments">
      <div className="attachments-header">
        <h4>Attachments ({attachments.length})</h4>
        <label className="btn-primary upload-button">
          📎 Upload Files
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="attachments-list">
        {attachments.map(attachment => (
          <div key={attachment.id} className="attachment-item">
            <div className="attachment-info">
              <div className="attachment-name">{attachment.name}</div>
              <div className="attachment-meta">
                {attachment.size} • Uploaded by {attachment.uploadedBy} on {attachment.uploadedAt}
              </div>
            </div>
            <div className="attachment-actions">
              <button className="btn-action">📥 Download</button>
              <button 
                className="btn-action delete"
                onClick={() => handleRemove(attachment.id)}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {attachments.length === 0 && (
        <div className="empty-attachments">
          <p>No files attached to this task.</p>
        </div>
      )}
    </div>
  )
}

export default function TaskAttachments({ taskId }) {
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      name: 'database-schema.sql',
      size: '45KB',
      type: 'sql',
      uploadedBy: 'John Smith',
      uploadedAt: '2024-01-20 14:30',
      url: '#'
    },
    {
      id: 2,
      name: 'migration-plan.pdf',
      size: '1.2MB',
      type: 'pdf',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-01-21 09:15',
      url: '#'
    },
    {
      id: 3,
      name: 'test-results.xlsx',
      size: '856KB',
      type: 'xlsx',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-01-22 11:45',
      url: '#'
    }
  ])

  const [links, setLinks] = useState([
    {
      id: 1,
      title: 'PostgreSQL Migration Guide',
      url: 'https://docs.postgresql.org/current/migration.html',
      description: 'Official documentation for database migration',
      addedBy: 'John Smith',
      addedAt: '2024-01-20 16:00'
    },
    {
      id: 2,
      title: 'Project Repository',
      url: 'https://github.com/company/project',
      description: 'Main project repository',
      addedBy: 'Sarah Wilson',
      addedAt: '2024-01-21 10:30'
    }
  ])

  const [dragOver, setDragOver] = useState(false)
  const [showAddLink, setShowAddLink] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '' })
  const [isUploading, setIsUploading] = useState(false)

  const currentUser = { name: 'Current User' }

  const getFileIcon = (type) => {
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xlsx: '📊',
      xls: '📊',
      sql: '🗄️',
      txt: '📋',
      zip: '📦',
      rar: '📦',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️'
    }
    return icons[type.toLowerCase()] || '📎'
  }

  const formatFileSize = (size) => {
    return size // Already formatted in mock data
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleFileUpload = async (files) => {
    setIsUploading(true)
    const fileArray = Array.from(files)

    try {
      // Simulate upload process
      for (const file of fileArray) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newAttachment = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + 'KB',
          type: file.name.split('.').pop(),
          uploadedBy: currentUser.name,
          uploadedAt: new Date().toISOString(),
          url: URL.createObjectURL(file)
        }
        
        setAttachments(prev => [...prev, newAttachment])
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload files')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleDeleteAttachment = (attachmentId) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      setAttachments(attachments.filter(att => att.id !== attachmentId))
    }
  }

  const handleAddLink = (e) => {
    e.preventDefault()
    if (!newLink.title.trim() || !newLink.url.trim()) return

    const link = {
      id: Date.now(),
      ...newLink,
      addedBy: currentUser.name,
      addedAt: new Date().toISOString()
    }

    setLinks([...links, link])
    setNewLink({ title: '', url: '', description: '' })
    setShowAddLink(false)
  }

  const handleDeleteLink = (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setLinks(links.filter(link => link.id !== linkId))
    }
  }

  return (
    <div className="task-attachments">
      <div className="attachments-section">
        <div className="section-header">
          <h3>Files ({attachments.length})</h3>
        </div>

        <div
          className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="drop-zone-content">
            <span className="drop-icon">📎</span>
            <p>Drag and drop files here or <label className="file-select-label">
              browse
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="file-input-hidden"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.sql,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif"
              />
            </label></p>
            <small>Maximum file size: 10MB per file</small>
          </div>
        </div>

        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span>Uploading files...</span>
          </div>
        )}

        <div className="attachments-list">
          {attachments.map(attachment => (
            <div key={attachment.id} className="attachment-item">
              <div className="attachment-info">
                <span className="file-icon">{getFileIcon(attachment.type)}</span>
                <div className="file-details">
                  <div className="file-name">{attachment.name}</div>
                  <div className="file-meta">
                    {formatFileSize(attachment.size)} • 
                    Uploaded by {attachment.uploadedBy} • 
                    {formatTimestamp(attachment.uploadedAt)}
                  </div>
                </div>
              </div>
              <div className="attachment-actions">
                <button 
                  className="btn-action"
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  Download
                </button>
                <button 
                  className="btn-action delete"
                  onClick={() => handleDeleteAttachment(attachment.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {attachments.length === 0 && !isUploading && (
          <div className="empty-attachments">
            <p>No files attached yet. Upload files to share with your team.</p>
          </div>
        )}
      </div>

      <div className="links-section">
        <div className="section-header">
          <h3>Links ({links.length})</h3>
          <button 
            className="btn-secondary"
            onClick={() => setShowAddLink(true)}
          >
            + Add Link
          </button>
        </div>

        {showAddLink && (
          <form onSubmit={handleAddLink} className="add-link-form">
            <div className="form-group">
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                placeholder="Link title"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                placeholder="https://example.com"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={newLink.description}
                onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                placeholder="Optional description"
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddLink(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Link
              </button>
            </div>
          </form>
        )}

        <div className="links-list">
          {links.map(link => (
            <div key={link.id} className="link-item">
              <div className="link-info">
                <span className="link-icon">🔗</span>
                <div className="link-details">
                  <div className="link-title">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.title}
                    </a>
                  </div>
                  {link.description && (
                    <div className="link-description">{link.description}</div>
                  )}
                  <div className="link-meta">
                    Added by {link.addedBy} • {formatTimestamp(link.addedAt)}
                  </div>
                </div>
              </div>
              <div className="link-actions">
                <button 
                  className="btn-action delete"
                  onClick={() => handleDeleteLink(link.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {links.length === 0 && !showAddLink && (
          <div className="empty-links">
            <p>No links added yet. Add relevant links to help your team.</p>
          </div>
        )}
      </div>
    </div>
  )
}
