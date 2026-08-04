import React from 'react';
import AppLayout from '@/components/AppLayout';
import ContactClient from './components/ContactClient';

export default function ContactPage() {
  return (
    <AppLayout activePath="/contact">
      <ContactClient />
    </AppLayout>
  );
}
