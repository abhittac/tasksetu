
import React from 'react'

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">T</div>
          <span>TaskGuru</span>
        </div>
        <div className="user-info">
          <span>undefined undefined</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-label">MAIN</span>
          <ul>
            <li className="nav-item active">
              <span className="nav-icon">🏠</span>
              Dashboard
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
