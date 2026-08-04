import React from 'react';
import AppLayout from '@/components/AppLayout';
import AboutClient from './components/AboutClient';

export default function AboutPage() {
  return (
    <AppLayout activePath="/about">
      <AboutClient />
    </AppLayout>
  );
}
