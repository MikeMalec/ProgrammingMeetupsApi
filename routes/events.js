const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createEvent,
  getAllEvents,
  getUserEvents,
  joinEvent,
  leaveEvent,
  rateEvent,
} = require('../controllers/event');

const commentsRouter = require('../routes/comments');

router.route('/:id/join').post(protect, joinEvent);
router.route('/:id/leave').delete(protect, leaveEvent);
router.route('/:id/rate').post(protect, rateEvent);

router.use('/:id/comments', commentsRouter);

router.route('/').post(protect, createEvent).get(protect, getAllEvents);

router.route('/:id/events').get(protect, getUserEvents);

module.exports = router;
