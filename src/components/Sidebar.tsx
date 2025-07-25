
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

interface SidebarProps {
  onCreateTask?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateTask }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuSection[] = [
    {
      section: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
        { id: "all-tasks", label: "All Tasks", icon: "📋", path: "/all-tasks" },
        { id: "deadlines", label: "Deadlines", icon: "⏰", path: "/deadlines" },
      ],
    },
    {
      section: "Management",
      items: [
        { id: "recurring-tasks", label: "Recurring Tasks", icon: "🔄", path: "/recurring-tasks" },
        { id: "approvals", label: "Approvals", icon: "✅", path: "/approvals" },
        { id: "milestones", label: "Milestones", icon: "🏁", path: "/milestones" },
        { id: "status-manager", label: "Status Manager", icon: "🏷️", path: "/status-manager" },
        { id: "priority-manager", label: "Priority Manager", icon: "🎯", path: "/priority-manager" },
      ],
    },
    {
      section: "Insights",
      items: [
        { id: "analytics", label: "Analytics", icon: "📈", path: "/analytics" },
        { id: "activity", label: "Activity Feed", icon: "🔔", path: "/activity" },
        { id: "notifications", label: "Notifications", icon: "📢", path: "/notifications" },
      ],
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.id === "create-task" && onCreateTask) {
      onCreateTask();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname === path.replace('/', '');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="text-xl font-bold text-gray-900">TaskFlow Pro</h1>
        <p className="text-sm text-white mt-1">Task Management System</p>
      </div>

      <nav className="sidebar-content">
        {menuItems.map((section) => (
          <div key={section.section} className="nav-section">
            <h3 className="nav-section-title">{section.section}</h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`nav-item w-full text-left ${
                      item.path && isActive(item.path)
                        ? "active"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-500 truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
