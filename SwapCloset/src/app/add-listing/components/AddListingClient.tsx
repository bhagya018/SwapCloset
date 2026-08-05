'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Upload, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ListingFormData {
  title: string;
  brand: string;
  category: string;
  size: string;
  gender: string;
  color: string;
  condition: string;
  estimatedValue: number;
  location: string;
  description: string;
}

interface StoredListing {
  id: string;
  title: string;
  brand: string;
  category: string;
  size: string;
  gender: string;
  color: string;
  condition: string;
  estimatedValue: number;
  location: string;
  description: string;
  images: string[];
  imageUrl: string;
}

const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Skirts',
  'Sweaters & Hoodies',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '24', '26', '28', '30', '32', '34', '36'];
const GENDERS = ['Women', 'Men', 'Unisex', 'Kids'];
const CONDITIONS = ['Like New', 'Good', 'Fair', 'Well Loved'];
const BRANDS = [
  'Nike',
  'Adidas',
  'Zara',
  'H&M',
  "Levi's",
  'Puma',
  'Allen Solly',
  'Roadster',
  'Other',
];

export default function AddListingClient() {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editListingId, setEditListingId] = useState<string | null>(null);

  const form = useForm<ListingFormData>({
    defaultValues: {
      title: '',
      brand: '',
      category: '',
      size: '',
      gender: '',
      color: '',
      condition: '',
      estimatedValue: 0,
      location: '',
      description: '',
    },
  });

  // Load edit data from localStorage if editing
  useEffect(() => {
    const editData = localStorage.getItem('editListing');
    if (editData) {
      try {
        const listing = JSON.parse(editData);
        setIsEditing(true);
        setEditListingId(listing.id);

        // Populate form with existing data
        form.reset({
          title: listing.title || '',
          brand: listing.brand || '',
          category: listing.category || '',
          size: listing.size || '',
          gender: listing.gender || '',
          color: listing.color || '',
          condition: listing.condition || '',
          estimatedValue: listing.estimatedValue || 0,
          location: listing.location || '',
          description: listing.description || '',
        });

        // Load images if available
        if (listing.imageUrl) {
          setUploadedImages([listing.imageUrl]);
        }

        // Clear edit data from localStorage
        localStorage.removeItem('editListing');
      } catch (error) {
        console.error('Error loading edit data:', error);
      }
    }
  }, [form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert files to base64 for localStorage storage
      const fileReadPromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReadPromises).then((base64Images) => {
        setUploadedImages([...uploadedImages, ...base64Images].slice(0, 5));
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ListingFormData) => {
    setIsSubmitting(true);

    // Generate a color based on the item category
    const categoryColors: Record<string, string> = {
      'Tops & T-Shirts': '#4A90A4',
      Dresses: '#E8B4B8',
      'Jeans & Pants': '#2C3E50',
      'Jackets & Coats': '#8B7355',
      Shoes: '#5D6D7E',
      Accessories: '#9B59B6',
      Skirts: '#F39C12',
      'Sweaters & Hoodies': '#27AE60',
    };
    const defaultColor = categoryColors[data.category] || '#4A90A4';

    if (isEditing && editListingId) {
      // Update existing listing
      const existingListings = JSON.parse(localStorage.getItem('userListings') || '[]');
      const updatedListings = existingListings.map((listing: StoredListing) => {
        if (listing.id === editListingId) {
          return {
            ...listing,
            title: data.title,
            brand: data.brand,
            category: data.category,
            size: data.size,
            condition: data.condition.toLowerCase().replace(' ', '-') as
              'like-new' | 'good' | 'fair' | 'well-loved',
            conditionLabel: data.condition,
            estimatedValue: data.estimatedValue,
            swapValueRange: [Math.max(0, data.estimatedValue - 15), data.estimatedValue + 15] as [
              number,
              number,
            ],
            imageUrl: uploadedImages[0] || listing.imageUrl,
            imageAlt: data.title,
            color: defaultColor,
            ownerCity: data.location,
            gender: data.gender,
            description: data.description,
          };
        }
        return listing;
      });

      localStorage.setItem('userListings', JSON.stringify(updatedListings));
      window.dispatchEvent(new Event('localStorageUpdated'));

      setTimeout(() => {
        setIsSubmitting(false);
        setIsEditing(false);
        setEditListingId(null);
        toast.success('Listing updated successfully!');
        router.push('/user-dashboard?tab=listings&scroll=true');
      }, 1500);
    } else {
      // Create new listing object
      const newListing = {
        id: `listing-${Date.now()}`,
        title: data.title,
        brand: data.brand,
        category: data.category,
        size: data.size,
        condition: data.condition.toLowerCase().replace(' ', '-') as
          'like-new' | 'good' | 'fair' | 'well-loved',
        conditionLabel: data.condition,
        estimatedValue: data.estimatedValue,
        swapValueRange: [Math.max(0, data.estimatedValue - 15), data.estimatedValue + 15] as [
          number,
          number,
        ],
        imageUrl: uploadedImages[0] || '', // Use uploaded image or empty string
        imageAlt: data.title,
        color: defaultColor, // Add color for display
        ownerName: 'You',
        ownerAvatar: 'YO',
        ownerCity: data.location,
        distanceMiles: 0,
        tags: [],
        gender: data.gender,
        postedDaysAgo: 0,
        saved: false,
      };

      // Save to localStorage
      const existingListings = JSON.parse(localStorage.getItem('userListings') || '[]');
      localStorage.setItem('userListings', JSON.stringify([...existingListings, newListing]));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('localStorageUpdated'));

      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Listing created successfully!');
        router.push('/user-dashboard?tab=listings&scroll=true');
      }, 1500);
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-700 text-foreground mb-2">
          {isEditing ? 'Edit Listing' : 'Create New Listing'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? 'Update your clothing item details'
            : 'Add your clothing item to the swap marketplace'}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-600 text-foreground mb-3">
            Photos <span className="text-muted-foreground">(Optional)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="aspect-square relative group">
                <div className="w-full h-full rounded-xl bg-muted overflow-hidden">
                  <Image
                    src={img}
                    alt={`Upload ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-negative text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {uploadedImages.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center px-2">Upload photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Upload up to 5 photos. If no photo is uploaded, a colored placeholder will be used.
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Item Name <span className="text-negative">*</span>
            </label>
            <input
              type="text"
              className={`input-field ${form.formState.errors.title ? 'error' : ''}`}
              placeholder="e.g., Vintage Levi's 501 Jeans"
              {...form.register('title', { required: 'Item name is required' })}
            />
            {form.formState.errors.title && (
              <p className="mt-1.5 text-xs text-negative">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Brand <span className="text-negative">*</span>
            </label>
            <select
              className={`input-field ${form.formState.errors.brand ? 'error' : ''}`}
              {...form.register('brand', { required: 'Brand is required' })}
            >
              <option value="">Select brand</option>
              {BRANDS.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            {form.formState.errors.brand && (
              <p className="mt-1.5 text-xs text-negative">{form.formState.errors.brand.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Category <span className="text-negative">*</span>
            </label>
            <select
              className={`input-field ${form.formState.errors.category ? 'error' : ''}`}
              {...form.register('category', { required: 'Category is required' })}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {form.formState.errors.category && (
              <p className="mt-1.5 text-xs text-negative">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Size <span className="text-negative">*</span>
            </label>
            <select
              className={`input-field ${form.formState.errors.size ? 'error' : ''}`}
              {...form.register('size', { required: 'Size is required' })}
            >
              <option value="">Select size</option>
              {SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {form.formState.errors.size && (
              <p className="mt-1.5 text-xs text-negative">{form.formState.errors.size.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Gender <span className="text-negative">*</span>
            </label>
            <select
              className={`input-field ${form.formState.errors.gender ? 'error' : ''}`}
              {...form.register('gender', { required: 'Gender is required' })}
            >
              <option value="">Select gender</option>
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {form.formState.errors.gender && (
              <p className="mt-1.5 text-xs text-negative">{form.formState.errors.gender.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Color <span className="text-negative">*</span>
            </label>
            <input
              type="text"
              className={`input-field ${form.formState.errors.color ? 'error' : ''}`}
              placeholder="e.g., Blue, Black, Red"
              {...form.register('color', { required: 'Color is required' })}
            />
            {form.formState.errors.color && (
              <p className="mt-1.5 text-xs text-negative">{form.formState.errors.color.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Condition <span className="text-negative">*</span>
            </label>
            <select
              className={`input-field ${form.formState.errors.condition ? 'error' : ''}`}
              {...form.register('condition', { required: 'Condition is required' })}
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
            {form.formState.errors.condition && (
              <p className="mt-1.5 text-xs text-negative">
                {form.formState.errors.condition.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-500 text-foreground mb-1.5">
              Estimated Swap Value (₹) <span className="text-negative">*</span>
            </label>
            <input
              type="number"
              className={`input-field ${form.formState.errors.estimatedValue ? 'error' : ''}`}
              placeholder="e.g., 45"
              {...form.register('estimatedValue', {
                required: 'Estimated value is required',
                min: { value: 1, message: 'Value must be greater than 0' },
              })}
            />
            {form.formState.errors.estimatedValue && (
              <p className="mt-1.5 text-xs text-negative">
                {form.formState.errors.estimatedValue.message}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-500 text-foreground mb-1.5">
            Location <span className="text-negative">*</span>
          </label>
          <input
            type="text"
            className={`input-field ${form.formState.errors.location ? 'error' : ''}`}
            placeholder="e.g., Portland, OR"
            {...form.register('location', { required: 'Location is required' })}
          />
          {form.formState.errors.location && (
            <p className="mt-1.5 text-xs text-negative">{form.formState.errors.location.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-500 text-foreground mb-1.5">
            Description <span className="text-negative">*</span>
          </label>
          <textarea
            rows={5}
            className={`input-field resize-none ${form.formState.errors.description ? 'error' : ''}`}
            placeholder="Describe your item in detail. Include any flaws, measurements, or special features..."
            {...form.register('description', {
              required: 'Description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' },
            })}
          />
          {form.formState.errors.description && (
            <p className="mt-1.5 text-xs text-negative">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] btn-primary py-3 rounded-xl text-sm font-600 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating listing...
              </span>
            ) : (
              <>
                <span>Create Listing</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
