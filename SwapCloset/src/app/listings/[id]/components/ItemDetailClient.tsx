'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  ArrowLeftRight,
  MapPin,
  Share2,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { LISTINGS, Listing } from '../../../clothing-listings-page/components/listingsData';
import { MY_LISTINGS } from '../../../user-dashboard/components/dashboardData';

interface ExtendedListing {
  id: string;
  title: string;
  brand: string;
  category: string;
  size: string;
  gender?: string;
  condition: string;
  conditionLabel?: string;
  estimatedValue: number;
  location?: string;
  distance?: number;
  distanceMiles?: number;
  imageUrl?: string;
  imageAlt?: string;
  imageColor?: string;
  availability?: string;
  description?: string;
  ownerName?: string;
  ownerAvatar?: string;
  ownerCity?: string;
  owner?: {
    name: string;
    avatar: string;
    location: string;
    rating: number;
    reviewCount: number;
    memberSince: string;
    responseRate: string;
  };
  rating?: number;
  reviewCount?: number;
  memberSince?: string;
  responseRate?: string;
  postedDaysAgo?: number;
  status?: string;
  views?: number;
  swapRequests?: number;
  postedDate?: string;
  color?: string;
}

export default function ItemDetailClient({ listingId }: { listingId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [listing, setListing] = useState<ExtendedListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListing = () => {
      try {
        // First check localStorage for user listings
        const userListings = JSON.parse(
          localStorage.getItem('userListings') || '[]'
        ) as ExtendedListing[];
        const userListing = userListings.find((l) => l.id === listingId);

        if (userListing) {
          setListing({
            id: userListing.id,
            title: userListing.title,
            brand: userListing.brand,
            category: userListing.category,
            size: userListing.size,
            gender: userListing.gender,
            color: userListing.color || '#4A90A4',
            condition: userListing.condition,
            conditionLabel: userListing.conditionLabel,
            estimatedValue: userListing.estimatedValue,
            location: userListing.ownerCity || 'Unknown',
            distance: userListing.distanceMiles || 0,
            availability: 'Available',
            description: `A ${userListing.condition} ${userListing.brand} ${userListing.title}. Size ${userListing.size}.`,
            imageColor: userListing.color || '#4A90A4',
            imageUrl: userListing.imageUrl,
            owner: {
              name: userListing.ownerName || 'Unknown',
              avatar: userListing.ownerAvatar || 'Unknown',
              location: userListing.ownerCity || 'Unknown',
              rating: 4.8,
              reviewCount: 23,
              memberSince: '2024',
              responseRate: '95%',
            },
            postedDaysAgo: userListing.postedDaysAgo || 0,
          });
        } else {
          // Check MY_LISTINGS (dashboard data)
          const myListing = MY_LISTINGS.find((l) => l.id === listingId);
          if (myListing) {
            setListing({
              id: myListing.id,
              title: myListing.title,
              brand: myListing.brand,
              category: myListing.category,
              size: myListing.size,
              gender: 'Women',
              color: myListing.color || '#4A90A4',
              condition: myListing.condition,
              conditionLabel: myListing.condition,
              estimatedValue: myListing.estimatedValue,
              location: 'Portland, OR',
              distance: 0,
              availability: 'Available',
              description: `A ${myListing.condition} ${myListing.brand} ${myListing.title}. Size ${myListing.size}.`,
              imageColor: myListing.color || '#4A90A4',
              imageUrl: myListing.imageUrl,
              owner: {
                name: 'You',
                avatar: 'ME',
                location: 'Portland, OR',
                rating: 4.8,
                reviewCount: 23,
                memberSince: '2024',
                responseRate: '95%',
              },
              postedDaysAgo: 0,
            });
          } else {
            // Check static listings
            const staticListing = LISTINGS.find((l: Listing) => l.id === listingId);
            if (staticListing) {
              setListing({
                id: staticListing.id,
                title: staticListing.title,
                brand: staticListing.brand,
                category: staticListing.category,
                size: staticListing.size,
                gender: staticListing.gender,
                color: staticListing.color || '#4A90A4',
                condition: staticListing.condition,
                conditionLabel: staticListing.conditionLabel,
                estimatedValue: staticListing.estimatedValue,
                location: staticListing.ownerCity,
                distance: staticListing.distanceMiles,
                availability: 'Available',
                description: `A ${staticListing.conditionLabel} ${staticListing.brand} ${staticListing.title}. Size ${staticListing.size}.`,
                imageColor: staticListing.color || '#4A90A4',
                imageUrl: staticListing.imageUrl,
                owner: {
                  name: staticListing.ownerName,
                  avatar: staticListing.ownerAvatar,
                  location: staticListing.ownerCity,
                  rating: 4.8,
                  reviewCount: 23,
                  memberSince: '2024',
                  responseRate: '95%',
                },
                postedDaysAgo: staticListing.postedDaysAgo,
              });
            } else {
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error('Error loading listing:', error);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [listingId]);

  const similarListings = [
    {
      id: 2,
      title: 'High-Waisted Mom Jeans',
      brand: 'Zara',
      size: '28',
      value: 35,
      color: '#E8B4B8',
    },
    {
      id: 3,
      title: 'Vintage Denim Jacket',
      brand: "Levi's",
      size: 'M',
      value: 55,
      color: '#8B7355',
    },
    {
      id: 4,
      title: 'Cropped Straight Jeans',
      brand: 'H&M',
      size: '28',
      value: 25,
      color: '#5D6D7E',
    },
  ];

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleSwapRequest = () => {
    setSwapModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Listing not found</p>
        <Link
          href="/clothing-listings-page"
          className="text-primary hover:underline mt-2 inline-block"
        >
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Back button */}
      <Link
        href="/clothing-listings-page"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          <div
            className="aspect-square rounded-2xl overflow-hidden mb-4 relative"
            style={{ backgroundColor: listing.imageColor }}
          >
            {listing.imageUrl && (
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                onLoad={(e) => {
                  (e.currentTarget.parentElement as HTMLElement)
                    .querySelector('.fallback-brand')
                    ?.classList.add('hidden');
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.parentElement as HTMLElement)
                    .querySelector('.fallback-brand')
                    ?.classList.remove('hidden');
                }}
              />
            )}
            <div className={`absolute inset-0 flex items-center justify-center fallback-brand`}>
              <div className="text-center">
                <span className="text-white/90 text-lg font-600">{listing.brand}</span>
                <p className="text-white/70 text-sm mt-1">{listing.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="active" className="mb-3">
                {listing.availability}
              </Badge>
              <h1 className="text-2xl lg:text-3xl font-700 text-foreground mb-2">
                {listing.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {listing.brand} · {listing.category}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFavorite}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                  isFavorited
                    ? 'border-negative bg-negative/10 text-negative'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                aria-label="Share listing"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="bg-secondary rounded-2xl p-6 mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-700 text-foreground">₹{listing.estimatedValue}</span>
              <span className="text-sm text-muted-foreground">estimated swap value</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Value based on brand, condition, and market data
            </p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Size</p>
              <p className="text-sm font-600 text-foreground">{listing.size}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Gender</p>
              <p className="text-sm font-600 text-foreground">{listing.gender}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Condition</p>
              <p className="text-sm font-600 text-foreground">{listing.conditionLabel}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Color</p>
              <p className="text-sm font-600 text-foreground">{listing.color}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <MapPin size={16} />
            <span>
              {listing.location} · {listing.distance} miles away
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-base font-600 text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          {/* Owner Info */}
          <div className="bg-card rounded-2xl border border-border p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm font-700">
                  {listing.owner?.avatar || 'NA'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-600 text-foreground">
                  {listing.owner?.name || 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Member since {listing.owner?.memberSince || 'N/A'} ·{' '}
                  {listing.owner?.responseRate || 'N/A'} response rate
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-warning text-warning" />
                  <span className="text-sm font-600 text-foreground">
                    {listing.owner?.rating || 0}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {listing.owner?.reviewCount || 0} reviews
                </p>
              </div>
            </div>
            <Link
              href="/messages"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors"
            >
              <MessageSquare size={16} />
              Message Owner
            </Link>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/messages"
              className="flex-1 py-3 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors flex items-center justify-center"
            >
              <MessageSquare size={18} className="mr-2" />
              Message
            </Link>
            <button
              onClick={handleSwapRequest}
              className="flex-[2] btn-primary py-3 rounded-xl text-sm font-600 flex items-center justify-center gap-2"
            >
              <ArrowLeftRight size={18} />
              Request Swap
            </button>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <div>
        <h2 className="text-xl font-700 text-foreground mb-4">Similar Listings</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {similarListings.map((item) => (
            <Link
              key={item.id}
              href={`/listings/${item.id}`}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all duration-200 group"
            >
              <div className="aspect-square relative" style={{ backgroundColor: item.color }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/80 text-xs font-500 text-center px-2">
                    {item.brand}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-600 text-foreground mb-1 truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {item.brand} · Size {item.size}
                </p>
                <p className="text-sm font-600 text-primary">₹{item.value}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Swap Request Modal */}
      <Modal
        open={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        title="Send Swap Request"
        maxWidth="max-w-lg"
      >
        <div>
          <div className="flex gap-4 p-4 bg-muted rounded-xl mb-5">
            <div
              className="w-16 h-16 rounded-xl shrink-0"
              style={{ backgroundColor: listing.imageColor }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/80 text-xs font-500">{listing.brand}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-600 text-foreground">{listing.title}</p>
              <p className="text-xs text-muted-foreground">
                {listing.brand} · Size {listing.size}
              </p>
              <p className="text-xs text-primary font-600 mt-1">
                Est. value: ₹{listing.estimatedValue}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Select your item to offer
            </label>
            <select className="input-field">
              <option value="">Choose from your listings...</option>
              <option value="1">My Vintage Denim Jacket - ₹55</option>
              <option value="2">Floral Summer Dress - ₹35</option>
              <option value="3">Classic White Sneakers - ₹40</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Message to {listing.owner?.name?.split(' ')[0] || 'the owner'}
            </label>
            <textarea
              rows={3}
              className="input-field resize-none"
              placeholder={`Hi ${listing.owner?.name?.split(' ')[0] || 'there'}! I love your ${listing.title.toLowerCase()}. I would like to offer...`}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSwapModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Swap request sent!');
                setSwapModalOpen(false);
              }}
              className="flex-[2] btn-primary py-2.5 rounded-xl text-sm font-600 flex items-center justify-center gap-2"
            >
              <ArrowLeftRight size={15} />
              Send Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
