import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardClient from './components/DashboardClient';
import { Skeleton } from '@/components/ui/LoadingSkeleton';

export default function UserDashboardPage() {
  return (
    <AppLayout activePath="/user-dashboard">
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-2xl" />}>
        <DashboardClient />
      </Suspense>
    </AppLayout>
  );
}
