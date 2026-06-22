import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

// Page Imports
import { LandingPage } from '../pages/Landing';
import { LoginPage } from '../pages/Login';
import { DashboardPage } from '../pages/Dashboard';
import { ReportWastePage } from '../pages/ReportWaste';
import { ImpactDashboardPage } from '../pages/ImpactDashboard';
import { AdminDashboardPage } from '../pages/AdminDashboard';
import { MyReportsPage } from '../pages/MyReports';

// Layout Imports
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Protected Route helper to ensure authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-emerald-400">
        <div className="animate-pulse font-heading text-lg font-bold">Initializing TerraWatch Auth...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

// Admin Route helper to ensure role authorization (ADMIN or MUNICIPALITY)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-emerald-400">
        <div className="animate-pulse font-heading text-lg font-bold">Validating Clearance...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.role !== 'ADMIN' && user.role !== 'MUNICIPALITY') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.LANDING}
        element={
          <MainLayout>
            <LandingPage />
          </MainLayout>
        }
      />
      <Route
        path={ROUTES.LOGIN}
        element={
          <MainLayout>
            <LoginPage />
          </MainLayout>
        }
      />
      <Route
        path={ROUTES.IMPACT}
        element={
          <MainLayout>
            <ImpactDashboardPage />
          </MainLayout>
        }
      />

      {/* Protected Volunteer Workspace Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.REPORT_WASTE}
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReportWastePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
  path={ROUTES.MY_REPORTS}
  element={
    <ProtectedRoute>
      <MainLayout>
        <MyReportsPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>

      {/* Authorized Municipal Operations Routes */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
};
export default AppRoutes;
