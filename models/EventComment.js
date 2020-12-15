const mongoose = require('mongoose');

const EventCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
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
});

module.exports = mongoose.model('EventComment', EventCommentSchema);
