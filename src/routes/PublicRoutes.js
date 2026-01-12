import React from 'react';
import { Route } from 'react-router-dom';
import FormPage from '../pages/FormPage';
import LoginPage from '../pages/LoginPage';
import ComplaintsPage from '../pages/ComplaintsPage';

const publicRoutes = [
  <Route key="login" path="/admin/login" element={<LoginPage />} />,
  <Route key="form" path="/" element={<FormPage />} />,
  <Route key="complaints" path="/complaints" element={<ComplaintsPage />} />,
];

export default publicRoutes;
