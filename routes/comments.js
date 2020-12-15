const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const {
  createEventComment,
  getEventComments,
} = require('../controllers/eventComments');

router
  .route('/')
  .post(protect, createEventComment)
  .get(protect, getEventComments);

module.exports = router;
