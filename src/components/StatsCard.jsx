
import React from 'react'

export default function StatsCard({ title, value, subtitle, percentage, trend }) {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-title">{title}</span>
        <span className={`stats-percentage ${trend}`}>{percentage}</span>
      </div>
      <div className="stats-value">{value}</div>
      <div className="stats-subtitle">{subtitle}</div>
    </div>
  )
}
