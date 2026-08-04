import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const createSwapRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { receiverItemId, requesterItemId, message } = req.body;

    // Get the receiver's item
    const { data: receiverItem } = await supabase
      .from('listings')
      .select('*')
      .eq('id', receiverItemId)
      .single();

    if (!receiverItem) {
      res.status(404).json({ message: 'Receiver item not found' });
      return;
    }

    // Get the requester's item
    const { data: requesterItem } = await supabase
      .from('listings')
      .select('*')
      .eq('id', requesterItemId)
      .single();

    if (!requesterItem) {
      res.status(404).json({ message: 'Requester item not found' });
      return;
    }

    // Verify ownership
    if (requesterItem.owner_id !== req.userId) {
      res.status(403).json({ message: 'You do not own this item' });
      return;
    }

    if (receiverItem.owner_id === req.userId) {
      res.status(400).json({ message: 'Cannot swap with yourself' });
      return;
    }

    // Calculate value difference
    const valueDifference = requesterItem.estimated_value - receiverItem.estimated_value;

    const { data: swapRequest, error } = await supabase
      .from('swap_requests')
      .insert({
        sender_id: req.userId,
        receiver_id: receiverItem.owner_id,
        sender_listing_id: requesterItemId,
        receiver_listing_id: receiverItemId,
        message,
        requester_value: requesterItem.estimated_value,
        receiver_value: receiverItem.estimated_value,
        value_difference: valueDifference,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Create notification for receiver
    await supabase
      .from('notifications')
      .insert({
        user_id: receiverItem.owner_id,
        type: 'swap_request',
        title: 'New Swap Request',
        message: `${req.body.userName || 'Someone'} wants to swap with you`,
        related_id: swapRequest.id,
      });

    res.status(201).json({ message: 'Swap request sent', swapRequest });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSwapRequests = async (req: any, res: Response): Promise<void> => {
  try {
    const { type = 'all' } = req.query;

    let query = supabase
      .from('swap_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (type === 'sent') {
      query = query.eq('sender_id', req.userId);
    } else if (type === 'received') {
      query = query.eq('receiver_id', req.userId);
    } else {
      query = query.or(`sender_id.eq.${req.userId},receiver_id.eq.${req.userId}`);
    }

    const { data: swapRequests, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Fetch related data for each swap request
    const swapRequestsWithDetails = await Promise.all(
      (swapRequests || []).map(async (swap: any) => {
        const [sender, receiver, senderItem, receiverItem] = await Promise.all([
          supabase.from('profiles').select('full_name, profile_image, location').eq('id', swap.sender_id).single(),
          supabase.from('profiles').select('full_name, profile_image, location').eq('id', swap.receiver_id).single(),
          supabase.from('listings').select('*').eq('id', swap.sender_listing_id).single(),
          supabase.from('listings').select('*').eq('id', swap.receiver_listing_id).single(),
        ]);

        return {
          ...swap,
          requesterId: { ...sender.data, id: swap.sender_id },
          receiverId: { ...receiver.data, id: swap.receiver_id },
          requesterItemId: senderItem.data,
          receiverItemId: receiverItem.data,
        };
      })
    );

    res.json({ swapRequests: swapRequestsWithDetails });
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptSwapRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: swapRequest } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!swapRequest) {
      res.status(404).json({ message: 'Swap request not found' });
      return;
    }

    if (swapRequest.receiver_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to accept this request' });
      return;
    }

    if (swapRequest.status !== 'pending') {
      res.status(400).json({ message: 'Swap request is not pending' });
      return;
    }

    const { error } = await supabase
      .from('swap_requests')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString(),
      })
      .eq('id', req.params.id);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: swapRequest.sender_id,
        type: 'swap_accepted',
        title: 'Swap Request Accepted',
        message: 'Your swap request has been accepted',
        related_id: swapRequest.id,
      });

    res.json({ message: 'Swap request accepted', swapRequest: { ...swapRequest, status: 'accepted', responded_at: new Date() } });
  } catch (error) {
    console.error('Accept swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectSwapRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: swapRequest } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!swapRequest) {
      res.status(404).json({ message: 'Swap request not found' });
      return;
    }

    if (swapRequest.receiver_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to reject this request' });
      return;
    }

    if (swapRequest.status !== 'pending') {
      res.status(400).json({ message: 'Swap request is not pending' });
      return;
    }

    const { error } = await supabase
      .from('swap_requests')
      .update({
        status: 'rejected',
        responded_at: new Date().toISOString(),
      })
      .eq('id', req.params.id);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: swapRequest.sender_id,
        type: 'swap_rejected',
        title: 'Swap Request Rejected',
        message: 'Your swap request has been rejected',
        related_id: swapRequest.id,
      });

    res.json({ message: 'Swap request rejected', swapRequest: { ...swapRequest, status: 'rejected', responded_at: new Date() } });
  } catch (error) {
    console.error('Reject swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelSwapRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: swapRequest } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!swapRequest) {
      res.status(404).json({ message: 'Swap request not found' });
      return;
    }

    if (swapRequest.sender_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to cancel this request' });
      return;
    }

    if (swapRequest.status !== 'pending') {
      res.status(400).json({ message: 'Can only cancel pending requests' });
      return;
    }

    const { error } = await supabase
      .from('swap_requests')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    res.json({ message: 'Swap request cancelled', swapRequest: { ...swapRequest, status: 'cancelled' } });
  } catch (error) {
    console.error('Cancel swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const completeSwap = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: swapRequest } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!swapRequest) {
      res.status(404).json({ message: 'Swap request not found' });
      return;
    }

    if (swapRequest.sender_id !== req.userId && swapRequest.receiver_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to complete this swap' });
      return;
    }

    if (swapRequest.status !== 'accepted') {
      res.status(400).json({ message: 'Swap must be accepted before completion' });
      return;
    }

    const { error } = await supabase
      .from('swap_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', req.params.id);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Mark items as swapped
    await supabase
      .from('listings')
      .update({ status: 'swapped' })
      .eq('id', swapRequest.sender_listing_id);

    await supabase
      .from('listings')
      .update({ status: 'swapped' })
      .eq('id', swapRequest.receiver_listing_id);

    // Update user stats
    await supabase.rpc('increment_stat', {
      user_id: swapRequest.sender_id,
      stat_field: 'totalSwaps'
    });

    await supabase.rpc('increment_stat', {
      user_id: swapRequest.receiver_id,
      stat_field: 'totalSwaps'
    });

    // Create notifications for both users
    await supabase
      .from('notifications')
      .insert({
        user_id: swapRequest.sender_id,
        type: 'swap_completed',
        title: 'Swap Completed',
        message: 'Your swap has been completed successfully',
        related_id: swapRequest.id,
      });

    await supabase
      .from('notifications')
      .insert({
        user_id: swapRequest.receiver_id,
        type: 'swap_completed',
        title: 'Swap Completed',
        message: 'Your swap has been completed successfully',
        related_id: swapRequest.id,
      });

    res.json({ message: 'Swap completed', swapRequest: { ...swapRequest, status: 'completed', completed_at: new Date() } });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
