# KEMRI Grant Management Department Backend

This is the backend API for the KEMRI Grant Management Department website. It provides RESTful endpoints for managing content, user authentication, and search functionality.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository (if you haven't already)
```
git clone <repository-url>
cd kemri-gmd-site
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/kemri-gmd
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
NODE_ENV=development
```

## Running the Server

### Development mode
```
npm run dev
```

### Production mode
```
npm start
```

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current logged in user
- `GET /api/auth/logout` - Logout user

### News Routes
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get single news article
- `POST /api/news` - Create news article (Admin only)
- `PUT /api/news/:id` - Update news article (Admin only)
- `DELETE /api/news/:id` - Delete news article (Admin only)

### Resource Routes
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (Admin only)
- `PUT /api/resources/:id` - Update resource (Admin only)
- `DELETE /api/resources/:id` - Delete resource (Admin only)
- `GET /api/resources/:id/download` - Download a resource and track download count

### Contact Routes
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (Admin only)
- `GET /api/contact/:id` - Get single contact submission (Admin only)
- `PUT /api/contact/:id` - Update contact submission status (Admin only)
- `DELETE /api/contact/:id` - Delete contact submission (Admin only)

### Search Routes
- `GET /api/search?q=query&category=all` - Search across all content

## Integration with Frontend

To integrate this backend with the existing frontend:

1. Update the frontend JavaScript files to call the API endpoints instead of using simulated data
2. Modify the contact form to submit to the API endpoint
3. Implement token-based authentication in the frontend
4. Update the search functionality to use the search API

## Connecting to the Main KEMRI Website

To integrate this with the main KEMRI website:

1. Ensure both systems use compatible authentication mechanisms
2. Set up API endpoints for cross-site data sharing
3. Consider implementing SSO (Single Sign-On) if both systems need shared login
4. Use CORS headers to allow cross-origin requests between the systems 