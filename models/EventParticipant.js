const mongoose = require('mongoose');

const EventParticipantSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EventParticipant', EventParticipantSchema);
