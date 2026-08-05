'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Shirt,
  ArrowLeftRight,
  MessageSquare,
  MapPin,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Package,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    href: '/user-dashboard',
    icon: LayoutDashboard,
    group: 'main',
  },
  {
    id: 'nav-listings',
    label: 'Browse Listings',
    href: '/clothing-listings-page',
    icon: Shirt,
    group: 'main',
  },
  {
    id: 'nav-swaps',
    label: 'Swap Requests',
    href: '/swap-requests',
    icon: ArrowLeftRight,
    badge: 3,
    group: 'main',
  },
  {
    id: 'nav-messages',
    label: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    badge: 2,
    group: 'main',
  },
  {
    id: 'nav-nearby',
    label: 'Nearby Swaps',
    href: '/clothing-listings-page?filter=nearby',
    icon: MapPin,
    group: 'discover',
  },
  {
    id: 'nav-my-listings',
    label: 'My Listings',
    href: '/user-dashboard?tab=listings',
    icon: Package,
    group: 'discover',
  },
  {
    id: 'nav-saved',
    label: 'Saved Items',
    href: '/favorites',
    icon: Star,
    group: 'discover',
  },
  {
    id: 'nav-notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: 5,
    group: 'discover',
  },
  {
    id: 'nav-profile',
    label: 'Profile',
    href: '/profile',
    icon: Settings,
    group: 'account',
  },
  {
    id: 'nav-add-listing',
    label: 'Add Listing',
    href: '/add-listing',
    icon: Package,
    group: 'account',
  },
];

const groups: { key: string; label: string }[] = [
  { key: 'main', label: 'Overview' },
  { key: 'discover', label: 'Discover' },
  { key: 'account', label: 'Account' },
];

interface SidebarProps {
  activePath?: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out relative z-20 shrink-0"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border overflow-hidden">
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-lg text-foreground whitespace-nowrap tracking-tight">
            SwapCloset
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group.key);
          return (
            <div key={`group-${group.key}`} className="mb-4">
              {!collapsed && (
                <p className="px-4 mb-1 text-[11px] font-600 uppercase tracking-widest text-muted-foreground">
                  {group.label}
                </p>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-600'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-500 flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto bg-accent text-accent-foreground text-[10px] font-700 rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 bg-accent w-2 h-2 rounded-full" />
                    )}
                    {collapsed && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-700">MA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-foreground truncate">Maya Alvarez</p>
              <p className="text-xs text-muted-foreground truncate">Portland, OR</p>
            </div>
            <Bell size={16} className="text-muted-foreground shrink-0" />
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-card border border-border rounded-full w-6 h-6 flex items-center justify-center shadow-card hover:shadow-card-hover transition-all duration-150 z-30"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
