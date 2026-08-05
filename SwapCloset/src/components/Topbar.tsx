'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Plus, Menu, X, ArrowLeftRight } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

export default function Topbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/clothing-listings-page?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <>
      <header className="h-16 bg-card border-b border-border flex items-center px-4 lg:px-6 gap-4 shrink-0 z-10">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2">
          <AppLogo size={28} />
          <span className="font-bold text-base text-foreground">SwapCloset</span>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-md relative"
        >
          <Search size={16} className="absolute left-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search listings, brands, sizes..."
            value={searchVal}
            onChange={(e) => setSearchVal(e?.target?.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          {/* Add listing */}
          <Link
            href="/add-listing"
            className="hidden md:flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-600"
          >
            <Plus size={16} />
            <span>List an Item</span>
          </Link>

          {/* Swap requests indicator */}
          <Link
            href="/swap-requests"
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            title="Swap Requests"
          >
            <ArrowLeftRight size={18} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Link>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Link>

          {/* Avatar */}
          <Link
            href="/user-dashboard"
            className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <span className="text-primary text-xs font-700">MA</span>
          </Link>

          {/* Mobile menu */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 fade-in">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-card shadow-modal slide-up flex flex-col">
            <div className="flex items-center justify-between px-4 py-5 border-b border-border">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {[
                { href: '/user-dashboard', label: 'Dashboard' },
                { href: '/clothing-listings-page', label: 'Browse Listings' },
                { href: '/swap-requests', label: 'Swap Requests' },
                { href: '/messages', label: 'Messages' },
                { href: '/notifications', label: 'Notifications' },
                { href: '/sign-up-login-screen', label: 'Sign Out' },
              ]?.map((item) => (
                <Link
                  key={`mobile-nav-${item?.label}`}
                  href={item?.href}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-500 text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item?.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
