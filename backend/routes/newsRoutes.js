const express = require('express');
const {
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getNews)
  .post(protect, authorize('admin'), createNews);

router
  .route('/:id')
  .get(getSingleNews)
  .put(protect, authorize('admin'), updateNews)
  .delete(protect, authorize('admin'), deleteNews);

module.exports = router; 