const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const EventRate = require('../models/EventRate');
const { saveImage } = require('../utils/FileUpload');
const User = require('../models/User');

/**
 * @DESC    Create event
 * @ROUTE   POST /api/events
 * @ACCESS  PRIVATE
 */
exports.createEvent = asyncHandler(async (req, res, next) => {
  const organizer = req.user._id;
  const {
    latitude,
    longitude,
    address,
    happensAt,
    tags,
    description,
    photo,
  } = req.body;
  const event = await Event.create({
    organizer,
    latitude,
    longitude,
    address,
    happensAt,
    tags,
    description,
    photo,
  });
  saveImage(req, event);
  res.json({
    success: true,
    event,
  });
});

/**
 * @DESC    Get all events
 * @ROUTE   GET /api/events
 * @ACCESS  PRIVATE
 */
exports.getAllEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find()
    .populate({
      path: 'participants',
      populate: {
        path: 'user',
        select: 'name lastName image',
      },
    })
    .populate({
      path: 'rates',
      populate: {
        path: 'user',
        select: 'name lastName image',
      },
    });
  res.json({
    success: true,
    events,
  });
});

/**
 * @DESC    Get user events
 * @ROUTE   GET /api/users/:user/events
 * @ACCESS  PRIVATE
 */
exports.getUserEvents = asyncHandler(async (req, res, next) => {
  let participations = await EventParticipant.find({
    user: req.user._id,
  }).populate('event');
  const events = participations.map((participation) => participation.event);
  res.json({
    success: true,
    events,
  });
});

/**
 * @DESC    Join event
 * @ROUTE   POST /api/events/:id/join
 * @ACCESS  PRIVATE
 */
exports.joinEvent = asyncHandler(async (req, res, next) => {
  const eventToJoin = await Event.findOne({ _id: req.params.id });
  if (eventToJoin) {
    const alreadyParticipate = await EventParticipant.findOne({
      user: req.user._id,
      event: eventToJoin._id,
    });
    if (!alreadyParticipate) {
      await EventParticipant.create({
        user: req.user._id,
        event: eventToJoin._id,
      });
      res.json({ success: true });
    } else {
      return next(new ErrorResponse('Already participate', 404));
    }
  } else {
    return next(new ErrorResponse('Resource not found', 404));
  }
});

/**
 * @DESC    Leave event
 * @ROUTE   DELETE /api/events/:id/leave
 * @ACCESS  PRIVATE
 */
exports.leaveEvent = asyncHandler(async (req, res, next) => {
  const eventToJoin = await Event.findOne({ _id: req.params.id });
  if (eventToJoin) {
    await EventParticipant.findOneAndDelete({
      user: req.user._id,
      event: eventToJoin._id,
    });
    res.json({ success: true });
  } else {
    return next(new ErrorResponse('Resource not found', 404));
  }
});

/**
 * @DESC    Rate event
 * @ROUTE   POST /api/events/:id/rates
 * @ACCESS  PRIVATE
 */
exports.rateEvent = asyncHandler(async (req, res, next) => {
  const { rate } = req.body;
  const eventToJoin = await Event.findOne({ _id: req.params.id });
  if (eventToJoin) {
    await EventRate.findOneAndDelete({
      user: req.user._id,
      event: eventToJoin._id,
    });
    await EventRate.create({
      user: req.user._id,
      event: eventToJoin._id,
      rate,
    });
    res.json({ success: true });
  } else {
    return next(new ErrorResponse('Resource not found', 404));
  }
});
