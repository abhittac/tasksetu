
import React, { useState, useRef, useEffect } from 'react'

export default function TaskComments({ taskId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Smith',
      authorId: 'john_smith',
      content: 'I\'ve started working on the **database schema migration**. The initial analysis shows we need to handle about 2.5M records.',
      timestamp: '2024-01-22 10:30:00',
      avatar: 'JS',
      mentions: [],
      attachments: [],
      reactions: { '👍': 2, '🚀': 1 },
      isEdited: false
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      authorId: 'sarah_wilson',
      content: '@John Smith - Great! Please make sure to backup the data before starting the migration process. Also, have you considered the downtime window?',
      timestamp: '2024-01-22 11:15:00',
      avatar: 'SW',
      mentions: ['John Smith'],
      attachments: [],
      reactions: {},
      isEdited: false
    },
    {
      id: 3,
      author: 'Mike Johnson',
      authorId: 'mike_johnson',
      content: 'I can help with the testing phase. Let me know when you\'re ready for the staging environment setup.\n\n```sql\nSELECT COUNT(*) FROM users WHERE created_at > \'2024-01-01\';\n```',
      timestamp: '2024-01-22 14:20:00',
      avatar: 'MJ',
      mentions: [],
      attachments: [
        { name: 'test-plan.pdf', size: '245KB', type: 'pdf' }
      ],
      reactions: { '💯': 1 },
      isEdited: false
    }
  ])

  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const emojiPickerRef = useRef(null)

  const currentUser = { id: 'current_user', name: 'Current User', avatar: 'CU' }

  // Mock team members for mentions (would come from user master for company)
  const teamMembers = [
    { id: 'john_smith', name: 'John Smith', avatar: 'JS', email: 'john@company.com' },
    { id: 'sarah_wilson', name: 'Sarah Wilson', avatar: 'SW', email: 'sarah@company.com' },
    { id: 'mike_johnson', name: 'Mike Johnson', avatar: 'MJ', email: 'mike@company.com' },
    { id: 'emily_davis', name: 'Emily Davis', avatar: 'ED', email: 'emily@company.com' },
    { id: 'current_user', name: 'Current User', avatar: 'CU', email: 'current@company.com' }
  ]

  const emojis = ['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🚀', '💯', '🎉', '🔥', '✅']

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCommentChange = (e) => {
    const value = e.target.value
    const cursorPosition = e.target.selectionStart

    setNewComment(value)

    // Handle @ mentions
    const atIndex = value.lastIndexOf('@', cursorPosition - 1)
    if (atIndex !== -1) {
      const afterAt = value.substring(atIndex + 1, cursorPosition)
      if (!afterAt.includes(' ') && afterAt.length >= 0) {
        setMentionQuery(afterAt)
        setMentionPosition({ start: atIndex, end: cursorPosition })
        setShowMentionSuggestions(true)
      } else {
        setShowMentionSuggestions(false)
      }
    } else {
      setShowMentionSuggestions(false)
    }
  }

  const handleMentionSelect = (member) => {
    const beforeMention = newComment.substring(0, mentionPosition.start)
    const afterMention = newComment.substring(mentionPosition.end)
    const newValue = beforeMention + `@${member.name} ` + afterMention

    setNewComment(newValue)
    setShowMentionSuggestions(false)
    setMentionQuery('')
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  const handleFormatting = (format) => {
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = newComment.substring(start, end)

    let formattedText = ''
    let newCursorPos = start

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        newCursorPos = start + 2
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        newCursorPos = start + 1
        break
      case 'code':
        formattedText = `\`${selectedText}\``
        newCursorPos = start + 1
        break
      case 'codeblock':
        formattedText = `\n\`\`\`\n${selectedText}\n\`\`\`\n`
        newCursorPos = start + 4
        break
      case 'bullet':
        formattedText = `\n• ${selectedText}`
        newCursorPos = start + 3
        break
    }

    const newValue = newComment.substring(0, start) + formattedText + newComment.substring(end)
    setNewComment(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos + selectedText.length)
    }, 0)
  }

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type
    }))
    setSelectedFiles([...selectedFiles, ...fileArray])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const removeFile = (fileId) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)

    // Extract mentions from comment
    const mentionRegex = /@(\w+(?:\s+\w+)*)/g
    const mentions = []
    let match
    while ((match = mentionRegex.exec(newComment)) !== null) {
      mentions.push(match[1])
    }

    const comment = {
      id: Date.now(),
      author: currentUser.name,
      authorId: currentUser.id,
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      avatar: currentUser.avatar,
      mentions,
      attachments: selectedFiles.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      })),
      reactions: {},
      isEdited: false
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setComments([...comments, comment])
      setNewComment('')
      setSelectedFiles([])

      // Log mention notifications
      if (mentions.length > 0) {
        console.log('Mention notifications sent to:', mentions)
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = (commentId) => {
    const comment = comments.find(c => c.id === commentId)
    setEditingComment(commentId)
    setEditContent(comment.content)
  }

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return

    try {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editContent.trim(), isEdited: true }
          : comment
      ))
      setEditingComment(null)
      setEditContent('')
    } catch (error) {
      console.error('Error editing comment:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: 'This comment was deleted.', isDeleted: true }
          : comment
      ))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleReaction = (commentId, emoji) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const reactions = { ...comment.reactions }
        if (reactions[emoji]) {
          reactions[emoji] += 1
        } else {
          reactions[emoji] = 1
        }
        return { ...comment, reactions }
      }
      return comment
    }))
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  const formatContent = (content) => {
    if (!content) return ''
    
    // Handle deleted comments
    if (content === 'This comment was deleted.') {
      return `<span class="deleted-comment">${content}</span>`
    }

    let formatted = content
      // Bold text **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code `code`
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // Code blocks ```code```
      .replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
      // Mentions @user
      .replace(/@(\w+(?:\s+\w+)*)/g, '<span class="mention">@$1</span>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Bullets •
      .replace(/^• /gm, '<span class="bullet">• </span>')

    return formatted
  }

  const getExactTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="task-comments">
      <div className="comments-header">
        <h3>Comments ({comments.length})</h3>
      </div>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className={`comment-item ${comment.isDeleted ? 'deleted' : ''}`}>
            <div className="comment-avatar">{comment.avatar}</div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span 
                  className="comment-timestamp"
                  title={getExactTimestamp(comment.timestamp)}
                >
                  {formatTimestamp(comment.timestamp)}
                  {comment.isEdited && <span className="edited-indicator"> (edited)</span>}
                </span>
                {comment.authorId === currentUser.id && !comment.isDeleted && (
                  <div className="comment-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditComment(comment.id)}
                      title="Edit comment"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Delete comment"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              {editingComment === comment.id ? (
                <div className="edit-comment-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="edit-textarea"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => setEditingComment(null)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-primary btn-sm"
                      onClick={() => handleSaveEdit(comment.id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="comment-text"
                  dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
                />
              )}

              {comment.attachments.length > 0 && (
                <div className="comment-attachments">
                  {comment.attachments.map((attachment, index) => (
                    <div key={index} className="attachment-item">
                      <span className="attachment-icon">📎</span>
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-size">({attachment.size})</span>
                    </div>
                  ))}
                </div>
              )}

              {Object.keys(comment.reactions).length > 0 && (
                <div className="comment-reactions">
                  {Object.entries(comment.reactions).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      className="reaction-btn"
                      onClick={() => handleReaction(comment.id, emoji)}
                    >
                      {emoji} {count}
                    </button>
                  ))}
                </div>
              )}

              {!comment.isDeleted && (
                <div className="reaction-picker">
                  {emojis.slice(0, 6).map(emoji => (
                    <button
                      key={emoji}
                      className="emoji-btn"
                      onClick={() => handleReaction(comment.id, emoji)}
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="comment-input-container">
          <div className="comment-avatar">{currentUser.avatar}</div>
          <div className="comment-input-wrapper">
            <div className="formatting-toolbar">
              <button type="button" onClick={() => handleFormatting('bold')} title="Bold">
                <strong>B</strong>
              </button>
              <button type="button" onClick={() => handleFormatting('italic')} title="Italic">
                <em>I</em>
              </button>
              <button type="button" onClick={() => handleFormatting('code')} title="Inline Code">
                {'</>'}
              </button>
              <button type="button" onClick={() => handleFormatting('codeblock')} title="Code Block">
                📝
              </button>
              <button type="button" onClick={() => handleFormatting('bullet')} title="Bullet Point">
                •
              </button>
            </div>

            <div 
              className={`textarea-container ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Leave a comment... Use @ to mention team members"
                className="comment-input"
                rows="3"
                disabled={isSubmitting}
              />
              {dragActive && (
                <div className="drag-overlay">
                  Drop files here to attach
                </div>
              )}
            </div>

            {selectedFiles.length > 0 && (
              <div className="selected-files">
                {selectedFiles.map(file => (
                  <div key={file.id} className="selected-file">
                    <span className="file-info">
                      📎 {file.name} ({file.size})
                    </span>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => removeFile(file.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showMentionSuggestions && filteredMembers.length > 0 && (
              <div className="mention-suggestions">
                {filteredMembers.map(member => (
                  <div
                    key={member.id}
                    className="mention-suggestion"
                    onClick={() => handleMentionSelect(member)}
                  >
                    <span className="mention-avatar">{member.avatar}</span>
                    <div className="mention-info">
                      <span className="mention-name">{member.name}</span>
                      <span className="mention-email">{member.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="comment-actions">
          <div className="comment-tools">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <button 
              type="button" 
              className="tool-button" 
              onClick={() => fileInputRef.current?.click()}
              title="Add attachment"
            >
              📎
            </button>
            <div className="emoji-picker-container" ref={emojiPickerRef}>
              <button 
                type="button" 
                className="tool-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Add emoji"
              >
                😀
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      className="emoji-option"
                      onClick={() => {
                        setNewComment(newComment + emoji)
                        setShowEmojiPicker(false)
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {comments.length === 0 && (
        <div className="empty-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
