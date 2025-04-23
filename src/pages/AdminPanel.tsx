
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const AdminPanel = () => {
  return (
    <MainLayout requireAuth adminOnly>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        </div>
        
        {/* Admin content */}
        <div className="grid gap-4">
          <p>Admin dashboard content</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
