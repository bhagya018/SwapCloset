import React from 'react';
import AppLayout from '@/components/AppLayout';
import SwapRequestsFeed from '../user-dashboard/components/SwapRequestsFeed';

export default function SwapRequestsPage() {
  return (
    <AppLayout activePath="/swap-requests">
      <div className="p-6">
        <h1 className="text-2xl font-700 text-foreground mb-4">Swap Requests</h1>
        <SwapRequestsFeed />
      </div>
    </AppLayout>
  );
}
