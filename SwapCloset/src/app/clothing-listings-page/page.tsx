import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import ListingsPageClient from './components/ListingsPageClient';
import { Skeleton } from '@/components/ui/LoadingSkeleton';

export default function ClothingListingsPage() {
  return (
    <AppLayout activePath="/clothing-listings-page">
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-2xl" />}>
        <ListingsPageClient />
      </Suspense>
    </AppLayout>
  );
}
