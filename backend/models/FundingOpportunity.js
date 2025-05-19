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