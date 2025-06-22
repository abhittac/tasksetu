
import React, { useState } from 'react'

export default function TaskComments({ taskId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Smith",
      content: "I've completed the initial setup for this task. @Sarah Wilson please review the implementation.",
      timestamp: "2024-01-15 10:30",
      isEdited: false,
      attachments: [
        { id: 1, name: "setup-screenshot.png", type: "image", size: "245KB" }
      ],
      reactions: [
        { emoji: "👍", users: ["Sarah Wilson", "Mike Johnson"], count: 2 },
        { emoji: "🎉", users: ["Emily Davis"], count: 1 }
      ]
    },
    {
      id: 2,
      author: "Sarah Wilson",
      content: "Great work! The implementation looks solid. I've added some additional documentation.",
      timestamp: "2024-01-15 14:20",
      isEdited: true,
      attachments: [
        { id: 2, name: "documentation.pdf", type: "document", size: "1.2MB" }
      ],
      reactions: []
    }
  ])

  const [newComment, setNewComment] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [userRole] = useState('assignee') // This would come from auth context

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: comments.length + 1,
      author: "Current User",
      content: newComment,
      timestamp: new Date().toLocaleString(),
      isEdited: false,
      attachments: selectedFiles.map((file, index) => ({
        id: index + 1,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        size: `${(file.size / 1024).toFixed(1)}KB`
      })),
      reactions: []
    }

    setComments([...comments, comment])
    setNewComment('')
    setSelectedFiles([])
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => file.size <= 2 * 1024 * 1024) // 2MB limit
    setSelectedFiles(validFiles)
  }

  const handleReaction = (commentId, emoji) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const existingReaction = comment.reactions.find(r => r.emoji === emoji)
        if (existingReaction) {
          // Toggle reaction
          if (existingReaction.users.includes("Current User")) {
            existingReaction.users = existingReaction.users.filter(u => u !== "Current User")
            existingReaction.count = existingReaction.users.length
          } else {
            existingReaction.users.push("Current User")
            existingReaction.count = existingReaction.users.length
          }
        } else {
          // Add new reaction
          comment.reactions.push({
            emoji: emoji,
            users: ["Current User"],
            count: 1
          })
        }
      }
      return comment
    }))
  }

  const canEditComment = (comment) => {
    return userRole === 'admin' || comment.author === "Current User"
  }

  const canDeleteComment = (comment) => {
    return userRole === 'admin' || comment.author === "Current User"
  }

  return (
    <div className="task-comments">
      <div className="comments-header">
        <h3>Comments ({comments.length})</h3>
      </div>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar">
              {comment.author.charAt(0)}
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-timestamp">
                  {comment.timestamp}
                  {comment.isEdited && <span className="edited-indicator">(edited)</span>}
                </span>
                <div className="comment-actions">
                  {canEditComment(comment) && (
                    <button className="comment-action">Edit</button>
                  )}
                  {canDeleteComment(comment) && (
                    <button className="comment-action delete">Delete</button>
                  )}
                </div>
              </div>
              
              <div className="comment-text">
                {comment.content}
              </div>

              {comment.attachments.length > 0 && (
                <div className="comment-attachments">
                  {comment.attachments.map(attachment => (
                    <div key={attachment.id} className="attachment-item">
                      <div className="attachment-icon">
                        {attachment.type === 'image' ? '🖼️' : '📄'}
                      </div>
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-size">({attachment.size})</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="comment-reactions">
                {comment.reactions.map(reaction => (
                  <button
                    key={reaction.emoji}
                    className={`reaction-button ${reaction.users.includes("Current User") ? 'active' : ''}`}
                    onClick={() => handleReaction(comment.id, reaction.emoji)}
                  >
                    {reaction.emoji} {reaction.count}
                  </button>
                ))}
                <button 
                  className="add-reaction"
                  onClick={() => handleReaction(comment.id, '👍')}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(userRole === 'admin' || userRole === 'assignee' || userRole === 'collaborator') && (
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <div className="comment-input-container">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... Use @ to mention users"
              className="comment-input"
              rows="3"
            />
            
            <div className="comment-form-actions">
              <div className="file-upload">
                <input
                  type="file"
                  id="comment-files"
                  multiple
                  onChange={handleFileSelect}
                  className="file-input"
                  accept="image/*,.pdf,.doc,.docx,.zip"
                />
                <label htmlFor="comment-files" className="file-upload-label">
                  📎 Attach files
                </label>
              </div>
              
              <button type="submit" className="btn-primary" disabled={!newComment.trim()}>
                Comment
              </button>
            </div>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              {selectedFiles.map((file, index) => (
                <div key={index} className="selected-file">
                  <span>{file.name}</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="remove-file"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>
      )}
    </div>
  )
}
import { useState } from 'react'

export default function TaskComments({ taskId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'John Doe',
      avatar: 'JD',
      text: 'This task is progressing well. Need to complete the database setup first.',
      timestamp: '2024-01-22 10:30:00',
      mentions: []
    },
    {
      id: 2,
      user: 'Jane Smith',
      avatar: 'JS',
      text: 'I can help with the frontend once the API is ready.',
      timestamp: '2024-01-22 09:15:00',
      mentions: []
    }
  ])
  
  const [newComment, setNewComment] = useState('')

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      user: 'Current User',
      avatar: 'CU',
      text: newComment,
      timestamp: new Date().toLocaleString(),
      mentions: []
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  return (
    <div className="task-comments">
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar">{comment.avatar}</div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-user">{comment.user}</span>
                <span className="comment-time">{comment.timestamp}</span>
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
          rows="3"
        />
        <div className="comment-actions">
          <button type="submit" className="btn-primary">
            Add Comment
          </button>
        </div>
      </form>
    </div>
  )
}
