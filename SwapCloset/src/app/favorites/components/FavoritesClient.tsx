'use client';
import React from 'react';
import { Heart, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '@/components/ui/EmptyState';
import { useRouter } from 'next/navigation';

export default function FavoritesClient() {
  const router = useRouter();
  
  // Mock favorites data with actual image URLs
  const favorites = [
    {
      id: 'mylisting-001',
      title: 'Silk Midi Skirt — Dusty Rose',
      brand: 'ARITZIA',
      size: 'S',
      value: 88,
      color: '#4A90A4',
      owner: 'Maya Alvarez',
      location: 'Portland, OR',
      imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1ab464e37-1773214626767.png',
    },
    {
      id: 'mylisting-002',
      title: 'Vintage Windbreaker — Cobalt',
      brand: 'Nike',
      size: 'M',
      value: 65,
      color: '#E8B4B8',
      owner: 'Sarah Chen',
      location: 'Seattle, WA',
      imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_181e25e30-1766470464698.png',
    },
    {
      id: 'mylisting-004',
      title: 'Chelsea Boots — Tan Suede',
      brand: 'Thursday Boot Co.',
      size: '8',
      value: 95,
      color: '#2C3E50',
      owner: 'James Wilson',
      location: 'Portland, OR',
      imageUrl: 'https://images.unsplash.com/photo-1673437531214-1e48e0ebf59d',
    },
  ];

  const handleRemoveFavorite = (id: string) => {
    // BACKEND INTEGRATION: DELETE /api/favorites/:id
    toast.success('Removed from favorites');
  };

  const handleViewDetails = (id: string) => {
    router.push(`/listings/${id}`);
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-700 text-foreground mb-1">My Favorites</h1>
        <p className="text-sm text-muted-foreground">
          {favorites.length} item{favorites.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Start browsing listings and save items you love by clicking the heart icon."
          actionLabel="Browse Listings"
          onAction={() => window.location.href = '/clothing-listings-page'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all duration-200 group cursor-pointer" onClick={() => handleViewDetails(item.id)}>
              <div className="aspect-square relative" style={{ backgroundColor: item.color }}>
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.parentElement as HTMLElement).querySelector('.fallback-brand')?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center fallback-brand ${item.imageUrl ? 'hidden' : ''}`}>
                  <span className="text-white/90 text-sm font-600 text-center px-4">{item.brand}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(item.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Heart size={16} className="fill-negative text-negative" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm font-600 text-foreground mb-1 truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{item.brand} · Size {item.size}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-600 text-primary">${item.value}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(item.id);
                    }}
                    className="text-xs font-500 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
