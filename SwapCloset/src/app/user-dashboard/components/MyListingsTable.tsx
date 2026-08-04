'use client';
import React, { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  Eye,
  Edit3,
  Trash2,
  Plus,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { MY_LISTINGS, MyListing } from './dashboardData';
import { useRouter } from 'next/navigation';

type SortKey = 'title' | 'estimatedValue' | 'views' | 'swapRequests' | 'postedDate';
type SortDir = 'asc' | 'desc';

const STATUS_LABEL_MAP: Record<string, string> = {
  active: 'Active',
  draft: 'Draft',
  'in-negotiation': 'Negotiating',
  swapped: 'Swapped',
  archived: 'Archived',
};

const STATUS_VARIANT_MAP: Record<string, string> = {
  active: 'active',
  draft: 'draft',
  'in-negotiation': 'negotiating',
  swapped: 'completed',
  archived: 'draft',
};

export default function MyListingsTable() {
  const router = useRouter();
  const [listings, setListings] = useState<MyListing[]>(MY_LISTINGS);
  const [sortKey, setSortKey] = useState<SortKey>('postedDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [deleteTarget, setDeleteTarget] = useState<MyListing | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Load user listings from localStorage
  useEffect(() => {
    const loadListings = () => {
      try {
        const savedListings = JSON.parse(localStorage.getItem('userListings') || '[]');
        console.log('MyListingsTable - Loaded from localStorage:', savedListings.length);
        
        if (savedListings.length > 0) {
          // Convert localStorage listings to MyListing format
          const convertedListings: MyListing[] = savedListings.map((item: any) => ({
            id: item.id,
            title: item.title,
            brand: item.brand,
            category: item.category,
            size: item.size,
            status: 'active',
            estimatedValue: item.estimatedValue,
            views: 0,
            swapRequests: 0,
            postedDate: 'Just now',
            imageUrl: item.imageUrl || '',
            imageAlt: item.imageAlt,
            color: item.color || '#4A90A4', // Add color field
          }));
          console.log('MyListingsTable - Converted listings:', convertedListings.length);
          setListings([...MY_LISTINGS, ...convertedListings]);
        } else {
          console.log('MyListingsTable - No user listings found, using mock data only');
          setListings(MY_LISTINGS);
        }
      } catch (error) {
        console.error('MyListingsTable - Error loading listings:', error);
        setListings(MY_LISTINGS);
      }
    };
    
    loadListings();
    // Listen for storage changes
    const handleStorageChange = () => loadListings();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleStorageChange);
    };
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...listings].sort((a, b) => {
    let valA: string | number = a[sortKey] as string | number;
    let valB: string | number = b[sortKey] as string | number;
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === listings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(listings.map((l) => l.id));
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    // Remove from localStorage if it's a user-created listing
    const savedListings = JSON.parse(localStorage.getItem('userListings') || '[]');
    const updatedListings = savedListings.filter((l: any) => l.id !== deleteTarget.id);
    localStorage.setItem('userListings', JSON.stringify(updatedListings));
    
    // Remove from state
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.title}" removed from your listings`);
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    // Remove from localStorage
    const savedListings = JSON.parse(localStorage.getItem('userListings') || '[]');
    const updatedListings = savedListings.filter((l: any) => !selectedIds.includes(l.id));
    localStorage.setItem('userListings', JSON.stringify(updatedListings));
    
    setListings((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
    toast.success(`${selectedIds.length} listing${selectedIds.length > 1 ? 's' : ''} removed`);
    setSelectedIds([]);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="text-muted-foreground/50" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  };

  const SortHeader = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      onClick={() => handleSort(col)}
      className="flex items-center gap-1 hover:text-foreground transition-colors group"
    >
      {label}
      <SortIcon col={col} />
    </button>
  );

  return (
    <div>
      {/* Table header actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-600 text-foreground">My Listings</h3>
          <span className="bg-muted text-muted-foreground text-xs font-500 px-2 py-0.5 rounded-full tabular-nums">
            {listings.length}
          </span>
        </div>
        <button
          onClick={() => router.push('/add-listing')}
          className="flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-600"
        >
          <Plus size={15} />
          Add Listing
        </button>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/25 rounded-xl px-4 py-3 mb-3 slide-up">
          <p className="text-sm font-500 text-primary">
            {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              Deselect all
            </button>
            <button
              onClick={handleBulkDelete}
              className="text-xs text-negative font-500 px-3 py-1.5 rounded-lg bg-negative/10 hover:bg-negative/20 transition-colors"
            >
              Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === listings.length && listings.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 accent-primary rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 text-muted-foreground uppercase tracking-wide">
                  <SortHeader col="title" label="Item" />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 text-muted-foreground uppercase tracking-wide">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-600 text-muted-foreground uppercase tracking-wide">
                  <SortHeader col="estimatedValue" label="Value" />
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-600 text-muted-foreground uppercase tracking-wide">
                  <SortHeader col="views" label="Views" />
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-600 text-muted-foreground uppercase tracking-wide">
                  <SortHeader col="swapRequests" label="Requests" />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-600 text-muted-foreground uppercase tracking-wide">
                  <SortHeader col="postedDate" label="Posted" />
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-600 text-muted-foreground uppercase tracking-wide w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((listing, idx) => (
                <tr
                  key={listing.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${
                    idx % 2 === 0 ? '' : 'bg-muted/10'
                  } ${selectedIds.includes(listing.id) ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(listing.id)}
                      onChange={() => toggleSelect(listing.id)}
                      className="w-3.5 h-3.5 accent-primary rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg shrink-0 overflow-hidden relative"
                        style={{ backgroundColor: (listing as any).color || '#4A90A4' }}
                      >
                        {listing.imageUrl ? (
                          <img 
                            src={listing.imageUrl} 
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              (e.currentTarget.parentElement as HTMLElement).querySelector('.fallback-brand')?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 flex items-center justify-center fallback-brand ${listing.imageUrl ? 'hidden' : ''}`}>
                          <span className="text-white text-xs font-600">{listing.brand.substring(0, 2).toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-500 text-foreground truncate max-w-[180px]">
                          {listing.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {listing.brand} · Size {listing.size}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{listing.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT_MAP[listing.status]}>
                      {STATUS_LABEL_MAP[listing.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-600 text-foreground tabular-nums">
                      ${listing.estimatedValue}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {listing.views}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm font-500 tabular-nums ${listing.swapRequests > 0 ? 'text-accent' : 'text-muted-foreground'}`}
                    >
                      {listing.swapRequests}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{listing.postedDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title="View listing"
                        onClick={() => router.push(`/listings/${listing.id}`)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        title="Edit listing"
                        onClick={() => {
                          // Store listing data for editing
                          localStorage.setItem('editListing', JSON.stringify(listing));
                          router.push('/add-listing');
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        title="Delete listing — this cannot be undone"
                        onClick={() => setDeleteTarget(listing)}
                        className="p-1.5 rounded-lg hover:bg-negative/10 transition-colors text-muted-foreground hover:text-negative"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity absolute">
                      <MoreHorizontal size={16} className="text-muted-foreground/40" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-600 text-foreground">{listings.length}</span> listings
          </p>
          <div className="flex items-center gap-1">
            {[1].map((p) => (
              <button
                key={`listings-page-${p}`}
                className="w-7 h-7 rounded-lg text-xs font-500 bg-primary text-primary-foreground"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove Listing"
        maxWidth="max-w-sm"
      >
        {deleteTarget && (
          <div>
            <p className="text-sm text-muted-foreground mb-5">
              Are you sure you want to remove{' '}
              <span className="font-600 text-foreground">&ldquo;{deleteTarget.title}&rdquo;</span>?
              This listing and any pending swap requests will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-600 hover:bg-muted transition-colors"
              >
                Keep Listing
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-negative text-white text-sm font-600 hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
