import React, { useState } from 'react'

export default function TaskComments({ taskId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Smith',
      content: 'I\'ve started working on the database schema migration. The initial analysis shows we need to handle about 2.5M records.',
      timestamp: '2024-01-22 10:30:00',
      avatar: 'JS',
      mentions: [],
      attachments: []
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      content: '@John Smith - Great! Please make sure to backup the data before starting the migration process. Also, have you considered the downtime window?',
      timestamp: '2024-01-22 11:15:00',
      avatar: 'SW',
      mentions: ['John Smith'],
      attachments: []
    },
    {
      id: 3,
      author: 'Mike Johnson',
      content: 'I can help with the testing phase. Let me know when you\'re ready for the staging environment setup.',
      timestamp: '2024-01-22 14:20:00',
      avatar: 'MJ',
      mentions: [],
      attachments: [
        { name: 'test-plan.pdf', size: '245KB', type: 'pdf' }
      ]
    }
  ])

  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 })

  const currentUser = { id: 1, name: 'Current User', avatar: 'CU' }

  // Mock team members for mentions
  const teamMembers = [
    { id: 1, name: 'John Smith', avatar: 'JS' },
    { id: 2, name: 'Sarah Wilson', avatar: 'SW' },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ' },
    { id: 4, name: 'Emily Davis', avatar: 'ED' }
  ]

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
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      avatar: currentUser.avatar,
      mentions,
      attachments: []
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setComments([...comments, comment])
      setNewComment('')

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

  const highlightMentions = (content) => {
    return content.replace(/@(\w+(?:\s+\w+)*)/g, '<span class="mention">@$1</span>')
  }

  return (
    <div className="task-comments">
      <div className="comments-header">
        <h3>Comments ({comments.length})</h3>
      </div>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-avatar">{comment.avatar}</div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-timestamp">{formatTimestamp(comment.timestamp)}</span>
              </div>
              <div 
                className="comment-text"
                dangerouslySetInnerHTML={{ __html: highlightMentions(comment.content) }}
              />
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
              {comment.mentions.length > 0 && (
                <div className="comment-mentions">
                  <span className="mentions-label">Mentioned:</span>
                  {comment.mentions.map((mention, index) => (
                    <span key={index} className="mentioned-user">@{mention}</span>
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
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Add a comment... Use @ to mention team members"
              className="comment-input"
              rows="3"
              disabled={isSubmitting}
            />

            {showMentionSuggestions && filteredMembers.length > 0 && (
              <div className="mention-suggestions">
                {filteredMembers.map(member => (
                  <div
                    key={member.id}
                    className="mention-suggestion"
                    onClick={() => handleMentionSelect(member)}
                  >
                    <span className="mention-avatar">{member.avatar}</span>
                    <span className="mention-name">{member.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="comment-actions">
          <div className="comment-tools">
            <button type="button" className="tool-button" title="Add attachment">
              📎
            </button>
            <button type="button" className="tool-button" title="Add emoji">
              😀
            </button>
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