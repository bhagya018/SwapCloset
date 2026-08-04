import React from 'react';
import AppLayout from '@/components/AppLayout';
import ItemDetailClient from './components/ItemDetailClient';

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayout activePath="/listings">
      <ItemDetailClient listingId={id} />
    </AppLayout>
  );
}
