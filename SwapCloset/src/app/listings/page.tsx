import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import ListingsPageClient from '@/app/clothing-listings-page/components/ListingsPageClient';
import { Skeleton } from '@/components/ui/LoadingSkeleton';

export default function ListingsPage() {
  return (
    <AppLayout activePath="/listings">
      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-2xl" />}>
        <ListingsPageClient />
      </Suspense>
    </AppLayout>
  );
}
