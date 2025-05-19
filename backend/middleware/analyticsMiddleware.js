const mongoose = require('mongoose');

// Define Analytics Schema
const analyticsSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  referrer: String
});

// Create model if it doesn't exist already
const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);

// Middleware to track page views
const trackPageView = async (req, res, next) => {
  try {
    // Only track HTML page requests (not API calls, images, etc.)
    if (!req.path.startsWith('/api/') && 
        !req.path.includes('.') && 
        req.method === 'GET') {
      
      // Don't block the response - update analytics in background
      const update = async () => {
        const existingPath = await Analytics.findOne({ path: req.path });
        
        if (existingPath) {
          // Update existing record
          await Analytics.updateOne(
            { path: req.path },
            { 
              $inc: { count: 1 },
              lastAccessed: Date.now(),
              userAgent: req.headers['user-agent'],
              referrer: req.headers.referer || ''
            }
          );
        } else {
          // Create new record
          const newAnalytic = new Analytics({
            path: req.path,
            userAgent: req.headers['user-agent'],
            referrer: req.headers.referer || ''
          });
          await newAnalytic.save();
        }
      };
      
      // Don't await - let it run in background
      update().catch(err => console.error('Analytics error:', err));
    }
    
    // Always continue to next middleware
    next();
  } catch (err) {
    console.error('Analytics middleware error:', err);
    next(); // Continue even if analytics fails
  }
};

// Function to get popular resources
const getPopularResources = async (limit = 5) => {
  try {
    const popular = await Analytics.find({
      path: { $regex: /^\/resources/ }
    })
    .sort({ count: -1 })
    .limit(limit);
    
    return popular;
  } catch (err) {
    console.error('Error getting popular resources:', err);
    return [];
  }
};

module.exports = { 
  trackPageView,
  getPopularResources
}; 