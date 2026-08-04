'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import KPIBentoGrid from './KPIBentoGrid';
import MyListingsTable from './MyListingsTable';
import SwapRequestsFeed from './SwapRequestsFeed';
import ActivityFeed from './ActivityFeed';
import SustainabilityCard from './SustainabilityCard';
import { Skeleton } from '@/components/ui/LoadingSkeleton';

const SwapActivityChart = dynamic(() => import('./SwapActivityChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[280px] w-full rounded-2xl" />,
});

const ValueBalanceChart = dynamic(() => import('./ValueBalanceChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[240px] w-full rounded-2xl" />,
});

type DashboardTab = 'listings' | 'requests';

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<DashboardTab>('listings');
  const listingsSectionRef = React.useRef<HTMLDivElement>(null);
  const [shouldScrollToListings, setShouldScrollToListings] = useState(false);

  // Set active tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const scrollParam = searchParams.get('scroll');
    if (tabParam === 'listings' || tabParam === 'requests') {
      setActiveTab(tabParam);
      // Scroll if explicitly requested via URL parameter
      if (tabParam === 'listings' && scrollParam === 'true') {
        setShouldScrollToListings(true);
      }
    }
  }, [searchParams]);

  // Scroll to listings section when flag is set
  useEffect(() => {
    if (shouldScrollToListings && activeTab === 'listings' && listingsSectionRef.current) {
      setTimeout(() => {
        listingsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setShouldScrollToListings(false);
      }, 100);
    }
  }, [shouldScrollToListings, activeTab]);

  return (
    <div className="fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-700 text-foreground mb-1">My Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, Maya — 3 swap requests need your attention
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full">
            Portland, OR · Updated just now
          </span>
        </div>
      </div>

      {/* KPI bento grid */}
      <KPIBentoGrid />

      {/* Main content — 2 column layout on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        {/* Left / main column — takes 2/3 */}
        <div className="xl:col-span-2 2xl:col-span-2 space-y-6">
          {/* Activity chart */}
          <SwapActivityChart />

          {/* Tab section: My Listings / Swap Requests */}
          <div ref={listingsSectionRef}>
            <div className="flex bg-muted rounded-xl p-1 mb-5 w-fit">
              {(
                [
                  { key: 'listings', label: 'My Listings' },
                  { key: 'requests', label: 'Swap Requests' },
                ] as { key: DashboardTab; label: string }[]
              ).map((tab) => (
                <button
                  key={`dash-tab-${tab.key}`}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-600 transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-card text-foreground shadow-card'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'requests' && (
                    <span className="ml-2 bg-accent text-accent-foreground text-[10px] font-700 rounded-full px-1.5 py-0.5">
                      3
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'listings' ? <MyListingsTable /> : <SwapRequestsFeed />}
          </div>
        </div>

        {/* Right sidebar column — takes 1/3 */}
        <div className="xl:col-span-1 2xl:col-span-1 space-y-5">
          {/* Value balance chart */}
          <ValueBalanceChart />

          {/* Activity feed */}
          <ActivityFeed />

          {/* Sustainability card */}
          <SustainabilityCard />
        </div>
      </div>
    </div>
  );
}
