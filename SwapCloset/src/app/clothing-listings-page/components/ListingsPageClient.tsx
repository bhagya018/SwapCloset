'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  ArrowUpDown,
  ArrowLeftRight,
  Shirt,
} from 'lucide-react';
import { toast } from 'sonner';
import { LISTINGS, SORT_OPTIONS, Listing } from './listingsData';
import ListingCard from './ListingCard';
import FilterSidebar from './FilterSidebar';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';

interface FilterState {
  categories: string[];
  sizes: string[];
  conditions: string[];
  distance: string;
  minValue: number;
  maxValue: number;
  gender: string;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  sizes: [],
  conditions: [],
  distance: 'Any distance',
  minValue: 0,
  maxValue: 500,
  gender: 'All',
};

export default function ListingsPageClient() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest first');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [swapModalListing, setSwapModalListing] = useState<Listing | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [swapMessage, setSwapMessage] = useState('');
  const [offeringValue, setOfferingValue] = useState<number>(0);

  // Load user listings from localStorage
  useEffect(() => {
    const loadListings = () => {
      try {
        const savedListings = JSON.parse(localStorage.getItem('userListings') || '[]');
        console.log('ListingsPage - Loaded user listings:', savedListings.length);
        setUserListings(savedListings);
      } catch (error) {
        console.error('ListingsPage - Error loading listings:', error);
        setUserListings([]);
      }
    };
    
    loadListings();
    // Also listen for storage changes to update when new listings are added
    const handleStorageChange = () => loadListings();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, []);

  // Read search query from URL
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
    
    // Handle nearby filter
    const filterParam = searchParams.get('filter');
    if (filterParam === 'nearby') {
      setFilters((f) => ({ ...f, distance: '10 miles' }));
    }
  }, [searchParams]);

  // Active filter chips
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  filters.categories.forEach((c) =>
    activeChips.push({
      key: `chip-cat-${c}`,
      label: c,
      onRemove: () =>
        setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })),
    })
  );
  filters.sizes.forEach((s) =>
    activeChips.push({
      key: `chip-size-${s}`,
      label: `Size ${s}`,
      onRemove: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })),
    })
  );
  filters.conditions.forEach((c) =>
    activeChips.push({
      key: `chip-cond-${c}`,
      label: c,
      onRemove: () =>
        setFilters((f) => ({ ...f, conditions: f.conditions.filter((x) => x !== c) })),
    })
  );
  if (filters.distance !== 'Any distance')
    activeChips.push({
      key: `chip-dist-${filters.distance}`,
      label: `Within ${filters.distance}`,
      onRemove: () => setFilters((f) => ({ ...f, distance: 'Any distance' })),
    });
  if (filters.gender !== 'All')
    activeChips.push({
      key: `chip-gender-${filters.gender}`,
      label: filters.gender,
      onRemove: () => setFilters((f) => ({ ...f, gender: 'All' })),
    });

  // Filter + sort listings
  const filteredListings = useMemo(() => {
    const allListings = [...LISTINGS, ...userListings];
    console.log('Total listings before filter:', allListings.length, 'User listings:', userListings.length, 'Search term:', search);
    
    let result = allListings.filter((l) => {
      if (
        search &&
        !l.title.toLowerCase().includes(search.toLowerCase()) &&
        !l.brand.toLowerCase().includes(search.toLowerCase()) &&
        !l.category.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (filters.categories.length && !filters.categories.includes(l.category)) return false;
      if (filters.sizes.length && !filters.sizes.includes(l.size)) return false;
      if (filters.conditions.length && !filters.conditions.includes(l.conditionLabel)) return false;
      if (filters.gender !== 'All' && l.gender !== filters.gender && l.gender !== 'Unisex')
        return false;
      if (l.estimatedValue < filters.minValue || l.estimatedValue > filters.maxValue) return false;
      if (filters.distance !== 'Any distance') {
        const miles = parseInt(filters.distance);
        if (l.distanceMiles > miles) return false;
      }
      return true;
    });

    console.log('Filtered listings count:', result.length);

    switch (sort) {
      case 'Value: High to Low':
        result = [...result].sort((a, b) => b.estimatedValue - a.estimatedValue);
        break;
      case 'Value: Low to High':
        result = [...result].sort((a, b) => a.estimatedValue - b.estimatedValue);
        break;
      case 'Closest first':
        result = [...result].sort((a, b) => a.distanceMiles - b.distanceMiles);
        break;
      default:
        result = [...result].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    }

    return result;
  }, [search, filters, sort, userListings]);

  const handleRequestSwap = (listing: Listing) => {
    setSwapModalListing(listing);
    setSwapMessage('');
    setOfferingValue(listing.estimatedValue);
  };

  const handleConfirmSwap = () => {
    // Save swap request to localStorage
    const swapRequest = {
      id: `swap-${Date.now()}`,
      listingId: swapModalListing?.id,
      listingTitle: swapModalListing?.title,
      ownerName: swapModalListing?.ownerName,
      message: swapMessage || 'I would like to request a swap for this item.',
      offeringValue: offeringValue,
      theirValue: swapModalListing?.estimatedValue,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const existingRequests = JSON.parse(localStorage.getItem('swapRequests') || '[]');
    localStorage.setItem('swapRequests', JSON.stringify([...existingRequests, swapRequest]));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('swapRequestsUpdated'));
    
    toast.success(`Swap request sent to ${swapModalListing?.ownerName}!`);
    setSwapModalListing(null);
    setSwapMessage('');
  };

  return (
    <div className="fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-700 text-foreground mb-1">Browse Listings</h1>
        <p className="text-sm text-muted-foreground">
          {filteredListings.length} item{filteredListings.length !== 1 ? 's' : ''} available near
          Portland, OR
        </p>
      </div>

      {/* Search + controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search by item name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-card border border-border rounded-lg pl-3 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={`sort-${opt}`} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ArrowUpDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* View toggle */}
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-card text-primary shadow-card' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Grid view"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-card text-primary shadow-card' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card text-sm font-500 text-foreground hover:bg-muted transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeChips.length > 0 && (
              <span className="bg-accent text-accent-foreground text-[10px] font-700 rounded-full w-4 h-4 flex items-center justify-center">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-500 px-3 py-1 rounded-full"
            >
              {chip.label}
              <button onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Filter sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />

        {/* Listings grid */}
        <div className="flex-1 min-w-0">
          {filteredListings.length === 0 ? (
            <EmptyState
              icon={Shirt}
              title="No listings match your filters"
              description="Try adjusting your size, category, or distance filters to discover more swap options near you."
              actionLabel="Clear All Filters"
              onAction={() => {
                setFilters(DEFAULT_FILTERS);
                setSearch('');
              }}
            />
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'
                  : 'flex flex-col gap-3'
              }
            >
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onRequestSwap={handleRequestSwap} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredListings.length > 0 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-600 text-foreground">{filteredListings.length}</span>{' '}
                of <span className="font-600 text-foreground">{LISTINGS.length}</span> listings
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((page) => (
                  <button
                    key={`page-${page}`}
                    className={`w-8 h-8 rounded-lg text-sm font-500 transition-colors ${
                      page === 1
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="text-muted-foreground px-1">...</span>
                <button className="w-8 h-8 rounded-lg text-sm font-500 text-muted-foreground hover:bg-muted">
                  8
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden fade-in">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-background overflow-y-auto scrollbar-thin shadow-modal slide-up p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-700">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
        </div>
      )}

      {/* Swap request modal */}
      <Modal
        open={!!swapModalListing}
        onClose={() => setSwapModalListing(null)}
        title="Send Swap Request"
        maxWidth="max-w-lg"
      >
        {swapModalListing && (
          <div>
            {/* Item preview */}
            <div className="flex gap-4 p-4 bg-muted rounded-xl mb-5">
              <div className="w-16 h-16 rounded-xl bg-primary/20 shrink-0 flex items-center justify-center">
                <span className="text-primary text-xs font-600">{swapModalListing.brand}</span>
              </div>
              <div>
                <p className="text-sm font-600 text-foreground">{swapModalListing.title}</p>
                <p className="text-xs text-muted-foreground">
                  {swapModalListing.brand} · Size {swapModalListing.size}
                </p>
                <p className="text-xs text-primary font-600 mt-1">
                  Est. value: ₹{swapModalListing.estimatedValue}
                </p>
              </div>
            </div>

            {/* Swap value indicator */}
            <div className="bg-secondary border border-primary/20 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-[11px] text-muted-foreground mb-1">Their item value</p>
                  <p className="text-lg font-700 text-foreground tabular-nums">
                    ${swapModalListing.estimatedValue}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ArrowLeftRight size={18} className="text-primary" />
                  <span className="text-[10px] text-muted-foreground">Fair swap</span>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-muted-foreground mb-1">Your offering value</p>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-700 text-primary">$</span>
                    <input
                      type="number"
                      value={offeringValue}
                      onChange={(e) => setOfferingValue(Number(e.target.value))}
                      className="w-20 text-lg font-700 text-primary bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-center tabular-nums"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-5">
              <label className="block text-sm font-500 text-foreground mb-1.5">
                Message to {swapModalListing.ownerName.split(' ')[0]}
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Introduce yourself and mention which of your items you&apos;d like to offer
              </p>
              <textarea
                rows={3}
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                className="input-field resize-none"
                placeholder={`Hi ${swapModalListing.ownerName.split(' ')[0]}! I love your ${swapModalListing.title.toLowerCase()}. I would like to offer...`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href="/messages"
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors flex items-center justify-center"
              >
                Message
              </a>
              <button
                onClick={handleConfirmSwap}
                className="flex-[2] btn-primary py-2.5 rounded-xl text-sm font-600 flex items-center justify-center gap-2"
              >
                <ArrowLeftRight size={15} />
                Send Swap Request
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
