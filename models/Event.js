const mongoose = require('mongoose');
const moment = require('moment');

const EventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Organizer',
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    happensAt: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
      min: 10,
      max: 100,
    },
    image: {
      type: String,
      unique: true,
      default: 'no-photo.jpg',
    },
    createdAt: {
      type: Date,
      default: moment().format(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

EventSchema.virtual('participants', {
  ref: 'EventParticipant',
  localField: '_id',
  foreignField: 'event',
  justOne: false,
});

EventSchema.virtual('rates', {
  ref: 'EventRate',
  localField: '_id',
  foreignField: 'event',
  justOne: false,
});

module.exports = mongoose.model('Event', EventSchema);
