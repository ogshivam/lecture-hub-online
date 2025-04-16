
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ApiProvider } from "@/contexts/ApiContext";
import { useEffect } from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LectureDetail from "./pages/LectureDetail";
import AdminPanel from "./pages/AdminPanel";
import CourseManagement from "./pages/CourseManagement";
import LectureManagement from "./pages/LectureManagement";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";

// Enable direct admin access during development
const AdminAccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If URL contains /admin, set the admin user in localStorage
    if (location.pathname.includes('/admin') && process.env.NODE_ENV === 'development') {
      const adminUser = {
        id: '1',
        username: 'admin',
        password: 'admin',
        role: 'admin'
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      
      // If we're on the login page, redirect to admin panel
      if (location.pathname === '/login') {
        navigate('/admin');
      }
    }
  }, [location, navigate]);
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApiProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminAccessWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/lectures/:id" element={<LectureDetail />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/courses/:id" element={<CourseManagement />} />
              <Route path="/admin/lectures/:id" element={<LectureManagement />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminAccessWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </ApiProvider>
  </QueryClientProvider>
);

export default App;
