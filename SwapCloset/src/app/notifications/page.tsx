import React from 'react';
import AppLayout from '@/components/AppLayout';
import NotificationsClient from './components/NotificationsClient';

export default function NotificationsPage() {
  return (
    <AppLayout activePath="/notifications">
      <NotificationsClient />
    </AppLayout>
  );
}
