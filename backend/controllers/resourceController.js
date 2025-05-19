const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
exports.getResources = async (req, res) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // For registered users only resources, check access level
    if (!req.user || req.user.role !== 'admin') {
      query.accessLevel = 'Public';
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    const total = await Resource.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: resources.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: resources
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public (with access level check)
exports.getSingleResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Check access level
    if (resource.accessLevel !== 'Public' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Create resource
// @route   POST /api/resources
// @access  Private (Admin)
exports.createResource = async (req, res) => {
  try {
    // Add user to request body
    req.body.createdBy = req.user.id;
    
    const resource = await Resource.create(req.body);
    
    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (Admin)
exports.updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    await resource.remove();
    
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

// @desc    Download resource and increment download count
// @route   GET /api/resources/:id/download
// @access  Public (with access level check)
exports.downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Check access level
    if (resource.accessLevel !== 'Public' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    
    // Increment download count
    resource.downloadCount += 1;
    await resource.save();
    
    // Redirect to file URL or return URL
    return res.status(200).json({
      success: true,
      fileUrl: resource.fileUrl
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
}; 