const express = require('express');
const router = express.Router();
const { submitContact, getContacts, getSingleContact } = require('../controllers/contactController');
const { validateCSRF } = require('../middleware/csrf');

// Public routes
router.post('/', validateCSRF, submitContact);

// Admin routes (these should be protected in production)
router.get('/', getContacts);
router.get('/:id', getSingleContact);

module.exports = router; 