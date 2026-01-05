import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import AdminSetup from '../pages/AdminSetup';
import UserManagement from '../pages/UserManagement';
import SubmissionManagement from '../pages/SubmissionManagement';

const adminRoutes = [
  <Route
    key="dashboard"
    path="/admin/dashboard"
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="setup"
    path="/admin/setup"
    element={
      <ProtectedRoute requiredRole="superadmin">
        <AdminSetup />
      </ProtectedRoute>
    }
  />,
  <Route
    key="users"
    path="/admin/users"
    element={
      <ProtectedRoute requiredRole="superadmin">
        <UserManagement />
      </ProtectedRoute>
    }
  />,
  <Route
    key="submissions"
    path="/admin/submissions"
    element={
      <ProtectedRoute requiredRole="admin">
        <SubmissionManagement />
      </ProtectedRoute>
    }
  />,
];

export default adminRoutes;
