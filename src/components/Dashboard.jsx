
import React from 'react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'
import Deadlines from './Deadlines'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Home</h1>
          <p>Welcome back!</p>
        </div>
        <div className="date-info">
          <span>Today</span>
          <span>Jun 22</span>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <StatsCard 
            title="Total Tasks" 
            value="156" 
            subtitle="Active tasks in system" 
            percentage="+8%" 
            trend="up"
          />
          <StatsCard 
            title="Completed" 
            value="89" 
            subtitle="Tasks finished this month" 
            percentage="+4%" 
            trend="up"
          />
          <StatsCard 
            title="Active Users" 
            value="34" 
            subtitle="Registered users" 
            percentage="+8%" 
            trend="up"
          />
          <StatsCard 
            title="Projects" 
            value="12" 
            subtitle="Active projects" 
            percentage="+6%" 
            trend="up"
          />
        </div>

        <div className="dashboard-bottom">
          <RecentActivity />
          <Deadlines />
        </div>
      </div>
    </div>
  )
}
