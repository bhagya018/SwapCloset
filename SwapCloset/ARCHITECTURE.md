# SwapCloset - Full-Stack Architecture Plan

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context + Zustand
- **HTTP Client**: Axios
- **Deployment**: Vercel

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Image Storage**: Cloudinary
- **Validation**: Zod
- **Rate Limiting**: express-rate-limit
- **CORS**: cors
- **Deployment**: Render

---

## Project Structure

```
SwapCloset/
├── frontend/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── profile/
│   │   │   │   ├── listings/
│   │   │   │   ├── swap-requests/
│   │   │   │   ├── favorites/
│   │   │   │   └── notifications/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx          # Home
│   │   │   │   ├── browse/
│   │   │   │   ├── listings/[id]/
│   │   │   │   ├── chat/
│   │   │   │   ├── about/
│   │   │   │   └── contact/
│   │   │   └── admin/
│   │   │       └── dashboard/
│   │   ├── components/
│   │   │   ├── ui/                   # Reusable UI components
│   │   │   ├── layout/               # Layout components
│   │   │   ├── forms/                # Form components
│   │   │   └── features/             # Feature-specific components
│   │   ├── lib/
│   │   │   ├── api/                  # API client
│   │   │   ├── auth/                 # Auth utilities
│   │   │   ├── socket/               # Socket.io client
│   │   │   └── utils/                # Helper functions
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useListings.ts
│   │   │   ├── useChat.ts
│   │   │   └── useNotifications.ts
│   │   ├── store/                    # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── listingStore.ts
│   │   │   └── chatStore.ts
│   │   └── types/                    # TypeScript types
│   ├── public/
│   └── package.json
│
├── backend/                           # Express.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── socket.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── listingController.ts
│   │   │   ├── swapController.ts
│   │   │   ├── chatController.ts
│   │   │   ├── reviewController.ts
│   │   │   ├── notificationController.ts
│   │   │   ├── favoriteController.ts
│   │   │   └── adminController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── admin.ts
│   │   │   ├── validation.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Listing.ts
│   │   │   ├── SwapRequest.ts
│   │   │   ├── Chat.ts
│   │   │   ├── Notification.ts
│   │   │   ├── Review.ts
│   │   │   └── Favorite.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── listings.ts
│   │   │   ├── swaps.ts
│   │   │   ├── chats.ts
│   │   │   ├── reviews.ts
│   │   │   ├── notifications.ts
│   │   │   ├── favorites.ts
│   │   │   └── admin.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── emailService.ts
│   │   │   ├── swapService.ts
│   │   │   └── notificationService.ts
│   │   ├── utils/
│   │   │   ├── validators.ts
│   │   │   ├── swapCalculator.ts
│   │   │   └── locationHelper.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Database Schemas (MongoDB)

### User Schema
```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  password: string (hashed, required),
  name: string (required),
  avatar: string (Cloudinary URL),
  location: {
    city: string,
    state: string,
    country: string,
    coordinates: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  },
  role: 'user' | 'admin',
  isVerified: boolean,
  isSuspended: boolean,
  bio: string,
  phone: string,
  joinedAt: Date,
  stats: {
    totalListings: number,
    totalSwaps: number,
    averageRating: number,
    totalReviews: number
  },
  settings: {
    emailNotifications: boolean,
    pushNotifications: boolean,
    locationVisible: boolean
  }
}
```

### Listing Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: string (required),
  description: string (required),
  images: [string] (Cloudinary URLs),
  category: string (required),
  brand: string (required),
  gender: string (required),
  size: string (required),
  color: string (required),
  condition: string (required),
  estimatedValue: number (required),
  location: {
    city: string,
    state: string,
    coordinates: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  },
  status: 'active' | 'swapped' | 'archived',
  swapValueRange: [number, number],
  tags: [string],
  views: number,
  favorites: number,
  createdAt: Date,
  updatedAt: Date
}
```

### SwapRequest Schema
```typescript
{
  _id: ObjectId,
  requesterId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  requesterItemId: ObjectId (ref: Listing),
  receiverItemId: ObjectId (ref: Listing),
  message: string,
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed',
  requesterValue: number,
  receiverValue: number,
  valueDifference: number,
  createdAt: Date,
  respondedAt: Date,
  completedAt: Date,
  chatId: ObjectId (ref: Chat)
}
```

### Chat Schema
```typescript
{
  _id: ObjectId,
  participants: [ObjectId] (ref: User),
  swapRequestId: ObjectId (ref: SwapRequest),
  messages: [{
    senderId: ObjectId (ref: User),
    content: string,
    image: string (optional),
    readAt: Date,
    createdAt: Date
  }],
  lastMessageAt: Date,
  createdAt: Date
}
```

### Notification Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'new_message' | 'item_favorited' | 'swap_completed',
  title: string,
  message: string,
  relatedId: ObjectId,
  isRead: boolean,
  createdAt: Date
}
```

### Review Schema
```typescript
{
  _id: ObjectId,
  swapRequestId: ObjectId (ref: SwapRequest),
  reviewerId: ObjectId (ref: User),
  revieweeId: ObjectId (ref: User),
  rating: number (1-5),
  comment: string,
  createdAt: Date
}
```

### Favorite Schema
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  listingId: ObjectId (ref: Listing),
  createdAt: Date,
  unique index: [userId, listingId]
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/avatar` - Upload avatar
- `DELETE /api/users/:id` - Delete user (admin)
- `PUT /api/users/:id/suspend` - Suspend user (admin)
- `GET /api/users/:id/listings` - Get user listings
- `GET /api/users/:id/reviews` - Get user reviews

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `PUT /api/listings/:id/status` - Update listing status
- `GET /api/listings/nearby` - Get nearby listings
- `GET /api/listings/similar/:id` - Get similar listings

### Swap Requests
- `GET /api/swaps` - Get user swap requests
- `GET /api/swaps/:id` - Get single swap request
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id/accept` - Accept swap request
- `PUT /api/swaps/:id/reject` - Reject swap request
- `PUT /api/swaps/:id/cancel` - Cancel swap request
- `PUT /api/swaps/:id/complete` - Mark swap as completed

### Chats
- `GET /api/chats` - Get user chats
- `GET /api/chats/:id` - Get chat messages
- `POST /api/chats/:id/messages` - Send message
- `PUT /api/chats/:id/read` - Mark messages as read

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:id` - Get user reviews
- `GET /api/reviews/swap/:id` - Get swap reviews

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/listings` - Get all listings
- `GET /api/admin/swaps` - Get all swaps
- `DELETE /api/admin/listings/:id` - Remove listing
- `PUT /api/admin/disputes/:id` - Resolve dispute

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## Implementation Roadmap

### Phase 1: Backend Foundation (Week 1-2)
1. Set up Express.js with TypeScript
2. Configure MongoDB Atlas connection
3. Implement User model and auth routes
4. Add JWT authentication middleware
5. Set up Cloudinary configuration

### Phase 2: Core Features (Week 3-4)
1. Implement Listing CRUD operations
2. Build Swap Request system
3. Add Favorites functionality
4. Create Notification system
5. Implement search and filters

### Phase 3: Advanced Features (Week 5-6)
1. Set up Socket.io for real-time chat
2. Build Review and Rating system
3. Add location-based matching
4. Implement swap value calculator
5. Create Admin panel APIs

### Phase 4: Frontend Integration (Week 7-8)
1. Set up API client with Axios
2. Replace mock data with real API calls
3. Implement authentication flow
4. Connect all pages to backend
5. Add loading states and error handling

### Phase 5: Testing & Deployment (Week 9)
1. Test all features end-to-end
2. Fix bugs and optimize performance
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Configure environment variables

---

## Security Measures

1. **Authentication**
   - JWT tokens with expiration
   - Refresh token mechanism
   - bcrypt password hashing (salt rounds: 12)

2. **API Security**
   - Rate limiting (100 requests per 15 minutes)
   - Input validation with Zod
   - CORS configuration
   - Protected routes middleware

3. **Data Protection**
   - Sanitize user inputs
   - Validate file uploads
   - Encrypt sensitive data
   - Secure MongoDB connection

4. **Environment Variables**
   - Never commit .env files
   - Use different configs for dev/prod
   - Rotate secrets regularly

---

## Performance Optimization

1. **Database**
   - Index frequently queried fields
   - Use pagination for large datasets
   - Implement caching with Redis (optional)

2. **Frontend**
   - Image optimization with Next.js Image
   - Code splitting with dynamic imports
   - Lazy loading for components
   - Debounce search inputs

3. **API**
   - Implement response compression
   - Use CDN for static assets
   - Optimize database queries
   - Add response caching where appropriate
