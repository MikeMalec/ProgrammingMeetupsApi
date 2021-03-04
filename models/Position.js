const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Position', PositionSchema);
