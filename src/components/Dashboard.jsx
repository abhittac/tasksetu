import React from 'react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Tasks',
      value: '1,234',
      subtitle: 'All time',
      percentage: '+12%',
      trend: 'up',
      icon: '📋',
      color: 'blue'
    },
    {
      title: 'Completed',
      value: '856',
      subtitle: 'This month',
      percentage: '+8%',
      trend: 'up',
      icon: '✅',
      color: 'green'
    },
    {
      title: 'In Progress',
      value: '234',
      subtitle: 'Active tasks',
      percentage: '+3%',
      trend: 'up',
      icon: '⏳',
      color: 'yellow'
    },
    {
      title: 'Overdue',
      value: '12',
      subtitle: 'Need attention',
      percentage: '-5%',
      trend: 'down',
      icon: '⚠️',
      color: 'red'
    }
  ]

  const containerStyle = {
    backgroundColor: '#f9fafb',
    minHeight: '100%'
  }

  const headerStyle = {
    marginBottom: '32px'
  }

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    marginBottom: '8px'
  }

  const subtitleStyle = {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  }

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  }

  const activitySectionStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  }

  const activityTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 16px 0'
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard</h1>
        <p style={subtitleStyle}>Welcome back! Here's what's happening with your tasks.</p>
      </div>

      <div style={statsGridStyle}>
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div style={activitySectionStyle}>
        <h2 style={activityTitleStyle}>Recent Activity</h2>
        <RecentActivity />
      </div>
    </div>
  )
}