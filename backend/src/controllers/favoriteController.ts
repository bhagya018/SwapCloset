import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const addToFavorites = async (req: any, res: Response): Promise<void> => {
  try {
    const { listingId } = req.body;

    // Check if already favorited
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', req.userId)
      .eq('listing_id', listingId)
      .single();

    if (existingFavorite) {
      res.status(400).json({ message: 'Listing already in favorites' });
      return;
    }

    const { data: favorite, error } = await supabase
      .from('favorites')
      .insert({
        user_id: req.userId,
        listing_id: listingId,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Increment listing favorite count
    await supabase.rpc('increment_favorite_count', { listing_id: listingId });

    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromFavorites = async (req: any, res: Response): Promise<void> => {
  try {
    const { listingId } = req.params;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', req.userId)
      .eq('listing_id', listingId);

    if (error) {
      console.error('Supabase error:', error);
      res.status(404).json({ message: 'Favorite not found' });
      return;
    }

    // Decrement listing favorite count
    await supabase.rpc('decrement_favorite_count', { listing_id: listingId });

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFavorites = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Fetch listing details for each favorite
    const favoritesWithListings = await Promise.all(
      (favorites || []).map(async (favorite: any) => {
        const { data: listing } = await supabase
          .from('listings')
          .select('*')
          .eq('id', favorite.listing_id)
          .single();
        return { ...favorite, listingId: listing };
      })
    );

    res.json({ favorites: favoritesWithListings });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
