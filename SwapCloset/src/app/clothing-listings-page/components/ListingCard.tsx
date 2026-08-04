'use client';
import React, { useState } from 'react';
import { MapPin, Heart, ArrowLeftRight, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';
import { Listing } from './listingsData';
import { useRouter } from 'next/navigation';

interface ListingCardProps {
  listing: Listing;
  onRequestSwap?: (listing: Listing) => void;
}

export default function ListingCard({ listing, onRequestSwap }: ListingCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(listing.saved || false);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved items' : 'Saved to your list');
  };

  const handleViewDetails = () => {
    router.push(`/listings/${listing.id}`);
  };

  const handleRequestSwap = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRequesting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRequesting(false);
    if (onRequestSwap) {
      onRequestSwap(listing);
    }
  };

  return (
    <div 
      className="bg-card rounded-2xl border border-border overflow-hidden card-hover group cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Image */}
      <div 
        className="relative h-52 overflow-hidden"
        style={{ backgroundColor: (listing as any).color || '#4A90A4' }}
      >
        {listing.imageUrl ? (
          <img 
            src={listing.imageUrl} 
            alt={listing.imageAlt || listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to colored background if image fails to load
              e.currentTarget.style.display = 'none';
              (e.currentTarget.parentElement as HTMLElement).querySelector('.fallback-brand')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center fallback-brand ${listing.imageUrl ? 'hidden' : ''}`}>
          <span className="text-white/90 text-sm font-600 text-center px-4">{listing.brand}</span>
        </div>
        {/* Save button */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card hover:scale-110 transition-all duration-150"
          aria-label={saved ? 'Remove from saved' : 'Save item'}
        >
          <Heart
            size={15}
            className={saved ? 'fill-accent text-accent' : 'text-muted-foreground'}
          />
        </button>
        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="bg-card/90 backdrop-blur-sm text-foreground text-[11px] font-500 px-2 py-1 rounded-full">
            {listing.category}
          </span>
        </div>
        {/* Value indicator */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-foreground/80 backdrop-blur-sm text-background text-[11px] font-600 px-2.5 py-1 rounded-full flex items-center gap-1 tabular-nums">
            <DollarSign size={11} />
            {listing.estimatedValue}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title + brand */}
        <div className="mb-2">
          <h3 className="text-sm font-600 text-foreground leading-snug truncate">
            {listing.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{listing.brand}</p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <Badge variant={listing.condition}>{listing.conditionLabel}</Badge>
          <span className="bg-muted text-muted-foreground text-[11px] font-500 px-2 py-0.5 rounded-full">
            Size {listing.size}
          </span>
          {listing.tags.slice(0, 1).map((tag) => (
            <span
              key={`tag-${listing.id}-${tag}`}
              className="bg-accent/10 text-accent text-[11px] font-500 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Owner + distance */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary text-[9px] font-700">{listing.ownerAvatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground font-500 truncate">{listing.ownerName}</p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground shrink-0">
            <MapPin size={11} />
            <span className="text-[11px] tabular-nums">{listing.distanceMiles} mi</span>
          </div>
        </div>

        {/* Swap value range */}
        <div className="flex items-center justify-between mb-3 bg-secondary rounded-lg px-3 py-2">
          <span className="text-[11px] text-muted-foreground">Swap value</span>
          <span className="text-xs font-600 text-primary tabular-nums">
            ${listing.swapValueRange[0]}–${listing.swapValueRange[1]}
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleRequestSwap}
          disabled={isRequesting}
          className="w-full btn-primary py-2.5 rounded-xl text-xs font-600 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isRequesting ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowLeftRight size={14} />
          )}
          {isRequesting ? 'Sending...' : 'Request Swap'}
        </button>
      </div>
    </div>
  );
}
