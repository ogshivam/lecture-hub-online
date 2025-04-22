
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const MainLayout = ({ 
  children, 
  requireAuth = false, 
  adminOnly = false 
}: MainLayoutProps) => {
  const location = useLocation();
  
  // Determine if we should apply padding for sidebar
  const withSidebar = location.pathname.includes('/admin');

  // For auth-required routes, wrap with ProtectedRoute
  const content = requireAuth ? (
    <ProtectedRoute adminOnly={adminOnly}>
      {children}
    </ProtectedRoute>
  ) : (
    children
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className={`flex-1 ${withSidebar ? 'md:ml-64' : ''}`}>
        <main className="container py-6 md:py-8">
          {content}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
