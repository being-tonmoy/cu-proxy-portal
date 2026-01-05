import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Box from '@mui/material/Box';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import BackgroundDesign from './components/BackgroundDesign';
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';
import NotFound from './pages/NotFound';
import { createAdminUser, getUserByEmail } from './services/firestoreService';
import './App.css';
// Component to initialize superadmin user
const InitializeAdmin = () => {
  useEffect(() => {
    initializeSuperAdmin();
  }, []);

  const initializeSuperAdmin = async () => {
    try {
      const superAdminExists = await getUserByEmail('superadmin@cu.ac.bd');
      if (!superAdminExists) {
        await createAdminUser({
          email: 'superadmin@cu.ac.bd',
          password: 'super@2026',
          name: 'Super Administrator',
          role: 'superadmin'
        });
        console.log('SuperAdmin user created');
      }
    } catch (error) {
      console.log('SuperAdmin already exists or initialization skipped');
    }
  };

  return null;
};

function AppRoutes() {
  // const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <BackgroundDesign />
      <Header />
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Routes>
          {PublicRoutes}
          {AdminRoutes}
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <InitializeAdmin />
            <AppRoutes />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
