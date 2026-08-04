import React from 'react';
import AppLayout from '@/components/AppLayout';
import FavoritesClient from './components/FavoritesClient';

export default function FavoritesPage() {
  return (
    <AppLayout activePath="/favorites">
      <FavoritesClient />
    </AppLayout>
  );
}
