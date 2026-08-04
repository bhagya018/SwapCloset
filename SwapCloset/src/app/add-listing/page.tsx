import React from 'react';
import AppLayout from '@/components/AppLayout';
import AddListingClient from './components/AddListingClient';

export default function AddListingPage() {
  return (
    <AppLayout activePath="/add-listing">
      <AddListingClient />
    </AppLayout>
  );
}
