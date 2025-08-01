
import React, { useState } from "react";

export default function TasksCalendarView({ tasks, onTaskClick, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month, week, day
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter tasks to show only upcoming tasks (today and future)
  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate >= today;
    });
  };

  const upcomingTasks = getUpcomingTasks();

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return upcomingTasks.filter((task) => task.dueDate === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    if (date) {
      const dateStr = date.toISOString().split("T")[0];
      setSelectedDate(dateStr);
    }
  };

  const handleTaskClick = (task) => {
    onTaskClick(task.id);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "bg-green-100 text-green-800 border-green-300",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      High: "bg-orange-100 text-orange-800 border-orange-300",
      Urgent: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[priority] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getTaskTypeIcon = (task) => {
    if (task.isApprovalTask) return "✅";
    if (task.isRecurring || task.recurringFromTaskId) return "🔁";
    if (task.category === "Milestone" || task.type === "milestone") return "🎯";
    return "📋";
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-container bg-white border border-gray-200 rounded-lg">
      {/* Calendar Header */}
      <div className="calendar-header p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              📅 Tasks Calendar
            </h2>
            <span className="text-sm text-gray-500">
              Showing {upcomingTasks.length} upcoming tasks
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h3 className="text-lg font-medium text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Today
            </button>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="calendar-body p-4">
        {viewMode === "month" && (
          <div className="calendar-grid">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((date, index) => {
                const tasksForDate = getTasksForDate(date);
                const isToday =
                  date && date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[100px] p-2 border border-gray-100 rounded-lg
                      ${date ? "bg-white hover:bg-gray-50 cursor-pointer" : "bg-gray-50"}
                      ${isToday ? "border-blue-500 bg-blue-50" : ""}
                      transition-colors
                    `}
                    onClick={() => handleDateClick(date)}
                    title={
                      date
                        ? `${date.toDateString()} - ${tasksForDate.length} tasks`
                        : ""
                    }
                  >
                    {date && (
                      <>
                        <div
                          className={`text-sm font-medium mb-1 ${isToday ? "text-blue-700" : "text-gray-900"}`}
                        >
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {tasksForDate.map((task) => (
                            <div
                              key={task.id}
                              className={`text-xs px-2 py-1 rounded-md cursor-pointer hover:opacity-80 transition-opacity border ${getPriorityColor(task.priority)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskClick(task);
                              }}
                              title={`${getTaskTypeIcon(task)} ${task.title} - ${task.priority} Priority - Assigned to: ${task.assignee}`}
                            >
                              <div className="flex items-center gap-1">
                                <span>{getTaskTypeIcon(task)}</span>
                                <span className="truncate font-medium">
                                  {task.title}
                                </span>
                              </div>
                              <div className="text-xs opacity-75 mt-1">
                                {task.assignee
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            </div>
                          ))}
                          {tasksForDate.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{tasksForDate.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="week-view">
            <div className="text-center text-gray-500 mb-4">
              Week view coming soon...
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <div className="day-view">
            <div className="text-center text-gray-500 mb-4">
              Day view coming soon...
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="calendar-footer p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span>Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Low</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Click on tasks to view details
          </div>
        </div>
      </div>
    </div>
  );
}
