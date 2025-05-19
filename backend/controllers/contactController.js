const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    
    // In a real implementation, you would send an email notification here
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private (Admin)
exports.getContacts = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    const total = await Contact.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: contacts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private (Admin)
exports.getSingleContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private (Admin)
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        assignedTo: req.body.assignedTo,
        updatedAt: Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    await contact.remove();
    
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