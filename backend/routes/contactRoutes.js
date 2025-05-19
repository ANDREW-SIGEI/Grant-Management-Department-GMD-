const express = require('express');
const {
  submitContact,
  getContacts,
  getSingleContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(submitContact)
  .get(protect, authorize('admin'), getContacts);

router
  .route('/:id')
  .get(protect, authorize('admin'), getSingleContact)
  .put(protect, authorize('admin'), updateContact)
  .delete(protect, authorize('admin'), deleteContact);

module.exports = router; 