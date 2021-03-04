const mongoose = require('mongoose');
const moment = require('moment');

const EventCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'MeetupUser',
    required: true,
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true,
  },
  comment: {
    type: String,
    min: 1,
    max: 100,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EventComment', EventCommentSchema);
