'use client';
import React from 'react';
import {
  ArrowRight,
  Leaf,
  Shirt,
  ArrowLeftRight,
  MapPin,
  Star,
  Search,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="gradient-brand rounded-3xl p-8 lg:p-12 mb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 blob-primary opacity-40" />
      <div className="absolute bottom-0 left-0 w-72 h-72 blob-primary opacity-30" />
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-500 px-3 py-1.5 rounded-full mb-6">
          <Leaf size={12} />
          <span>Sustainable fashion, one swap at a time</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-800 text-white leading-tight mb-4">
          Your closet is someone&apos;s treasure
        </h1>
        <p className="text-white/80 text-lg mb-8 max-w-lg">
          Join thousands of fashion lovers who swap instead of shop. Refresh your wardrobe for free
          while keeping clothes out of landfills.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/clothing-listings-page"
            className="btn-primary bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-xl text-sm font-600 flex items-center gap-2"
          >
            Browse Listings
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/user-dashboard"
            className="bg-white/15 text-white hover:bg-white/25 px-6 py-3 rounded-xl text-sm font-600 flex items-center gap-2 transition-colors"
          >
            Start Swapping
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Statistics() {
  const stats = [
    { value: '24,800+', label: 'Active Swappers', icon: Users },
    { value: '91,200+', label: 'Items Listed', icon: Shirt },
    { value: '68 tons', label: 'Waste Prevented', icon: Leaf },
    { value: '15,400+', label: 'Successful Swaps', icon: ArrowLeftRight },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-card rounded-2xl border border-border p-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Icon size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-700 text-foreground tabular-nums">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export function Categories() {
  const categories = [
    { name: 'Tops & T-Shirts', count: 1240, icon: Shirt },
    { name: 'Dresses', count: 890, icon: Shirt },
    { name: 'Jeans & Pants', count: 1560, icon: Shirt },
    { name: 'Jackets & Coats', count: 720, icon: Shirt },
    { name: 'Shoes', count: 980, icon: Shirt },
    { name: 'Accessories', count: 650, icon: Shirt },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-700 text-foreground">Browse by Category</h2>
        <Link
          href="/clothing-listings-page"
          className="text-sm font-500 text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href="/clothing-listings-page"
            className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 hover:shadow-card transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <cat.icon size={24} className="text-primary" />
            </div>
            <p className="text-sm font-600 text-foreground mb-1">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{cat.count} items</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FeaturedListings() {
  const listings = [
    {
      id: 1,
      title: 'Vintage Levi&apos;s 501 Jeans',
      brand: "Levi's",
      size: '28',
      value: 45,
      color: '#4A90A4',
    },
    {
      id: 2,
      title: 'Zara Floral Summer Dress',
      brand: 'Zara',
      size: 'M',
      value: 35,
      color: '#E8B4B8',
    },
    { id: 3, title: 'Nike Air Max 90', brand: 'Nike', size: '8', value: 65, color: '#2C3E50' },
    { id: 4, title: 'H&M Oversized Hoodie', brand: 'H&M', size: 'L', value: 25, color: '#8B7355' },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-700 text-foreground">Featured Listings</h2>
        <Link
          href="/clothing-listings-page"
          className="text-sm font-500 text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {listings.map((item) => (
          <Link
            key={item.id}
            href="/listings/1"
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
  );
}

export function HowItWorks() {
  const steps = [
    {
      icon: Shirt,
      title: 'List Your Items',
      description: 'Add photos and details of clothes you no longer wear',
    },
    {
      icon: Search,
      title: 'Browse & Discover',
      description: 'Find items you love from swappers near you',
    },
    {
      icon: ArrowLeftRight,
      title: 'Request a Swap',
      description: 'Send swap requests and negotiate directly',
    },
    {
      icon: MapPin,
      title: 'Meet & Exchange',
      description: 'Arrange a safe meetup and complete the swap',
    },
  ];

  return (
    <div className="bg-secondary rounded-3xl p-8 lg:p-12 mb-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-700 text-foreground mb-2">How SwapCloset Works</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Start swapping in 4 simple steps
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={step.title} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
              <step.icon size={32} className="text-primary" />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-700 flex items-center justify-center">
                {index + 1}
              </div>
            </div>
            <h3 className="text-base font-600 text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SustainableBenefits() {
  const benefits = [
    {
      icon: Leaf,
      title: 'Reduce Waste',
      description: 'Keep clothes out of landfills and extend their lifecycle',
    },
    {
      icon: TrendingUp,
      title: 'Save Money',
      description: 'Refresh your wardrobe without spending a fortune',
    },
    {
      icon: Star,
      title: 'Build Community',
      description: 'Connect with like-minded fashion enthusiasts',
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-700 text-foreground mb-6 text-center">
        Sustainable Fashion Benefits
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="bg-card rounded-2xl border border-border p-6 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-positive/10 flex items-center justify-center mx-auto mb-4">
              <benefit.icon size={28} className="text-positive" />
            </div>
            <h3 className="text-lg font-600 text-foreground mb-2">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Portland, OR',
      text: 'I&apos;ve swapped over 20 items and saved hundreds of dollars. The community is amazing!',
      avatar: 'SM',
    },
    {
      name: 'James K.',
      location: 'Seattle, WA',
      text: 'Finally found a use for my old clothes. Met great people and got amazing pieces in return.',
      avatar: 'JK',
    },
    {
      name: 'Emily R.',
      location: 'San Francisco, CA',
      text: 'Sustainable fashion made easy. Love that I can refresh my wardrobe guilt-free!',
      avatar: 'ER',
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-700 text-foreground mb-6 text-center">What Our Swappers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-xs font-700">{testimonial.avatar}</span>
              </div>
              <div>
                <p className="text-sm font-600 text-foreground">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">&ldquo;{testimonial.text}&rdquo;</p>
            <div className="flex gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} className="fill-warning text-warning" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Missing icon import
import { Users } from 'lucide-react';
