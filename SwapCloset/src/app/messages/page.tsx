'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import ChatWindow from '@/components/ChatWindow';

export default function MessagesPage() {
  return (
    <AppLayout activePath="/messages">
      <div className="p-6">
        <h1 className="text-2xl font-700 text-foreground mb-4">Messages</h1>
        <ChatWindow />
      </div>
    </AppLayout>
  );
}
