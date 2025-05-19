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

// Public routes
router.get('/', getAllFunding);
router.get('/search', searchFunding);
router.get('/:id', getFundingById);

// Protected routes (admin only) - Commented out until authentication is fully set up
// router.post('/', authenticate, isAdmin, createFunding);
// router.put('/:id', authenticate, isAdmin, updateFunding);
// router.delete('/:id', authenticate, isAdmin, deleteFunding);

// Temporary public routes for testing - remove in production
router.post('/', createFunding);
router.put('/:id', updateFunding);
router.delete('/:id', deleteFunding);

module.exports = router; 