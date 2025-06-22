
import React, { useState } from 'react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'
import Deadlines from './Deadlines'

export default function Dashboard() {
  const [currentUser] = useState({ 
    id: 1, 
    name: 'John Smith', 
    role: 'manager',
    department: 'Engineering'
  })
  
  const [dashboardData] = useState({
    stats: {
      totalTasks: 156,
      completedTasks: 89,
      pendingTasks: 45,
      overdueTasks: 12,
      teamMembers: 8,
      activeProjects: 5
    },
    teamMatrix: [
      { name: 'Sarah Wilson', role: 'Senior Dev', activeTasks: 8, completionRate: 92, status: 'active' },
      { name: 'Mike Johnson', role: 'Backend Dev', activeTasks: 6, completionRate: 88, status: 'active' },
      { name: 'Emily Davis', role: 'Frontend Dev', activeTasks: 4, completionRate: 95, status: 'active' },
      { name: 'Alex Turner', role: 'DevOps', activeTasks: 3, completionRate: 78, status: 'busy' }
    ],
    riskyTasks: [
      { id: 1, title: 'Database Migration', risk: 'high', reason: 'Overdue by 3 days', assignee: 'John Smith' },
      { id: 2, title: 'Security Audit', risk: 'medium', reason: 'Complex dependencies', assignee: 'Emily Davis' },
      { id: 3, title: 'API Integration', risk: 'low', reason: 'New technology stack', assignee: 'Mike Johnson' }
    ],
    approvalsPending: [
      { id: 1, title: 'Budget Approval Q1', requestedBy: 'Emily Davis', daysWaiting: 2 },
      { id: 2, title: 'New Hire Request', requestedBy: 'HR Team', daysWaiting: 5 },
      { id: 3, title: 'Security Policy Update', requestedBy: 'Security Team', daysWaiting: 1 }
    ],
    pinnedTasks: [
      { id: 1, title: 'Sprint Planning', priority: 'high', dueDate: '2024-01-20' },
      { id: 2, title: 'Code Review', priority: 'medium', dueDate: '2024-01-22' }
    ],
    chartData: {
      taskCompletion: [
        { name: 'Mon', completed: 12, pending: 8 },
        { name: 'Tue', completed: 15, pending: 6 },
        { name: 'Wed', completed: 10, pending: 12 },
        { name: 'Thu', completed: 18, pending: 4 },
        { name: 'Fri', completed: 14, pending: 9 },
        { name: 'Sat', completed: 8, pending: 3 },
        { name: 'Sun', completed: 6, pending: 2 }
      ],
      priorityDistribution: [
        { name: 'High', value: 25, color: '#e74c3c' },
        { name: 'Medium', value: 45, color: '#f39c12' },
        { name: 'Low', value: 30, color: '#27ae60' }
      ]
    }
  })

  const isManager = currentUser.role === 'manager' || currentUser.role === 'admin'

  const handleExportData = (format) => {
    console.log(`Exporting dashboard data as ${format}`)
    // Implementation for CSV/XLS export
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {currentUser.name}!</h1>
          <p>Here's what's happening in your workspace today</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <input type="text" placeholder="Global search..." className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
          <div className="export-dropdown">
            <button className="btn-secondary dropdown-toggle">Export Data</button>
            <div className="dropdown-menu">
              <button onClick={() => handleExportData('csv')}>Export as CSV</button>
              <button onClick={() => handleExportData('xlsx')}>Export as Excel</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          title="Total Tasks"
          value={dashboardData.stats.totalTasks}
          change={12}
          icon="📋"
        />
        <StatsCard
          title="Completed"
          value={dashboardData.stats.completedTasks}
          change={8}
          icon="✅"
        />
        <StatsCard
          title="Pending"
          value={dashboardData.stats.pendingTasks}
          change={-3}
          icon="⏳"
        />
        <StatsCard
          title="Overdue"
          value={dashboardData.stats.overdueTasks}
          change={-2}
          icon="⚠️"
        />
        {isManager && (
          <>
            <StatsCard
              title="Team Members"
              value={dashboardData.stats.teamMembers}
              change={1}
              icon="👥"
            />
            <StatsCard
              title="Active Projects"
              value={dashboardData.stats.activeProjects}
              change={0}
              icon="🚀"
            />
          </>
        )}
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <div className="dashboard-left">
          {/* Employee View Components */}
          <div className="dashboard-section">
            <h2>My Tasks</h2>
            <TaskList tasks={dashboardData.pinnedTasks} />
          </div>

          <div className="dashboard-section">
            <h2>Calendar & Reminders</h2>
            <CalendarWidget />
          </div>

          {/* Manager Additional Components */}
          {isManager && (
            <>
              <div className="dashboard-section">
                <h2>Team Matrix</h2>
                <TeamMatrix members={dashboardData.teamMatrix} />
              </div>

              <div className="dashboard-section">
                <h2>Risky Tasks</h2>
                <RiskyTasksList tasks={dashboardData.riskyTasks} />
              </div>
            </>
          )}
        </div>

        <div className="dashboard-right">
          <div className="dashboard-section">
            <h2>Activity Trends</h2>
            <ActivityChart data={dashboardData.chartData.taskCompletion} />
          </div>

          <div className="dashboard-section">
            <h2>Priority Distribution</h2>
            <PriorityChart data={dashboardData.chartData.priorityDistribution} />
          </div>

          <div className="dashboard-section">
            <h2>Pending Approvals</h2>
            <ApprovalsList approvals={dashboardData.approvalsPending} />
          </div>

          <RecentActivity />
          <Deadlines />
        </div>
      </div>
    </div>
  )
}

function TaskList({ tasks }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <div className="task-info">
            <h4>{task.title}</h4>
            <span className="task-due">Due: {task.dueDate}</span>
          </div>
          <span className={`priority-badge ${task.priority}`}>
            {task.priority}
          </span>
        </div>
      ))}
    </div>
  )
}

function CalendarWidget() {
  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <h4>January 2024</h4>
        <div className="calendar-nav">
          <button>‹</button>
          <button>›</button>
        </div>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day-names">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-name">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {Array.from({ length: 31 }, (_, i) => (
            <div key={i + 1} className={`calendar-day ${i + 1 === 15 ? 'today' : ''}`}>
              {i + 1}
              {i + 1 === 20 && <span className="task-dot high"></span>}
              {i + 1 === 22 && <span className="task-dot medium"></span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeamMatrix({ members }) {
  return (
    <div className="team-matrix">
      {members.map((member, index) => (
        <div key={index} className="team-member-card">
          <div className="member-info">
            <h4>{member.name}</h4>
            <span className="member-role">{member.role}</span>
          </div>
          <div className="member-stats">
            <div className="stat">
              <span className="stat-label">Active Tasks</span>
              <span className="stat-value">{member.activeTasks}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Completion Rate</span>
              <span className="stat-value">{member.completionRate}%</span>
            </div>
          </div>
          <span className={`member-status ${member.status}`}>
            {member.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function RiskyTasksList({ tasks }) {
  return (
    <div className="risky-tasks">
      {tasks.map(task => (
        <div key={task.id} className="risky-task-item">
          <span className={`risk-indicator ${task.risk}`}>
            {task.risk === 'high' ? '🔴' : task.risk === 'medium' ? '🟡' : '🟢'}
          </span>
          <div className="task-info">
            <h4>{task.title}</h4>
            <p>{task.reason}</p>
            <span className="assignee">Assigned to: {task.assignee}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActivityChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.completed + d.pending))
  
  return (
    <div className="activity-chart">
      <div className="chart-bars">
        {data.map((day, index) => (
          <div key={index} className="chart-bar-group">
            <div className="chart-bars-container">
              <div 
                className="chart-bar completed"
                style={{ height: `${(day.completed / maxValue) * 100}%` }}
                title={`Completed: ${day.completed}`}
              ></div>
              <div 
                className="chart-bar pending"
                style={{ height: `${(day.pending / maxValue) * 100}%` }}
                title={`Pending: ${day.pending}`}
              ></div>
            </div>
            <span className="chart-label">{day.name}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color completed"></span>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-color pending"></span>
          <span>Pending</span>
        </div>
      </div>
    </div>
  )
}

function PriorityChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="priority-chart">
      <div className="pie-chart">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          return (
            <div key={index} className="pie-segment" style={{ 
              '--percentage': `${percentage}%`,
              '--color': item.color
            }}>
              <span className="segment-label">{item.name}: {item.value}</span>
            </div>
          )
        })}
      </div>
      <div className="chart-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: item.color }}></span>
            <span>{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApprovalsList({ approvals }) {
  return (
    <div className="approvals-list">
      {approvals.map(approval => (
        <div key={approval.id} className="approval-item">
          <div className="approval-info">
            <h4>{approval.title}</h4>
            <span className="requester">Requested by: {approval.requestedBy}</span>
          </div>
          <div className="approval-status">
            <span className="waiting-time">{approval.daysWaiting} days</span>
            <div className="approval-actions">
              <button className="btn-approve">✓</button>
              <button className="btn-reject">✗</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
