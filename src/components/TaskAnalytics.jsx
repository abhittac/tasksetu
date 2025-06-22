
import React from 'react'

export default function TaskAnalytics() {
  const analyticsData = {
    totalTasks: 156,
    completedTasks: 89,
    inProgressTasks: 45,
    pendingTasks: 22,
    overdueTasks: 8
  }

  const completionRate = Math.round((analyticsData.completedTasks / analyticsData.totalTasks) * 100)

  return (
    <div className="task-analytics">
      <div className="page-header">
        <h1>Task Analytics</h1>
        <p>Insights and performance metrics for your tasks</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">📊</div>
          <div className="analytics-content">
            <h3>Total Tasks</h3>
            <div className="analytics-value">{analyticsData.totalTasks}</div>
            <div className="analytics-trend">+12% from last month</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">✅</div>
          <div className="analytics-content">
            <h3>Completed</h3>
            <div className="analytics-value">{analyticsData.completedTasks}</div>
            <div className="analytics-trend">+8% completion rate</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">🔄</div>
          <div className="analytics-content">
            <h3>In Progress</h3>
            <div className="analytics-value">{analyticsData.inProgressTasks}</div>
            <div className="analytics-trend">28% of total tasks</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">⏳</div>
          <div className="analytics-content">
            <h3>Pending</h3>
            <div className="analytics-value">{analyticsData.pendingTasks}</div>
            <div className="analytics-trend">14% of total tasks</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">⚠️</div>
          <div className="analytics-content">
            <h3>Overdue</h3>
            <div className="analytics-value">{analyticsData.overdueTasks}</div>
            <div className="analytics-trend">Needs attention</div>
          </div>
        </div>

        <div className="analytics-card completion-rate">
          <div className="analytics-content">
            <h3>Completion Rate</h3>
            <div className="completion-circle">
              <div className="completion-percentage">{completionRate}%</div>
            </div>
            <div className="analytics-trend">Great progress!</div>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-section">
          <h3>Task Distribution by Priority</h3>
          <div className="priority-chart">
            <div className="priority-bar">
              <div className="priority-label">High Priority</div>
              <div className="priority-progress">
                <div className="priority-fill high" style={{width: '35%'}}></div>
              </div>
              <div className="priority-count">35%</div>
            </div>
            <div className="priority-bar">
              <div className="priority-label">Medium Priority</div>
              <div className="priority-progress">
                <div className="priority-fill medium" style={{width: '45%'}}></div>
              </div>
              <div className="priority-count">45%</div>
            </div>
            <div className="priority-bar">
              <div className="priority-label">Low Priority</div>
              <div className="priority-progress">
                <div className="priority-fill low" style={{width: '20%'}}></div>
              </div>
              <div className="priority-count">20%</div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Team Performance</h3>
          <div className="team-stats">
            <div className="team-member">
              <div className="member-name">John Smith</div>
              <div className="member-tasks">24 tasks completed</div>
              <div className="member-rate">95% completion rate</div>
            </div>
            <div className="team-member">
              <div className="member-name">Sarah Wilson</div>
              <div className="member-tasks">18 tasks completed</div>
              <div className="member-rate">88% completion rate</div>
            </div>
            <div className="team-member">
              <div className="member-name">Mike Johnson</div>
              <div className="member-tasks">21 tasks completed</div>
              <div className="member-rate">92% completion rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
