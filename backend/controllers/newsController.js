const News = require('../models/News');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
  try {
    const { category, featured, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Filter by featured status if provided
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const news = await News.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    const total = await News.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: news.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: news
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Public
exports.getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: news
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Create new news article
// @route   POST /api/news
// @access  Private (Admin)
exports.createNews = async (req, res) => {
  try {
    // Add user to request body
    req.body.createdBy = req.user.id;
    
    const news = await News.create(req.body);
    
    res.status(201).json({
      success: true,
      data: news
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private (Admin)
exports.updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
    
    news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: news
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private (Admin)
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
    
    await news.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
}; 