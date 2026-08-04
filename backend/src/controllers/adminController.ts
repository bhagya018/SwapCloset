import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [users, listings, swaps, pending, active] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('listings').select('*', { count: 'exact', head: true }),
      supabase.from('swap_requests').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('swap_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    ]);

    res.json({
      totalUsers: users.count || 0,
      totalListings: listings.count || 0,
      totalSwaps: swaps.count || 0,
      pendingRequests: pending.count || 0,
      activeListings: active.count || 0,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    const { data: users, count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Remove passwords from response
    const usersWithoutPasswords = (users || []).map((user: any) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      users: usersWithoutPasswords,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const suspendUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .update({ is_suspended: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User suspended successfully', user });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    const { data: listings, count, error } = await supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

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
          .select('full_name, email')
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
    console.error('Get all listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    console.error('Remove listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllSwaps = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    const { data: swaps, count, error } = await supabase
      .from('swap_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Fetch user details for each swap
    const swapsWithUsers = await Promise.all(
      (swaps || []).map(async (swap: any) => {
        const [sender, receiver] = await Promise.all([
          supabase.from('profiles').select('full_name, email').eq('id', swap.sender_id).single(),
          supabase.from('profiles').select('full_name, email').eq('id', swap.receiver_id).single(),
        ]);

        return {
          ...swap,
          requesterId: { ...sender.data, id: swap.sender_id },
          receiverId: { ...receiver.data, id: swap.receiver_id },
        };
      })
    );

    res.json({
      swaps: swapsWithUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
