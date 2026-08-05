'use client';
import React, { useState } from 'react';
import { Users, Package, ArrowLeftRight, AlertCircle, Ban, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'swaps'>(
    'overview'
  );

  const stats = [
    { label: 'Total Users', value: '24,800', change: '+12%', icon: Users, color: 'primary' },
    { label: 'Total Listings', value: '91,200', change: '+8%', icon: Package, color: 'info' },
    {
      label: 'Total Swaps',
      value: '15,400',
      change: '+15%',
      icon: ArrowLeftRight,
      color: 'positive',
    },
    { label: 'Pending Requests', value: '234', change: '-5%', icon: AlertCircle, color: 'warning' },
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah@email.com',
      joined: '2 days ago',
      status: 'active',
      listings: 5,
    },
    {
      id: 2,
      name: 'James Wilson',
      email: 'james@email.com',
      joined: '3 days ago',
      status: 'active',
      listings: 3,
    },
    {
      id: 3,
      name: 'Emily Roberts',
      email: 'emily@email.com',
      joined: '5 days ago',
      status: 'pending',
      listings: 0,
    },
    {
      id: 4,
      name: 'Alex Thompson',
      email: 'alex@email.com',
      joined: '1 week ago',
      status: 'suspended',
      listings: 12,
    },
  ];

  const recentListings = [
    { id: 1, title: "Vintage Levi's 501", owner: 'Sarah Chen', status: 'active', reported: false },
    {
      id: 2,
      title: 'Zara Summer Dress',
      owner: 'Emily Roberts',
      status: 'pending',
      reported: false,
    },
    { id: 3, title: 'Nike Air Max 90', owner: 'James Wilson', status: 'active', reported: true },
    { id: 4, title: 'Designer Handbag', owner: 'Alex Thompson', status: 'removed', reported: true },
  ];

  const handleSuspendUser = (_userId: number) => {
    toast.success('User suspended successfully');
  };

  const handleDeleteUser = (_userId: number) => {
    toast.success('User deleted successfully');
  };

  const handleRemoveListing = (_listingId: number) => {
    toast.success('Listing removed successfully');
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-700 text-foreground mb-1">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage users, listings, and platform activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="active">Admin Access</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}
                >
                  <Icon size={20} className={`text-${stat.color}`} />
                </div>
                <span
                  className={`text-xs font-500 ${stat.change.startsWith('+') ? 'text-positive' : 'text-negative'}`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-700 text-foreground tabular-nums">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1 mb-6 w-fit">
        {(
          [
            { key: 'overview', label: 'Overview' },
            { key: 'users', label: 'Users' },
            { key: 'listings', label: 'Listings' },
            { key: 'swaps', label: 'Swaps' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-600 transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-card text-foreground shadow-card'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-600 text-foreground mb-4">Recent Users</h3>
            <div className="space-y-3">
              {recentUsers.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-xs font-700">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-600 text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      user.status === 'active'
                        ? 'active'
                        : user.status === 'suspended'
                          ? 'rejected'
                          : 'pending'
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Listings */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-600 text-foreground mb-4">Recent Listings</h3>
            <div className="space-y-3">
              {recentListings.slice(0, 4).map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-600 text-foreground">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">by {listing.owner}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {listing.reported && <AlertCircle size={14} className="text-warning" />}
                    <Badge
                      variant={
                        listing.status === 'active'
                          ? 'active'
                          : listing.status === 'pending'
                            ? 'pending'
                            : 'rejected'
                      }
                    >
                      {listing.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-600 text-foreground">All Users</h3>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search users..."
                className="input-field pl-9 text-sm w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    User
                  </th>
                  <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Joined
                  </th>
                  <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Listings
                  </th>
                  <th className="text-right text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary text-xs font-700">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <span className="text-sm font-600 text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-4 text-sm text-muted-foreground">{user.joined}</td>
                    <td className="py-4">
                      <Badge
                        variant={
                          user.status === 'active'
                            ? 'active'
                            : user.status === 'suspended'
                              ? 'rejected'
                              : 'pending'
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-foreground">{user.listings}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Suspend user"
                        >
                          <Ban size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-negative/10 transition-colors text-muted-foreground hover:text-negative"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-600 text-foreground">All Listings</h3>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search listings..."
                className="input-field pl-9 text-sm w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Listing
                  </th>
                  <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Owner
                  </th>
                  <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-600 text-muted-foreground uppercase tracking-wider pb-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-600 text-foreground">{listing.title}</span>
                        {listing.reported && <AlertCircle size={14} className="text-warning" />}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{listing.owner}</td>
                    <td className="py-4">
                      <Badge
                        variant={
                          listing.status === 'active'
                            ? 'active'
                            : listing.status === 'pending'
                              ? 'pending'
                              : 'rejected'
                        }
                      >
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleRemoveListing(listing.id)}
                        className="p-2 rounded-lg hover:bg-negative/10 transition-colors text-muted-foreground hover:text-negative"
                        title="Remove listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Swaps Tab */}
      {activeTab === 'swaps' && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="text-center py-12">
            <ArrowLeftRight size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-600 text-foreground mb-2">Swap Management</h3>
            <p className="text-sm text-muted-foreground">
              Monitor and manage swap disputes and activity
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
