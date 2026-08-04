import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, bio, phone, location, settings } = req.body;

    const updateData: any = {};
    if (name) updateData.full_name = name;
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (settings) updateData.settings = settings;

    const { data: user, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', req.userId)
      .select()
      .single();

    if (error || !user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('owner_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    res.json({ listings: listings || [] });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
