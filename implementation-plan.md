# KEMRI Grant Management Department Website Enhancement Plan

## Phase 1: Interactive Funding Database

### Database Structure
```javascript
// models/fundingOpportunity.js
const mongoose = require('mongoose');

const fundingOpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  funder: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  researchAreas: [{
    type: String
  }],
  minFunding: Number,
  maxFunding: Number,
  eligibility: {
    type: String,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  announcementDate: Date,
  applicationLink: String,
  applicationTips: String,
  contactPerson: String,
  contactEmail: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Create text index for search functionality
fundingOpportunitySchema.index({ 
  title: 'text', 
  description: 'text', 
  funder: 'text',
  researchAreas: 'text'
});

module.exports = mongoose.model('FundingOpportunity', fundingOpportunitySchema);
```

### API Routes
```javascript
// routes/fundingRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllFunding, 
  getFundingById, 
  searchFunding, 
  createFunding,
  updateFunding,
  deleteFunding 
} = require('../controllers/fundingController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllFunding);
router.get('/search', searchFunding);
router.get('/:id', getFundingById);

// Protected routes (admin only)
router.post('/', authenticate, isAdmin, createFunding);
router.put('/:id', authenticate, isAdmin, updateFunding);
router.delete('/:id', authenticate, isAdmin, deleteFunding);

module.exports = router;
```

### API Controllers
```javascript
// controllers/fundingController.js
const FundingOpportunity = require('../models/fundingOpportunity');

// Get all funding opportunities with filtering options
exports.getAllFunding = async (req, res) => {
  try {
    const { 
      researchArea, 
      minFunding, 
      maxFunding, 
      funder, 
      isActive,
      upcoming 
    } = req.query;
    
    let query = {};
    
    // Add filters if specified
    if (researchArea) {
      query.researchAreas = researchArea;
    }
    
    if (minFunding) {
      query.maxFunding = { $gte: parseInt(minFunding) };
    }
    
    if (maxFunding) {
      query.minFunding = { $lte: parseInt(maxFunding) };
    }
    
    if (funder) {
      query.funder = funder;
    }
    
    if (isActive === 'true') {
      query.isActive = true;
    }
    
    if (upcoming === 'true') {
      const today = new Date();
      query.applicationDeadline = { $gt: today };
    }
    
    const opportunities = await FundingOpportunity.find(query)
      .sort({ applicationDeadline: 1 });
      
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search funding opportunities
exports.searchFunding = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const opportunities = await FundingOpportunity.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get funding opportunity by ID
exports.getFundingById = async (req, res) => {
  try {
    const opportunity = await FundingOpportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ message: 'Funding opportunity not found' });
    }
    
    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin routes for creating, updating, and deleting funding opportunities
exports.createFunding = async (req, res) => {
  try {
    const opportunity = new FundingOpportunity(req.body);
    const savedOpportunity = await opportunity.save();
    res.status(201).json(savedOpportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateFunding = async (req, res) => {
  try {
    const opportunity = await FundingOpportunity.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!opportunity) {
      return res.status(404).json({ message: 'Funding opportunity not found' });
    }
    
    res.json(opportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFunding = async (req, res) => {
  try {
    const opportunity = await FundingOpportunity.findByIdAndDelete(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ message: 'Funding opportunity not found' });
    }
    
    res.json({ message: 'Funding opportunity deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### Frontend Pages

#### 1. Funding Opportunities Page (funding.html)
This page will display all funding opportunities with search and filter options.

#### 2. Funding Detail Page (funding-detail.html)
This page will show detailed information about a specific funding opportunity.

#### 3. Admin Dashboard for Managing Funding Opportunities

### Implementation Steps
1. Create the MongoDB model for funding opportunities
2. Implement the API routes and controllers
3. Create frontend pages with search and filter functionality
4. Implement admin interface for managing funding opportunities
5. Add email notification system for upcoming deadlines

## Phase 2: Grant Success Stories and Researcher Profiles

This phase will involve creating a database of successful grant recipients and their projects.

### Database Structure
```javascript
// models/successStory.js
const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  researcher: {
    name: {
      type: String,
      required: true
    },
    title: String,
    department: String,
    email: String,
    photo: String,
    bio: String
  },
  project: {
    title: {
      type: String,
      required: true
    },
    abstract: {
      type: String,
      required: true
    },
    startDate: Date,
    endDate: Date,
    researchAreas: [String],
    keywords: [String]
  },
  funding: {
    funder: {
      type: String,
      required: true
    },
    grantAmount: Number,
    grantPeriod: String
  },
  outcomes: {
    publications: [{
      title: String,
      journal: String,
      year: Number,
      doi: String,
      url: String
    }],
    impacts: [String],
    otherOutcomes: String
  },
  testimonial: String,
  featured: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
```

## Phase 3: Researcher Dashboard and User Authentication

This phase will involve creating a secure researcher portal where users can track applications and access resources.

### Implementation Steps
1. Set up user authentication system with different roles (researcher, admin)
2. Create researcher profile management
3. Implement application tracking system
4. Add document upload/download functionality
5. Create notification system for application status updates

## Phase 4: Training Calendar and Resources

This phase will involve creating a system for managing and displaying training events and resources.

## Phase 5: Funder Profiles and Compliance Tools

This phase will involve creating detailed information about funding organizations and interactive compliance tools.

## Phase 6: Collaboration Hub

This phase will involve creating a platform for researchers to find collaborators and showcase partnerships.

## Phase 7: Metrics Dashboard

This phase will involve creating visualizations of grant success rates and research impacts.

## Phase 8: Mobile Responsiveness Enhancement

This phase will involve optimizing the site for mobile devices and implementing mobile-specific features.

## Phase 9: Multi-language Support

This phase will involve adding Swahili content and translation tools for key documents.

## Technical Requirements

### Backend
- Node.js with Express
- MongoDB database
- Authentication using JWT
- Email notification system

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap or similar framework for responsive design
- Chart.js or D3.js for data visualization
- Calendar integration for events and deadlines

### Hosting and Deployment
- MongoDB Atlas for database hosting
- Digital Ocean, AWS, or similar for application hosting
- CI/CD pipeline for automated deployment

## Timeline
Phase 1: 4-6 weeks
Phase 2: 3-4 weeks
Phase 3: 6-8 weeks
Phase 4-9: 3-4 weeks each

Total project timeline: 9-12 months depending on resource availability 