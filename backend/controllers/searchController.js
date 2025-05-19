const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const FundingOpportunity = require('../models/FundingOpportunity');

// Define models for resources that can be searched
const Resource = mongoose.models.Resource || mongoose.model('Resource', new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  category: String,
  link: String,
  searchContent: String
}));

const News = mongoose.models.News || mongoose.model('News', new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  category: String,
  link: String
}));

/**
 * Search across all content (database and static pages)
 */
exports.searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Convert query to regex for partial matching
    const searchRegex = new RegExp(q, 'i');
    
    // Search funding opportunities
    const fundingResults = await FundingOpportunity.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { funder: { $regex: searchRegex } },
        { eligibility: { $regex: searchRegex } }
      ]
    }).limit(10);
    
    // Search resources
    const resourceResults = await Resource.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { searchContent: { $regex: searchRegex } }
      ]
    }).limit(10);
    
    // Search news items
    const newsResults = await News.find({
      $or: [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } }
      ]
    }).limit(10);
    
    // Search static pages (basic implementation)
    const staticPages = [
      { file: 'index.html', title: 'Home' },
      { file: 'about.html', title: 'About' },
      { file: 'resources.html', title: 'Resources' },
      { file: 'contact.html', title: 'Contact' },
      { file: 'organization.html', title: 'Organizational Structure' },
      { file: 'units.html', title: 'Department Units' },
      { file: 'funding.html', title: 'Funding Opportunities' }
    ];
    
    const staticResults = [];
    
    // Simple static page search - can be enhanced for better content extraction
    for (const page of staticPages) {
      try {
        const filePath = path.join(__dirname, '..', page.file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.match(searchRegex)) {
          staticResults.push({
            title: page.title,
            link: `/${page.file}`,
            type: 'page',
            description: `Visit the ${page.title} page for more information.`
          });
        }
      } catch (err) {
        console.error(`Error searching file ${page.file}:`, err);
      }
    }
    
    // Format results for consistent response
    const formattedResults = [
      ...fundingResults.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        type: 'funding',
        link: `/funding-detail.html?id=${item._id}`,
        category: 'Funding Opportunity',
        deadline: item.applicationDeadline
      })),
      ...resourceResults.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        type: 'resource',
        link: item.link,
        category: item.category
      })),
      ...newsResults.map(item => ({
        id: item._id,
        title: item.title,
        description: item.content,
        type: 'news',
        link: item.link || `/news-detail.html?id=${item._id}`,
        category: item.category,
        date: item.date
      })),
      ...staticResults
    ];
    
    res.json({
      query: q,
      count: formattedResults.length,
      results: formattedResults
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Error performing search', error: err.message });
  }
};

/**
 * Index resources for search
 * This can be run periodically to update the search index
 */
exports.indexResources = async (req, res) => {
  try {
    // Clear existing resources
    await Resource.deleteMany({});
    
    // In a real implementation, you would parse HTML files or read from a CMS
    // For simplicity, we'll add some sample resources
    const sampleResources = [
      {
        title: 'Concept Note Template',
        description: 'A structured template for developing initial research ideas for potential funding.',
        type: 'Template',
        category: 'Forms & Templates',
        link: '/downloads/concept_note_template.docx'
      },
      {
        title: 'Budget Template',
        description: 'Excel template with predefined categories and formulas for research budget preparation.',
        type: 'Spreadsheet',
        category: 'Forms & Templates',
        link: '/downloads/budget_template.xlsx'
      },
      {
        title: 'Research Ethics Policy',
        description: 'KEMRI\'s ethical guidelines for conducting medical and health research.',
        type: 'Policy',
        category: 'Policies & Guidelines',
        link: '/research_ethics_policy.html'
      }
    ];
    
    for (const resource of sampleResources) {
      const newResource = new Resource({
        ...resource,
        searchContent: `${resource.title} ${resource.description} ${resource.category} ${resource.type}`
      });
      
      await newResource.save();
    }
    
    const message = 'Resources indexed successfully';
    if (res) {
      res.json({ message, count: sampleResources.length });
    } else {
      console.log(message);
    }
  } catch (err) {
    console.error('Error indexing resources:', err);
    if (res) {
      res.status(500).json({ message: 'Error indexing resources', error: err.message });
    }
  }
};

// Initialize search index when controller is loaded (if in production)
if (process.env.NODE_ENV === 'production') {
  exports.indexResources().catch(err => {
    console.error('Error initializing search index:', err);
  });
} 