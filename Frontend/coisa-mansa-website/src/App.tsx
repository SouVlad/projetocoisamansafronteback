import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

// Public Pages
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { AgendaPage } from '@/pages/public/AgendaPage';
import { GalleryPage } from '@/pages/public/GalleryPage';
import MerchPage from '@/pages/public/MerchPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { ProfilePage } from '@/pages/public/ProfilePage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminEventsPage } from '@/pages/admin/AdminEventsPage';
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage';
import { AdminAlbumsPage } from '@/pages/admin/AdminAlbumsPage';
import { AdminMerchPage } from '@/pages/admin/AdminMerchPage';
import { AdminNewsPage } from '@/pages/admin/AdminNewsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Wait for auth check to complete
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">A carregar...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/contactos" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      
      {/* Protected Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/agenda" 
        element={
          <ProtectedRoute>
            <AdminEventsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/galeria" 
        element={
          <ProtectedRoute>
            <AdminGalleryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/albuns" 
        element={
          <ProtectedRoute>
            <AdminAlbumsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/merch" 
        element={
          <ProtectedRoute>
            <AdminMerchPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/noticias" 
        element={
          <ProtectedRoute>
            <AdminNewsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/utilizadores" 
        element={
          <ProtectedRoute>
            <AdminUsersPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;