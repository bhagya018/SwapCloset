'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, Mail, Shield, Star, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  topSize: string;
  bottomSize: string;
  shoeSize: string;
}

export default function ProfileClient() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      fullName: 'Maya Alvarez',
      email: 'maya.alvarez@swapcloset.app',
      phone: '+1 555-0123',
      location: 'Portland, OR',
      bio: 'Fashion enthusiast passionate about sustainable clothing. Love vintage finds and minimalist style.',
      topSize: 'M',
      bottomSize: '28',
      shoeSize: '8',
    },
  });

  const handleSave = async (_data: ProfileFormData) => {
    setIsSaving(true);
    // BACKEND INTEGRATION: PATCH /api/users/profile with data
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const stats = [
    { label: 'Listings', value: 12 },
    { label: 'Swaps', value: 8 },
    { label: 'Reviews', value: 15 },
    { label: 'Rating', value: '4.8' },
  ];

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-700 text-foreground mb-1">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-2xl font-700">MA</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-xl font-700 text-foreground mb-1">Maya Alvarez</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>Portland, OR</span>
                  <span>·</span>
                  <span>Member since 2024</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors"
              >
                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex items-center gap-1 mb-3">
              <Star size={16} className="fill-warning text-warning" />
              <span className="text-sm font-600 text-foreground">4.8</span>
              <span className="text-sm text-muted-foreground">(15 reviews)</span>
            </div>

            <p className="text-sm text-muted-foreground max-w-lg">
              Fashion enthusiast passionate about sustainable clothing. Love vintage finds and
              minimalist style.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-700 text-foreground tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      {isEditing && (
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="bg-card rounded-2xl border border-border p-6 mb-6 fade-in"
        >
          <h3 className="text-lg font-600 text-foreground mb-4">Edit Profile Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-500 text-foreground mb-1.5">Full Name</label>
              <input type="text" className="input-field" {...form.register('fullName')} />
            </div>
            <div>
              <label className="block text-sm font-500 text-foreground mb-1.5">Email</label>
              <input type="email" className="input-field" {...form.register('email')} />
            </div>
            <div>
              <label className="block text-sm font-500 text-foreground mb-1.5">Phone</label>
              <input type="tel" className="input-field" {...form.register('phone')} />
            </div>
            <div>
              <label className="block text-sm font-500 text-foreground mb-1.5">Location</label>
              <input type="text" className="input-field" {...form.register('location')} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-500 text-foreground mb-1.5">Bio</label>
            <textarea rows={3} className="input-field resize-none" {...form.register('bio')} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-500 text-foreground mb-1.5">Top Size</label>
              <select className="input-field" {...form.register('topSize')}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-500 text-foreground mb-1.5">Bottom Size</label>
              <select className="input-field" {...form.register('bottomSize')}>
                {['24', '26', '28', '30', '32', '34', '36'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-500 text-foreground mb-1.5">Shoe Size</label>
              <select className="input-field" {...form.register('shoeSize')}>
                {['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-[2] btn-primary py-2.5 rounded-xl text-sm font-600 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Account Settings */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-600 text-foreground mb-4">Account Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-600 text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive updates about swaps and messages
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-600 text-foreground">Profile Visibility</p>
                <p className="text-xs text-muted-foreground">
                  Make your profile visible to other swappers
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-600 text-foreground">Location Sharing</p>
                <p className="text-xs text-muted-foreground">
                  Show your location to nearby swappers
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
