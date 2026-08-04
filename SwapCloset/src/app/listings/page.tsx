import React from 'react';
import AppLayout from '@/components/AppLayout';
import ListingsPageClient from '@/app/clothing-listings-page/components/ListingsPageClient';

export default function ListingsPage() {
  return (
    <AppLayout activePath="/listings">
      <ListingsPageClient />
    </AppLayout>
  );
}
