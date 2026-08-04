import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdminClient from './components/AdminClient';

export default function AdminPage() {
  return (
    <AppLayout activePath="/admin">
      <AdminClient />
    </AppLayout>
  );
}
