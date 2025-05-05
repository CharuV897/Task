# Social Media Platform Backend

A RESTful API backend for a social media platform with user authentication, post creation, likes, and image uploads.

## Features

- User Authentication**:
  - Local authentication with email/password
  - OAuth authentication with Google and Facebook
  - JWT-based authentication for API access
  - Password hashing with bcrypt

- Post Management:
  - Create, read, update, and delete posts
  - Like/unlike posts
  - Pagination for post listings

- Image Uploads:
  - Upload images to AWS S3
  - Associate images with posts

- Security:
  - Protected routes with authentication middleware
  - Input validation
  - Rate limiting to prevent abuse
  - Proper error handling

## Tech Stack

- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- Passport.js for authentication strategies
- AWS SDK for S3 integration
- JWT for secure API access
- Multer for file uploads
- bcrypt for password hashing

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/google` - OAuth login with Google
- `GET /api/auth/facebook` - OAuth login with Facebook
- `GET /api/auth/me` - Get current user details
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change user password

### Posts

- `GET /api/posts` - Get all posts (paginated)
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post (owner only)
- `DELETE /api/posts/:id` - Delete a post (owner only)
- `GET /api/posts/me` - Get current user's posts

### Likes

- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post

### Image Upload

- `POST /api/posts/upload` - Upload an image for a post

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- AWS S3 account
- Google and Facebook developer accounts (for OAuth)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/social-media-backend.git
   cd social-media-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   
   # Facebook OAuth
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
   
   # AWS S3
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name
   
   # Frontend URL (for OAuth redirects)
   FRONTEND_URL=http://localhost:3000
   
4. Start the server:
   # Development mode
   npm run dev