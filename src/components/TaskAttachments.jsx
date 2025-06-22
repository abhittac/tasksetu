
import React, { useState } from 'react'

export default function TaskAttachments({ taskId }) {
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      name: 'database-schema.pdf',
      type: 'document',
      size: '1.2MB',
      uploadedBy: 'John Smith',
      uploadedAt: '2024-01-15 10:30',
      url: '#'
    },
    {
      id: 2,
      name: 'migration-screenshot.png',
      type: 'image',
      size: '245KB',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-01-15 14:20',
      url: '#'
    },
    {
      id: 3,
      name: 'backup-files.zip',
      type: 'archive',
      size: '1.8MB',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-01-15 16:45',
      url: '#'
    }
  ])

  const [links, setLinks] = useState([
    {
      id: 1,
      title: 'Database Migration Guide',
      url: 'https://docs.example.com/migration-guide',
      addedBy: 'Emily Davis',
      addedAt: '2024-01-15 11:00',
      preview: {
        title: 'Complete Database Migration Guide',
        description: 'Step-by-step guide for migrating databases safely',
        image: null
      }
    }
  ])

  const [dragOver, setDragOver] = useState(false)
  const [userRole] = useState('assignee') // This would come from auth context
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '' })

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(file => file.size <= 2 * 1024 * 1024) // 2MB limit
    
    validFiles.forEach(file => {
      const attachment = {
        id: attachments.length + 1,
        name: file.name,
        type: getFileType(file.type),
        size: formatFileSize(file.size),
        uploadedBy: 'Current User',
        uploadedAt: new Date().toLocaleString(),
        url: URL.createObjectURL(file)
      }
      setAttachments(prev => [...prev, attachment])
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleFileSelect = (e) => {
    handleFileUpload(e.target.files)
  }

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.includes('pdf')) return 'document'
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive'
    return 'document'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    const icons = {
      image: '🖼️',
      document: '📄',
      archive: '📦'
    }
    return icons[type] || '📄'
  }

  const canDeleteFile = (attachment) => {
    return userRole === 'admin' || attachment.uploadedBy === 'Current User'
  }

  const deleteAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id))
  }

  const handleLinkSubmit = (e) => {
    e.preventDefault()
    if (!newLink.title.trim() || !newLink.url.trim()) return

    const link = {
      id: links.length + 1,
      title: newLink.title,
      url: newLink.url,
      addedBy: 'Current User',
      addedAt: new Date().toLocaleString(),
      preview: {
        title: newLink.title,
        description: 'Link preview not available',
        image: null
      }
    }

    setLinks([...links, link])
    setNewLink({ title: '', url: '' })
    setShowLinkForm(false)
  }

  const canAddAttachments = () => {
    return userRole === 'admin' || userRole === 'assignee' || userRole === 'collaborator'
  }

  return (
    <div className="task-attachments">
      <div className="attachments-section">
        <div className="section-header">
          <h3>Files ({attachments.length})</h3>
          {canAddAttachments() && (
            <div className="upload-controls">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileSelect}
                className="file-input"
                accept="image/*,.pdf,.doc,.docx,.zip,.rar"
              />
              <label htmlFor="file-upload" className="btn-secondary">
                📎 Upload Files
              </label>
            </div>
          )}
        </div>

        {canAddAttachments() && (
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="drop-zone-content">
              <span className="drop-icon">📁</span>
              <p>Drag and drop files here or click to upload</p>
              <small>Maximum file size: 2MB</small>
            </div>
          </div>
        )}

        <div className="attachments-list">
          {attachments.map(attachment => (
            <div key={attachment.id} className="attachment-card">
              <div className="attachment-icon">
                {getFileIcon(attachment.type)}
              </div>
              <div className="attachment-info">
                <div className="attachment-name">{attachment.name}</div>
                <div className="attachment-meta">
                  <span>{attachment.size}</span>
                  <span>•</span>
                  <span>by {attachment.uploadedBy}</span>
                  <span>•</span>
                  <span>{attachment.uploadedAt}</span>
                </div>
              </div>
              <div className="attachment-actions">
                <button className="btn-action">Download</button>
                {attachment.type === 'image' && (
                  <button className="btn-action">Preview</button>
                )}
                {canDeleteFile(attachment) && (
                  <button 
                    className="btn-action delete"
                    onClick={() => deleteAttachment(attachment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="links-section">
        <div className="section-header">
          <h3>Links ({links.length})</h3>
          {canAddAttachments() && (
            <button 
              className="btn-secondary"
              onClick={() => setShowLinkForm(!showLinkForm)}
            >
              🔗 Add Link
            </button>
          )}
        </div>

        {showLinkForm && (
          <form className="link-form" onSubmit={handleLinkSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Link title"
                value={newLink.title}
                onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                required
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={newLink.url}
                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                required
              />
              <button type="submit" className="btn-primary">Add</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowLinkForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="links-list">
          {links.map(link => (
            <div key={link.id} className="link-card">
              <div className="link-preview">
                <div className="link-icon">🔗</div>
                <div className="link-content">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-title">
                    {link.title}
                  </a>
                  <div className="link-url">{link.url}</div>
                  <div className="link-meta">
                    Added by {link.addedBy} • {link.addedAt}
                  </div>
                </div>
              </div>
              {(userRole === 'admin' || link.addedBy === 'Current User') && (
                <button 
                  className="btn-action delete"
                  onClick={() => setLinks(links.filter(l => l.id !== link.id))}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TaskAttachments({ taskId }) {
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      name: 'requirements.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-22 10:00:00'
    },
    {
      id: 2,
      name: 'design-mockup.png',
      size: '1.8 MB',
      type: 'image',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-01-22 09:30:00'
    }
  ])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const attachment = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type.split('/')[0],
        uploadedBy: 'Current User',
        uploadedAt: new Date().toLocaleString()
      }
      setAttachments(prev => [...prev, attachment])
    })
  }

  const handleDeleteAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  return (
    <div className="task-attachments">
      <div className="attachments-header">
        <h4>Attachments</h4>
        <label className="upload-button btn-primary">
          Upload Files
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
                {attachment.size} • Uploaded by {attachment.uploadedBy} • {attachment.uploadedAt}
              </div>
            </div>
            <div className="attachment-actions">
              <button className="btn-action">Download</button>
              <button 
                className="btn-action delete"
                onClick={() => handleDeleteAttachment(attachment.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
