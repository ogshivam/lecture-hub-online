
import React from 'react';
import Navbar from './Navbar';
import { useApi } from '@/contexts/ApiContext';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false,
  adminOnly = false
}) => {
  const { isAuthenticated, isAdmin } = useApi();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        {children}
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Online Coaching Platform Prototype
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
