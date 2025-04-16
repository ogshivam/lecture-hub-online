
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';
import { TrendingUp } from 'lucide-react';

const Login = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-8 w-full max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
