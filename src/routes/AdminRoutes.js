import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/student-information-form/admin/AdminDashboard';
import AdminSetup from '../pages/student-information-form/admin/AdminSetup';
import UserManagement from '../pages/student-information-form/admin/UserManagement';
import SubmissionManagement from '../pages/student-information-form/admin/SubmissionManagement';

const adminRoutes = [
  <Route
    key="dashboard"
    path="/student-information-form/admin/dashboard"
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="setup"
    path="/student-information-form/admin/setup"
    element={
      <ProtectedRoute requiredRole="superadmin">
        <AdminSetup />
      </ProtectedRoute>
    }
  />,
  <Route
    key="users"
    path="/student-information-form/admin/users"
    element={
      <ProtectedRoute requiredRole="superadmin">
        <UserManagement />
      </ProtectedRoute>
    }
  />,
  <Route
    key="submissions"
    path="/student-information-form/admin/submissions"
    element={
      <ProtectedRoute requiredRole="admin">
        <SubmissionManagement />
      </ProtectedRoute>
    }
  />,
];

export default adminRoutes;
