export interface MyListing {
  id: string;
  title: string;
  brand: string;
  category: string;
  size: string;
  condition: string;
  estimatedValue: number;
  status: 'active' | 'draft' | 'in-negotiation' | 'swapped' | 'archived';
  views: number;
  swapRequests: number;
  postedDate: string;
  imageUrl: string;
  imageAlt: string;
  color?: string;
}

export interface SwapRequest {
  id: string;
  type: 'incoming' | 'outgoing';
  otherUserName: string;
  otherUserAvatar: string;
  otherUserCity: string;
  theirItem: string;
  theirItemValue: number;
  myItem: string;
  myItemValue: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'negotiating';
  statusLabel: string;
  sentDaysAgo: number;
  lastMessage: string;
  listingId?: string;
}

export interface ActivityItem {
  id: string;
  type: 'swap_request' | 'listing_view' | 'swap_completed' | 'message' | 'listing_saved';
  description: string;
  time: string;
  icon: string;
}

export const MY_LISTINGS: MyListing[] = [
  {
    id: 'mylisting-001',
    title: 'Silk Midi Skirt — Dusty Rose',
    brand: 'ARITZIA',
    category: 'Bottoms',
    size: 'S',
    condition: 'Like New',
    estimatedValue: 88,
    status: 'active',
    views: 47,
    swapRequests: 3,
    postedDate: 'Jul 28, 2026',
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1ab464e37-1773214626767.png',
    imageAlt: 'Dusty rose silk midi skirt on hanger',
    color: '#E8B4B8',
  },
  {
    id: 'mylisting-002',
    title: 'Vintage Windbreaker — Cobalt',
    brand: 'Nike',
    category: 'Outerwear',
    size: 'M',
    condition: 'Good',
    estimatedValue: 65,
    status: 'in-negotiation',
    views: 83,
    swapRequests: 1,
    postedDate: 'Jul 22, 2026',
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_181e25e30-1766470464698.png',
    imageAlt: 'Cobalt blue vintage Nike windbreaker jacket',
    color: '#4A90A4',
  },
  {
    id: 'mylisting-003',
    title: 'Cream Linen Shirt',
    brand: 'Banana Republic',
    category: 'Tops',
    size: 'M',
    condition: 'Good',
    estimatedValue: 55,
    status: 'active',
    views: 31,
    swapRequests: 0,
    postedDate: 'Jul 15, 2026',
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_123e1249b-1784798292465.png',
    imageAlt: 'Cream linen button-down shirt',
    color: '#F5F5DC',
  },
  {
    id: 'mylisting-004',
    title: 'Chelsea Boots — Tan Suede',
    brand: 'Thursday Boot Co.',
    category: 'Shoes',
    size: '8',
    condition: 'Like New',
    estimatedValue: 95,
    status: 'active',
    views: 62,
    swapRequests: 2,
    postedDate: 'Jul 10, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1673437531214-1e48e0ebf59d',
    imageAlt: 'Tan suede chelsea boots on wooden floor',
    color: '#C19A6B',
  },
  {
    id: 'mylisting-005',
    title: 'Floral Midi Dress',
    brand: '& Other Stories',
    category: 'Dresses',
    size: 'S',
    condition: 'Good',
    estimatedValue: 72,
    status: 'draft',
    views: 0,
    swapRequests: 0,
    postedDate: 'Jul 5, 2026',
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a2202393-1772101260576.png',
    imageAlt: 'Floral print midi dress on hanger',
    color: '#FFB6C1',
  },
  {
    id: 'mylisting-006',
    title: 'Cashmere Cardigan — Oatmeal',
    brand: 'J.Crew',
    category: 'Tops',
    size: 'S',
    condition: 'Good',
    estimatedValue: 58,
    status: 'draft',
    views: 0,
    swapRequests: 0,
    postedDate: 'Jul 30, 2026',
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_157dbfe64-1769701950875.png',
    imageAlt: 'Oatmeal cashmere cardigan with buttons on neutral background',
    color: '#D2B48C',
  },
  {
    id: 'mylisting-007',
    title: 'Wide-Leg Corduroy Pants',
    brand: 'Madewell',
    category: 'Bottoms',
    size: '28',
    condition: 'Good',
    estimatedValue: 68,
    status: 'active',
    views: 38,
    swapRequests: 1,
    postedDate: 'Jul 27, 2026',
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_173ec5559-1772859184601.png',
    imageAlt: 'Wide-leg corduroy trousers in warm brown on clothing rack',
    color: '#8B4513',
  },
  {
    id: 'mylisting-008',
    title: 'Striped Breton Top',
    brand: 'Petit Bateau',
    category: 'Tops',
    size: 'XS',
    condition: 'Like New',
    estimatedValue: 35,
    status: 'archived',
    views: 22,
    swapRequests: 0,
    postedDate: 'Jun 15, 2026',
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1faaa3bbf-1767657765407.png',
    imageAlt: 'Navy and white striped Breton top on white hanger',
    color: '#1E3A5F',
  },
];

export const SWAP_REQUESTS: SwapRequest[] = [
  {
    id: 'swap-req-001',
    type: 'incoming',
    otherUserName: 'Priya Sharma',
    otherUserAvatar: 'PS',
    otherUserCity: 'Portland, OR',
    theirItem: 'Linen Blazer — Sage Green',
    theirItemValue: 78,
    myItem: 'Silk Midi Skirt — Dusty Rose',
    myItemValue: 88,
    status: 'pending',
    statusLabel: 'Awaiting your response',
    sentDaysAgo: 1,
    lastMessage:
      'Hi Maya! I love your skirt. Would you be interested in swapping for my Everlane blazer?',
    listingId: 'mylisting-001',
  },
  {
    id: 'swap-req-002',
    type: 'incoming',
    otherUserName: 'Jordan Kim',
    otherUserAvatar: 'JK',
    otherUserCity: 'Seattle, WA',
    theirItem: "Vintage Levi's 501 Jeans",
    theirItemValue: 55,
    myItem: 'Chelsea Boots — Tan Suede',
    myItemValue: 95,
    status: 'pending',
    statusLabel: 'Awaiting your response',
    sentDaysAgo: 2,
    lastMessage: "These boots are exactly my style! I have Levi's 501s in great condition...",
    listingId: 'mylisting-004',
  },
  {
    id: 'swap-req-003',
    type: 'outgoing',
    otherUserName: 'Camille Dubois',
    otherUserAvatar: 'CD',
    otherUserCity: 'Portland, OR',
    theirItem: 'Silk Slip Dress — Ivory',
    theirItemValue: 145,
    myItem: 'Vintage Windbreaker — Cobalt',
    myItemValue: 65,
    status: 'negotiating',
    statusLabel: 'In negotiation',
    sentDaysAgo: 3,
    lastMessage: 'The value difference is a bit large — can you add another item to the swap?',
    listingId: 'mylisting-002',
  },
  {
    id: 'swap-req-004',
    type: 'outgoing',
    otherUserName: 'Zoe Nakamura',
    otherUserAvatar: 'ZN',
    otherUserCity: 'Portland, OR',
    theirItem: 'Pleated Midi Skirt — Terracotta',
    theirItemValue: 72,
    myItem: 'Cream Linen Shirt',
    myItemValue: 42,
    status: 'accepted',
    statusLabel: 'Accepted — confirm meetup',
    sentDaysAgo: 1,
    lastMessage: "Love the linen shirt! Let's meet at Powell's on Saturday morning?",
    listingId: 'mylisting-003',
  },
  {
    id: 'swap-req-005',
    type: 'incoming',
    otherUserName: 'Alex Torres',
    otherUserAvatar: 'AT',
    otherUserCity: 'Eugene, OR',
    theirItem: 'Oversized Wool Sweater',
    theirItemValue: 62,
    myItem: 'Silk Midi Skirt — Dusty Rose',
    myItemValue: 88,
    status: 'rejected',
    statusLabel: 'Declined',
    sentDaysAgo: 5,
    lastMessage: 'No worries! Good luck finding a swap.',
    listingId: 'mylisting-001',
  },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'act-001',
    type: 'swap_request',
    description: 'Priya Sharma sent a swap request for your Silk Midi Skirt',
    time: '2 hours ago',
    icon: 'ArrowLeftRight',
  },
  {
    id: 'act-002',
    type: 'listing_view',
    description: 'Your Chelsea Boots got 8 new views today',
    time: '4 hours ago',
    icon: 'Eye',
  },
  {
    id: 'act-003',
    type: 'message',
    description: 'Zoe Nakamura replied to your swap negotiation',
    time: '6 hours ago',
    icon: 'MessageSquare',
  },
  {
    id: 'act-004',
    type: 'swap_request',
    description: 'Jordan Kim wants to swap for your Chelsea Boots',
    time: 'Yesterday',
    icon: 'ArrowLeftRight',
  },
  {
    id: 'act-005',
    type: 'listing_saved',
    description: 'Someone saved your Vintage Windbreaker',
    time: 'Yesterday',
    icon: 'Heart',
  },
  {
    id: 'act-006',
    type: 'swap_completed',
    description: 'Swap completed with Fatima — Floral Wrap Dress',
    time: '2 days ago',
    icon: 'CheckCircle',
  },
  {
    id: 'act-007',
    type: 'listing_view',
    description: 'Your Silk Midi Skirt reached 47 total views',
    time: '3 days ago',
    icon: 'Eye',
  },
];

export const SWAP_ACTIVITY_DATA = [
  { week: 'Jun 9', sent: 1, received: 2, completed: 0 },
  { week: 'Jun 16', sent: 3, received: 1, completed: 1 },
  { week: 'Jun 23', sent: 2, received: 4, completed: 2 },
  { week: 'Jun 30', sent: 0, received: 2, completed: 1 },
  { week: 'Jul 7', sent: 4, received: 3, completed: 0 },
  { week: 'Jul 14', sent: 2, received: 5, completed: 3 },
  { week: 'Jul 21', sent: 3, received: 2, completed: 2 },
  { week: 'Jul 28', sent: 5, received: 3, completed: 1 },
];

export const VALUE_BALANCE_DATA = [
  { month: 'Apr', given: 145, received: 120 },
  { month: 'May', given: 88, received: 210 },
  { month: 'Jun', given: 195, received: 180 },
  { month: 'Jul', given: 240, received: 155 },
];
