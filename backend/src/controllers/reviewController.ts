import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const createReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { swapRequestId, revieweeId, rating, comment } = req.body;

    // Check if swap is completed
    const { data: swapRequest } = await supabase
      .from('swap_requests')
      .select('*')
      .eq('id', swapRequestId)
      .single();

    if (!swapRequest || swapRequest.status !== 'completed') {
      res.status(400).json({ message: 'Swap must be completed to leave a review' });
      return;
    }

    // Check if user is part of the swap
    if (swapRequest.sender_id !== req.userId && swapRequest.receiver_id !== req.userId) {
      res.status(403).json({ message: 'Not authorized to review this swap' });
      return;
    }

    // Check if already reviewed
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('swap_request_id', swapRequestId)
      .eq('reviewer_id', req.userId)
      .single();

    if (existingReview) {
      res.status(400).json({ message: 'You have already reviewed this swap' });
      return;
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        swap_request_id: swapRequestId,
        reviewer_id: req.userId,
        reviewed_user_id: revieweeId,
        rating,
        review: comment,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Update reviewee's stats
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewed_user_id', revieweeId);

    const totalRating = (reviews || []).reduce((sum: number, r: any) => sum + r.rating, 0);
    const averageRating = totalRating / (reviews?.length || 1);

    await supabase
      .from('profiles')
      .update({
        stats: {
          averageRating,
          totalReviews: reviews?.length || 0,
        },
      })
      .eq('id', revieweeId);

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewed_user_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Fetch reviewer details
    const reviewsWithReviewers = await Promise.all(
      (reviews || []).map(async (review: any) => {
        const { data: reviewer } = await supabase
          .from('profiles')
          .select('full_name, profile_image')
          .eq('id', review.reviewer_id)
          .single();
        return { ...review, reviewerId: { ...reviewer, id: review.reviewer_id } };
      })
    );

    res.json({ reviews: reviewsWithReviewers });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSwapReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('swap_request_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }

    // Fetch reviewer and reviewee details
    const reviewsWithUsers = await Promise.all(
      (reviews || []).map(async (review: any) => {
        const [reviewer, reviewee] = await Promise.all([
          supabase.from('profiles').select('full_name, profile_image').eq('id', review.reviewer_id).single(),
          supabase.from('profiles').select('full_name, profile_image').eq('id', review.reviewed_user_id).single(),
        ]);

        return {
          ...review,
          reviewerId: { ...reviewer.data, id: review.reviewer_id },
          revieweeId: { ...reviewee.data, id: review.reviewed_user_id },
        };
      })
    );

    res.json({ reviews: reviewsWithUsers });
  } catch (error) {
    console.error('Get swap reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
