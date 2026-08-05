import React from 'react';
import AppLayout from '@/components/AppLayout';
import {
  HeroSection,
  FeaturedListings,
  Categories,
  HowItWorks,
  SustainableBenefits,
  Testimonials,
  Statistics,
} from './components/HomeComponents';

export default function HomePage() {
  return (
    <AppLayout activePath="/home">
      <div className="fade-in">
        <HeroSection />
        <Statistics />
        <Categories />
        <FeaturedListings />
        <HowItWorks />
        <SustainableBenefits />
        <Testimonials />
      </div>
    </AppLayout>
  );
}
