const mongoose = require('mongoose');

const EventRateSchema = new mongoose.Schema({
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
  rate: {
    type: Number,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model('EventRate', EventRateSchema);
