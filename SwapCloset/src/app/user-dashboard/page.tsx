import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardClient from './components/DashboardClient';

export default function UserDashboardPage() {
  return (
    <AppLayout activePath="/user-dashboard">
      <DashboardClient />
    </AppLayout>
  );
}
