const mongoose = require('mongoose');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const EventComment = require('./EventComment');
const EventParticipant = require('./EventParticipant');

const EventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.ObjectId,
      ref: 'MeetupUser',
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
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
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
      default: 'no-event-image.jpg',
    },
    icon: {
      type: String,
      defualt: null,
      default: 'no-event-image.jpg',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

EventSchema.pre('remove', async function (next) {
  fs.unlink(
    path.join(__dirname, `../public/uploads/${this.image}`),
    (err) => {}
  );
  fs.unlink(
    path.join(__dirname, `../public/uploads/${this.icon}`),
    (err) => {}
  );
  await EventParticipant.deleteMany({ event: this._id });
  await EventComment.deleteMany({ event: this._id });
  next();
});

EventSchema.virtual('participants', {
  ref: 'EventParticipant',
  localField: '_id',
  foreignField: 'event',
  justOne: false,
});

module.exports = mongoose.model('Event', EventSchema);
