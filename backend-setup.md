# KEMRI GMD Site Backend Setup Guide

This guide explains how to set up and run the backend for the KEMRI Grant Management Department website. The backend provides REST API endpoints for dynamic content, user authentication, and search functionality.

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v14+)
- MongoDB (v4+)
- npm (v6+)

## Installation Steps

### 1. Install Dependencies

```bash
# Install all dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/kemri-gmd
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
NODE_ENV=development
```

Make sure to change the JWT_SECRET to a secure random string in production.

### 3. Set Up the Database

#### Option 1: Start with sample data

```bash
# Import sample data into the database
npm run seeder:import
```

#### Option 2: Start with an empty database

The database collections will be created automatically when you start the server.

### 4. Start the Backend Server

#### Development mode (with auto-restart)

```bash
npm run dev
```

#### Production mode

```bash
npm start
```

The server will start and listen on the port you specified in the `.env` file (default: 5000).

## API Endpoints

The API provides the following endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `GET /api/auth/logout` - Logout user

### News

- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get single news article
- `POST /api/news` - Create news article (admin only)
- `PUT /api/news/:id` - Update news article (admin only)
- `DELETE /api/news/:id` - Delete news article (admin only)

### Resources

- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (admin only)
- `PUT /api/resources/:id` - Update resource (admin only)
- `DELETE /api/resources/:id` - Delete resource (admin only)
- `GET /api/resources/:id/download` - Download a resource (tracks download count)

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (admin only)
- `GET /api/contact/:id` - Get single contact submission (admin only)
- `PUT /api/contact/:id` - Update contact status (admin only)
- `DELETE /api/contact/:id` - Delete contact submission (admin only)

### Search

- `GET /api/search?q=query&category=all` - Search across all content

## Frontend Integration

The `backend/frontend-integration` directory contains examples of how to integrate the backend API with the existing frontend:

1. Replace static JavaScript files with API-integrated versions
2. Update the contact form to submit to the API
3. Add authentication for admin access
4. Fetch dynamic content from the API

Follow the detailed instructions in `backend/frontend-integration/README.md` for the integration process.

## Admin Account

If you used the sample data seeder, an admin account is created with the following credentials:

- Email: admin@kemri.org
- Password: password123

**Important**: Change this password immediately in production.

## Testing

Run tests with:

```bash
npm test
```

## Production Deployment

For production deployment:

1. Update the `.env` file with production settings
2. Use a process manager like PM2 to run the server
3. Set up a reverse proxy with Nginx or Apache
4. Enable HTTPS
5. Set up database backups

## Troubleshooting

If you encounter issues:

- Check MongoDB connection in your `.env` file
- Ensure MongoDB service is running
- Check server logs for errors
- Make sure all required environment variables are set

## Integration with Main KEMRI Website

To integrate with the main KEMRI website:

1. Configure CORS to allow requests from the main site
2. Set up shared authentication if needed
3. Create API endpoints for cross-site data access

## Support

For questions or support, contact the development team at your organization. 