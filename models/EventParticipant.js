const mongoose = require('mongoose');

const EventParticipantSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('EventParticipant', EventParticipantSchema);
