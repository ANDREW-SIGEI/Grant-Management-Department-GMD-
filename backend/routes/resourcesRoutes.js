const express = require('express');
const {
  getResources,
  getSingleResource,
  createResource,
  updateResource,
  deleteResource,
  downloadResource
} = require('../controllers/resourceController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getResources)
  .post(protect, authorize('admin'), createResource);

router
  .route('/:id')
  .get(getSingleResource)
  .put(protect, authorize('admin'), updateResource)
  .delete(protect, authorize('admin'), deleteResource);

router.get('/:id/download', downloadResource);

module.exports = router; 