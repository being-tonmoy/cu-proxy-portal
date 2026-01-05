import React from 'react';
import { Route } from 'react-router-dom';
import FormPage from '../pages/FormPage';
import LoginPage from '../pages/LoginPage';

const publicRoutes = [
  <Route key="login" path="/admin/login" element={<LoginPage />} />,
  <Route key="form" path="/" element={<FormPage />} />,
];

export default publicRoutes;
