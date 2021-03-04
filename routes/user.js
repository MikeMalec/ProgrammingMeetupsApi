const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getOwnEvents, getUserEvents } = require('../controllers/event');

router.route('/events').get(protect, getOwnEvents);
router.route('/:id/events').get(protect, getUserEvents);

module.exports = router;
