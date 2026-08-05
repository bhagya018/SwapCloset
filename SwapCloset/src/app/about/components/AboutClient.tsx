'use client';
import React from 'react';
import Image from 'next/image';
import { Leaf, Heart, Users, Award, Globe } from 'lucide-react';

export default function AboutClient() {
  const mission = [
    {
      icon: Leaf,
      title: 'Sustainable Fashion',
      description:
        'Reduce textile waste by extending the lifecycle of clothing through swapping instead of discarding.',
    },
    {
      icon: Heart,
      title: 'Community Building',
      description:
        'Connect like-minded fashion enthusiasts who value sustainability and unique style.',
    },
    {
      icon: Users,
      title: 'Accessible Fashion',
      description: 'Make quality clothing accessible to everyone regardless of budget constraints.',
    },
  ];

  const stats = [
    { value: '24,800+', label: 'Active Swappers', icon: Users },
    { value: '91,200+', label: 'Items Listed', icon: Heart },
    { value: '68 tons', label: 'Waste Prevented', icon: Leaf },
    { value: '15,400+', label: 'Successful Swaps', icon: Award },
  ];

  const team = [
    { name: 'Sarah Chen', role: 'Founder & CEO', image: '/api/placeholder/100/100' },
    { name: 'Marcus Johnson', role: 'CTO', image: '/api/placeholder/100/100' },
    { name: 'Emily Rodriguez', role: 'Head of Community', image: '/api/placeholder/100/100' },
    { name: 'David Kim', role: 'Lead Designer', image: '/api/placeholder/100/100' },
  ];

  return (
    <div className="fade-in max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-700 text-foreground mb-4">About SwapCloset</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We&apos;re on a mission to make fashion sustainable, accessible, and fun—one swap at a
          time.
        </p>
      </div>

      {/* Mission */}
      <div className="mb-16">
        <h2 className="text-2xl font-700 text-foreground mb-6 text-center">Our Mission</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mission.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-card rounded-2xl border border-border p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="text-lg font-600 text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-secondary rounded-3xl p-8 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon size={24} className="text-primary" />
                </div>
                <p className="text-3xl font-700 text-foreground tabular-nums">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story */}
      <div className="mb-16">
        <h2 className="text-2xl font-700 text-foreground mb-6 text-center">Our Story</h2>
        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="max-w-3xl mx-auto prose prose-sm">
            <p className="text-muted-foreground leading-relaxed mb-4">
              SwapCloset was born from a simple observation: our closets are full of clothes we no
              longer wear, yet we continue to buy new ones. The fashion industry is one of the
              largest polluters in the world, and we wanted to be part of the solution.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2024, we started with a community of just 50 swappers in Portland, Oregon.
              Today, we&apos;ve grown into a nationwide platform with thousands of active users who
              have swapped tens of thousands of items, preventing tons of textile waste from ending
              up in landfills.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that sustainable fashion shouldn&apos;t mean sacrificing style or breaking
              the bank. By making it easy to swap clothes with others, we&apos;re helping people
              refresh their wardrobes, discover unique pieces, and build connections—all while
              reducing their environmental impact.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-700 text-foreground mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Sustainability First',
              description: 'Every decision we make considers its environmental impact.',
            },
            {
              title: 'Community Driven',
              description: 'Our platform is built by and for our community of swappers.',
            },
            {
              title: 'Trust & Safety',
              description:
                'We prioritize creating a safe and trustworthy environment for all users.',
            },
            {
              title: 'Inclusivity',
              description: 'Fashion is for everyone—regardless of size, style, or budget.',
            },
          ].map((value) => (
            <div key={value.title} className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-base font-600 text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-700 text-foreground mb-6 text-center">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-3 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-600 text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary rounded-3xl p-8 text-center">
        <Globe size={48} className="text-primary-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-700 text-primary-foreground mb-2">Join Our Movement</h2>
        <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
          Be part of the sustainable fashion revolution. Start swapping today and make a difference.
        </p>
        <button className="bg-primary-foreground text-primary px-6 py-3 rounded-xl text-sm font-600 hover:bg-white/90 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}
