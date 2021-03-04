const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createEvent,
  getAllEvents,
  joinEvent,
  leaveEvent,
  updateEvent,
  deleteEvent,
  isUserParticipant,
  getEventUsers,
  getUserEventsAmount,
} = require('../controllers/event');

const commentsRouter = require('../routes/comments');

router.route('/:id/join').post(protect, joinEvent);
router.route('/:id/leave').delete(protect, leaveEvent);

router.use('/:id/comments', commentsRouter);

router.route('/').post(protect, createEvent).get(protect, getAllEvents);
router.route('/:id').post(protect, updateEvent).delete(protect, deleteEvent);
router.route('/:id/users').get(protect, getEventUsers);
router.route('/:id/users/amount').get(protect, getUserEventsAmount);
router.route('/:id/isParticipant').get(protect, isUserParticipant);

module.exports = router;
