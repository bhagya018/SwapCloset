import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getNotifications = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId)
      .eq('is_read', false);

    if (countError) {
      console.error('Supabase count error:', countError);
    }

    res.json({ notifications: notifications || [], unreadCount: count || 0 });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAllAsRead = async (req: any, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.userId)
      .eq('is_read', false);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
