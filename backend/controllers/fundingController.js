const FundingOpportunity = require('../models/FundingOpportunity');

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

// Create a new funding opportunity
exports.createFunding = async (req, res) => {
  try {
    const opportunity = new FundingOpportunity(req.body);
    const savedOpportunity = await opportunity.save();
    res.status(201).json(savedOpportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a funding opportunity
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

// Delete a funding opportunity
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