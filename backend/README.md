# SwapCloset Backend API

A full-featured REST API for the SwapCloset clothing exchange marketplace.

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Socket.io** for real-time chat
- **Cloudinary** for image storage
- **express-rate-limit** for API rate limiting

## Features

- User authentication (register, login, JWT tokens)
- Clothing listings CRUD operations
- Swap request management
- Real-time chat system
- Notifications system
- Favorites/wishlist
- Reviews and ratings
- Admin dashboard APIs
- Location-based matching
- Search and filtering

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swapcloset
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Listings
- `POST /api/listings` - Create listing (protected)
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `PUT /api/listings/:id` - Update listing (protected)
- `DELETE /api/listings/:id` - Delete listing (protected)
- `GET /api/listings/nearby` - Get nearby listings (protected)
- `GET /api/listings/similar/:id` - Get similar listings

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users/:id/listings` - Get user listings

### Swap Requests
- `POST /api/swaps` - Create swap request (protected)
- `GET /api/swaps` - Get swap requests (protected)
- `PUT /api/swaps/:id/accept` - Accept swap (protected)
- `PUT /api/swaps/:id/reject` - Reject swap (protected)
- `PUT /api/swaps/:id/cancel` - Cancel swap (protected)
- `PUT /api/swaps/:id/complete` - Complete swap (protected)

### Chats
- `GET /api/chats` - Get user chats (protected)
- `GET /api/chats/:id` - Get chat messages (protected)
- `POST /api/chats/:id/messages` - Send message (protected)
- `PUT /api/chats/:id/read` - Mark messages as read (protected)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/user/:id` - Get user reviews
- `GET /api/reviews/swap/:id` - Get swap reviews

### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)
- `PUT /api/notifications/read-all` - Mark all as read (protected)

### Favorites
- `POST /api/favorites` - Add to favorites (protected)
- `DELETE /api/favorites/:listingId` - Remove from favorites (protected)
- `GET /api/favorites` - Get user favorites (protected)

### Admin
- `GET /api/admin/stats` - Get platform statistics (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/suspend` - Suspend user (admin only)
- `GET /api/admin/listings` - Get all listings (admin only)
- `DELETE /api/admin/listings/:id` - Remove listing (admin only)
- `GET /api/admin/swaps` - Get all swaps (admin only)

## Database Models

### User
- email, password, name, avatar
- location (city, state, coordinates)
- role (user/admin), isVerified, isSuspended
- stats (totalListings, totalSwaps, averageRating, totalReviews)
- settings (notifications preferences)

### Listing
- userId, title, description, images
- category, brand, gender, size, color, condition
- estimatedValue, location, status
- swapValueRange, tags, views, favorites

### SwapRequest
- requesterId, receiverId
- requesterItemId, receiverItemId
- message, status, values
- timestamps for respondedAt, completedAt

### Chat
- participants, swapRequestId
- messages array with senderId, content, readAt

### Notification
- userId, type, title, message
- relatedId, isRead

### Review
- swapRequestId, reviewerId, revieweeId
- rating (1-5), comment

### Favorite
- userId, listingId (unique)

## Deployment

### Render
1. Push code to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy

### Environment Variables Required
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FRONTEND_URL`

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## License

ISC
