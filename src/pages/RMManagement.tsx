
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RMList from '@/components/relationship-managers/RMList';
import AddRMForm from '@/components/relationship-managers/AddRMForm';

const RMManagement = () => {
  return (
    <MainLayout requireAuth adminOnly>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relationship Managers</h1>
          <p className="text-muted-foreground mt-2">
            Manage relationship managers and track their client referrals
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RMList />
          </div>
          <div>
            <AddRMForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RMManagement;
