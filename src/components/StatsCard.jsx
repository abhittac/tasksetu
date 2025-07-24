
import React from 'react'

export default function StatsCard({ title, value, subtitle, percentage, trend, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  }

  const trendClasses = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        {/* Left side - Content */}
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color] || colorClasses.blue} flex items-center justify-center`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        
        {/* Right side - Count */}
        <div className="text-right">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${trendClasses[trend] || trendClasses.neutral}`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {percentage}
          </div>
        </div>
      </div>
    </div>
  )
}
