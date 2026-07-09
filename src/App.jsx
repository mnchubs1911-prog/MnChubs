import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/ui/Loader.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute.jsx';
import { useAuthStore } from './store/authStore.js';
import { useThemeStore } from './store/themeStore.js';

// Lazy Pages
const Home = React.lazy(() => import('./pages/Home.jsx'));
const Login = React.lazy(() => import('./pages/auth/Login.jsx'));
const Register = React.lazy(() => import('./pages/auth/Register.jsx'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const ResourceList = React.lazy(() => import('./pages/resources/ResourceList.jsx'));
const ResourceDetail = React.lazy(() => import('./pages/resources/ResourceDetail.jsx'));
const UploadResource = React.lazy(() => import('./pages/resources/UploadResource.jsx'));
const CommunityHub = React.lazy(() => import('./pages/community/CommunityHub.jsx'));
const PlacementHub = React.lazy(() => import('./pages/placements/PlacementHub.jsx'));
const ResearchHub = React.lazy(() => import('./pages/research/ResearchHub.jsx'));
const CollegeInfo = React.lazy(() => import('./pages/college/CollegeInfo.jsx'));
const Marketplace = React.lazy(() => import('./pages/marketplace/Marketplace.jsx'));
const Profile = React.lazy(() => import('./pages/Profile.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard.jsx'));

function App() {
  const { checkAuth } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, [checkAuth, initializeTheme]);

  return (
    <Suspense fallback={<Loader fullPage />}>
      <Routes>
        {/* Main Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/resources/:slug" element={<ResourceDetail />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/placements" element={<PlacementHub />} />
          <Route path="/research" element={<ResearchHub />} />
          <Route path="/college" element={<CollegeInfo />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Route>

        {/* Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources/upload" element={<UploadResource />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
