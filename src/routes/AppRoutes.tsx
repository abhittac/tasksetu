
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import DashboardLayout from '../layouts/DashboardLayout';
import LoadingSpinner from '../components/UI/LoadingSpinner';

// Lazy loaded components
const Dashboard = loadable(() => import('../pages/Dashboard'));
const AllTasks = loadable(() => import('../pages/AllTasks'));
const TaskDetail = loadable(() => import('../pages/TaskDetail'));
const ApprovalManager = loadable(() => import('../pages/ApprovalManager'));
const MilestoneManager = loadable(() => import('../pages/MilestoneManager'));
const RecurringTasks = loadable(() => import('../pages/RecurringTasks'));
const Analytics = loadable(() => import('../pages/Analytics'));
const NotificationCenter = loadable(() => import('../pages/NotificationCenter'));
const ActivityFeed = loadable(() => import('../pages/ActivityFeed'));
const Deadlines = loadable(() => import('../pages/Deadlines'));
const StatusManager = loadable(() => import('../pages/StatusManager'));
const PriorityManager = loadable(() => import('../pages/PriorityManager'));

const AppRoutes: React.FC = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/all-tasks" element={<AllTasks />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/approvals" element={<ApprovalManager />} />
          <Route path="/milestones" element={<MilestoneManager />} />
          <Route path="/recurring-tasks" element={<RecurringTasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/activity" element={<ActivityFeed />} />
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="/status-manager" element={<StatusManager />} />
          <Route path="/priority-manager" element={<PriorityManager />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
};

export default AppRoutes;
