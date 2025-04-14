
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, currentUser, logout } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <BookOpen className="h-6 w-6" />
            <span>LectureHub</span>
          </Link>
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
              <Link to="/courses" className="text-sm font-medium hover:underline">
                Courses
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium hover:underline">
                  Admin Panel
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:block">
                <span className="text-sm font-medium">
                  {isAdmin ? 'Admin' : 'Student'}: {user?.email}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <Button variant="default" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
