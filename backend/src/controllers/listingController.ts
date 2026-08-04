import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const createListing = async (req: any, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      images,
      category,
      brand,
      gender,
      size,
      color,
      condition,
      estimatedValue,
      location,
      tags,
    } = req.body;

    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        owner_id: req.userId,
        title,
        description,
        images: images || [],
        category,
        brand,
        gender,
        size,
        color,
        condition,
        estimated_value: estimatedValue,
        location: location || { city: 'Unknown', state: 'Unknown' },
        swap_value_range: [Math.max(0, estimatedValue - 15), estimatedValue + 15],
        tags: tags || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Update user stats
    await supabase.rpc('increment_stat', {
      user_id: req.userId,
      stat_field: 'totalListings'
    });

    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      brand,
      gender,
      size,
      condition,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    let query = supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%`);
    }

    // Category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Brand filter
    if (brand) {
      query = query.eq('brand', brand);
    }

    // Gender filter
    if (gender && gender !== 'All') {
      query = query.eq('gender', gender);
    }

    // Size filter
    if (size) {
      query = query.eq('size', size);
    }

    // Condition filter
    if (condition) {
      query = query.eq('condition', condition);
    }

    // Price range filter
    if (minPrice) {
      query = query.gte('estimated_value', Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte('estimated_value', Number(maxPrice));
    }

    // Sorting
    switch (sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'highest':
        query = query.order('estimated_value', { ascending: false });
        break;
      case 'lowest':
        query = query.order('estimated_value', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    const { data: listings, count, error } = await query.range(from, to);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Fetch owner details for each listing
    const listingsWithOwners = await Promise.all(
      (listings || []).map(async (listing: any) => {
        const { data: owner } = await supabase
          .from('profiles')
          .select('full_name, profile_image, location')
          .eq('id', listing.owner_id)
          .single();
        return { ...listing, userId: { ...owner, id: listing.owner_id } };
      })
    );

    res.json({
      listings: listingsWithOwners,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    // Fetch owner details
    const { data: owner } = await supabase
      .from('profiles')
      .select('full_name, profile_image, location, stats')
      .eq('id', listing.owner_id)
      .single();

    // Increment view count
    await supabase
      .from('listings')
      .update({ views: (listing.views || 0) + 1 })
      .eq('id', req.params.id);

    res.json({ listing: { ...listing, userId: { ...owner, id: listing.owner_id } } });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateListing = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: listing } = await supabase
      .from('listings')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.owner_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to update this listing' });
      return;
    }

    const { data: updatedListing, error } = await supabase
      .from('listings')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    res.json({ message: 'Listing updated successfully', listing: updatedListing });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteListing = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: listing } = await supabase
      .from('listings')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.owner_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to delete this listing' });
      return;
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Update user stats
    await supabase.rpc('decrement_stat', {
      user_id: req.userId,
      stat_field: 'totalListings'
    });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNearbyListings = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: user } = await supabase
      .from('profiles')
      .select('location')
      .eq('id', req.userId)
      .single();

    if (!user || !user.location?.coordinates) {
      res.status(400).json({ message: 'User location not set' });
      return;
    }

    const { distance = 50 } = req.query; // Default 50 miles

    // Note: PostgreSQL doesn't have built-in geospatial like MongoDB
    // For now, return all active listings (can be enhanced with PostGIS later)
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Fetch owner details
    const listingsWithOwners = await Promise.all(
      (listings || []).map(async (listing: any) => {
        const { data: owner } = await supabase
          .from('profiles')
          .select('full_name, profile_image, location')
          .eq('id', listing.owner_id)
          .single();
        return { ...listing, userId: { ...owner, id: listing.owner_id } };
      })
    );

    res.json({ listings: listingsWithOwners });
  } catch (error) {
    console.error('Get nearby listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSimilarListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: listing } = await supabase
      .from('listings')
      .select('category, brand, gender')
      .eq('id', req.params.id)
      .single();

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    const { data: similarListings, error } = await supabase
      .from('listings')
      .select('*')
      .neq('id', req.params.id)
      .eq('status', 'active')
      .or(`category.eq.${listing.category},brand.eq.${listing.brand},gender.eq.${listing.gender}`)
      .limit(6);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Fetch owner details
    const listingsWithOwners = await Promise.all(
      (similarListings || []).map(async (item: any) => {
        const { data: owner } = await supabase
          .from('profiles')
          .select('full_name, profile_image, location')
          .eq('id', item.owner_id)
          .single();
        return { ...item, userId: { ...owner, id: item.owner_id } };
      })
    );

    res.json({ listings: listingsWithOwners });
  } catch (error) {
    console.error('Get similar listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
