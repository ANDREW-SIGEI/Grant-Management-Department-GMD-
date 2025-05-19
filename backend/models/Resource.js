const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Template', 'Guide', 'Policy', 'Form', 'Tool', 'Publication', 'Other']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide a file URL']
  },
  fileType: {
    type: String,
    enum: ['PDF', 'DOCX', 'XLSX', 'PPTX', 'ZIP', 'Other'],
    required: [true, 'Please specify file type']
  },
  fileSize: {
    type: Number, // in KB
    required: [true, 'Please specify file size']
  },
  featured: {
    type: Boolean,
    default: false
  },
  accessLevel: {
    type: String,
    enum: ['Public', 'Registered', 'Admin'],
    default: 'Public'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ResourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for full-text search
ResourceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Resource', ResourceSchema); 