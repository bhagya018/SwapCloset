import React from 'react';
import AppLayout from '@/components/AppLayout';
import ListingsPageClient from './components/ListingsPageClient';

export default function ClothingListingsPage() {
  return (
    <AppLayout activePath="/clothing-listings-page">
      <ListingsPageClient />
    </AppLayout>
  );
}
