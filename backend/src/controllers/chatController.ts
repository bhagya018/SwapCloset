import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getChats = async (req: any, res: Response): Promise<void> => {
  try {
    // Get all swap requests where user is participant
    const { data: swapRequests } = await supabase
      .from('swap_requests')
      .select('*')
      .or(`sender_id.eq.${req.userId},receiver_id.eq.${req.userId}`)
      .order('created_at', { ascending: false });

    // For each swap request, get messages
    const chats = await Promise.all(
      (swapRequests || []).map(async (swap: any) => {
        const [sender, receiver] = await Promise.all([
          supabase.from('profiles').select('full_name, profile_image').eq('id', swap.sender_id).single(),
          supabase.from('profiles').select('full_name, profile_image').eq('id', swap.receiver_id).single(),
        ]);

        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('swap_request_id', swap.id)
          .order('created_at', { ascending: true });

        return {
          id: swap.id,
          participants: [sender.data, receiver.data],
          swapRequestId: swap,
          messages: messages || [],
          lastMessageAt: (messages && messages.length > 0) ? messages[messages.length - 1].created_at : swap.created_at,
        };
      })
    );

    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getChatById = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: swapRequest } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!swapRequest) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    // Check if user is participant
    if (swapRequest.sender_id !== req.userId && swapRequest.receiver_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to view this chat' });
      return;
    }

    const [sender, receiver] = await Promise.all([
      supabase.from('profiles').select('full_name, profile_image').eq('id', swapRequest.sender_id).single(),
      supabase.from('profiles').select('full_name, profile_image').eq('id', swapRequest.receiver_id).single(),
    ]);

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('swap_request_id', swapRequest.id)
      .order('created_at', { ascending: true });

    res.json({
      chat: {
        id: swapRequest.id,
        participants: [sender.data, receiver.data],
        swapRequestId: swapRequest,
        messages: messages || [],
      },
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { content, image } = req.body;

    const { data: swapRequest } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!swapRequest) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    // Check if user is participant
    if (swapRequest.sender_id !== req.userId && swapRequest.receiver_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to send message in this chat' });
      return;
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        swap_request_id: req.params.id,
        sender_id: req.userId,
        message: content,
        image,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Create notification for recipient
    const recipientId = swapRequest.sender_id === req.userId ? swapRequest.receiver_id : swapRequest.sender_id;
    await supabase
      .from('notifications')
      .insert({
        user_id: recipientId,
        type: 'new_message',
        title: 'New Message',
        message: 'You have a new message',
        related_id: req.params.id,
      });

    res.json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markMessagesAsRead = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: swapRequest } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!swapRequest) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    // Mark all messages from other users as read
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('swap_request_id', req.params.id)
      .neq('sender_id', req.userId)
      .is('read_at', null);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
