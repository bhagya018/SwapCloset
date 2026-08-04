-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (replaces User model)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  profile_image TEXT,
  phone VARCHAR(20),
  location JSONB DEFAULT '{"city": "Unknown", "state": "Unknown", "country": "Unknown"}'::jsonb,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  bio TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stats JSONB DEFAULT '{"totalListings": 0, "totalSwaps": 0, "averageRating": 0, "totalReviews": 0}'::jsonb,
  settings JSONB DEFAULT '{"emailNotifications": true, "pushNotifications": true, "locationVisible": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category VARCHAR(100) NOT NULL CHECK (category IN ('Tops & T-Shirts', 'Dresses', 'Jeans & Pants', 'Jackets & Coats', 'Shoes', 'Accessories', 'Skirts', 'Sweaters & Hoodies')),
  brand VARCHAR(100) NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Women', 'Men', 'Unisex', 'Kids')),
  size VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  condition VARCHAR(50) NOT NULL CHECK (condition IN ('New with tags', 'Like new', 'Good', 'Fair', 'Poor')),
  estimated_value DECIMAL(10, 2) NOT NULL,
  location JSONB DEFAULT '{"city": "Unknown", "state": "Unknown"}'::jsonb,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'swapped', 'archived')),
  swap_value_range DECIMAL[] DEFAULT ARRAY[0, 100],
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swap requests table
CREATE TABLE swap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  receiver_listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
  requester_value DECIMAL(10, 2) NOT NULL,
  receiver_value DECIMAL(10, 2) NOT NULL,
  value_difference DECIMAL(10, 2) NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  chat_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (separate from chats for better structure)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  image TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('swap_request', 'swap_accepted', 'swap_rejected', 'new_message', 'item_favorited', 'swap_completed')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewed_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swap_request_id, reviewer_id)
);

-- Create indexes for better performance
CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
CREATE INDEX idx_swap_requests_sender ON swap_requests(sender_id);
CREATE INDEX idx_swap_requests_receiver ON swap_requests(receiver_id);
CREATE INDEX idx_swap_requests_status ON swap_requests(status);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_swap_request ON messages(swap_request_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewed_user_id);
CREATE INDEX idx_reviews_swap ON reviews(swap_request_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_listing ON favorites(listing_id);

-- Full text search for listings
CREATE INDEX idx_listings_search ON listings USING gin(to_tsvector('english', title || ' ' || description || ' ' || brand || ' ' || category));

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Listings
CREATE POLICY "Anyone can view listings" ON listings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create listings" ON listings FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update their listings" ON listings FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners can delete their listings" ON listings FOR DELETE USING (owner_id = auth.uid());
CREATE POLICY "Admins can manage all listings" ON listings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Swap Requests
CREATE POLICY "Sender and receiver can view requests" ON swap_requests FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Authenticated users can create requests" ON swap_requests FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Receiver can accept/reject requests" ON swap_requests FOR UPDATE USING (
  receiver_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Sender can cancel requests" ON swap_requests FOR UPDATE USING (
  sender_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to swap requests" ON swap_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Messages
CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM swap_requests sr
    JOIN messages m ON m.swap_request_id = sr.id
    WHERE sr.id = messages.swap_request_id
    AND (sr.sender_id = auth.uid() OR sr.receiver_id = auth.uid())
  )
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- RLS Policies for Favorites
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete their favorites" ON favorites FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for Notifications
CREATE POLICY "Users can read their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for Reviews
CREATE POLICY "Everyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (reviewer_id = auth.uid());
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (reviewer_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_swap_requests_updated_at BEFORE UPDATE ON swap_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper RPC functions for stats management
CREATE OR REPLACE FUNCTION increment_stat(user_id UUID, stat_field TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET stats = jsonb_set(
    COALESCE(stats, '{}'::jsonb),
    ARRAY[stat_field],
    COALESCE((stats->stat_field)::integer, 0) + 1
  )
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_stat(user_id UUID, stat_field TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET stats = jsonb_set(
    COALESCE(stats, '{}'::jsonb),
    ARRAY[stat_field],
    GREATEST(COALESCE((stats->stat_field)::integer, 0) - 1, 0)
  )
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_favorite_count(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings
  SET favorites = COALESCE(favorites, 0) + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_favorite_count(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings
  SET favorites = GREATEST(COALESCE(favorites, 0) - 1, 0)
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;
