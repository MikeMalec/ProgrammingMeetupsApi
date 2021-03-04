const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const { saveImages } = require('../utils/FileUpload');
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
  } = req.body;
  const event = await Event.create({
    organizer,
    latitude,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    longitude,
    address,
    happensAt,
    tags: tags.split(','),
    description,
  });
  await saveImages(req, event);
  const eventWithOrganizer = await Event.findOne({ _id: event._id }).populate({
    path: 'organizer',
  });
  await EventParticipant.create({
    user: req.user._id,
    event: event._id,
  });
  res.json(eventWithOrganizer);
});

/**
 * @DESC    Update event
 * @ROUTE   PUT /api/events/:event
 * @ACCESS  PRIVATE
 */
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const { happensAt, tags, description } = req.body;
  const event = await Event.findById(req.params.id).populate({
    path: 'organizer',
  });
  if (event) {
    if (event.organizer._id == req.user.id) {
      await saveImages(req, event);
      event.happensAt = happensAt;
      event.tags = tags.split(',');
      event.description = description;
      await event.save();
      res.json(event);
    } else {
      return next(new ErrorResponse('Not Authorized', 401));
    }
  } else {
    return next(new ErrorResponse('Not found', 404));
  }
});

/**
 * @DESC    Get all events
 * @ROUTE   GET /api/events
 * @ACCESS  PRIVATE
 */
exports.getAllEvents = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const lat = req.query.latitude;
  const lng = req.query.longitude;
  let radius = req.query.radius;
  // meters to km
  radius = radius / 1000;
  // km to radians
  radius = radius / 6371;

  const events = await Event.find({
    happensAt: { $gte: Date.now() },
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })
    .populate({
      path: 'organizer',
    })
    .limit(100);
  res.json(events);
});

/**
 * @DESC    Get own events
 * @ROUTE   GET /api/users/events
 * @ACCESS  PRIVATE
 */
exports.getOwnEvents = asyncHandler(async (req, res, next) => {
  let participations = await EventParticipant.find({
    user: req.user._id,
  }).populate({
    path: 'event',
    populate: {
      path: 'organizer',
    },
  });
  let events = participations.map((participation) => participation.event);
  events = events.filter((event) => event != null);
  res.json(events);
});

/**
 * @DESC    Get user events
 * @ROUTE   GET /api/users/:id/events
 * @ACCESS  PRIVATE
 */
exports.getUserEvents = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const page = req.query.page;
  const limit = 20;
  const startIndex = (page - 1) * limit;
  let pages =
    (await EventParticipant.find({ user: userId }).countDocuments()) / limit;
  pages = Math.ceil(pages);
  let participations = await EventParticipant.find({
    user: userId,
  })
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: 'event',
      populate: {
        path: 'organizer',
      },
    });
  let events = participations.map((participation) => participation.event);
  events = events.filter((event) => event != null);
  // console.log(pages, events);
  res.json({ pages, events });
});

/**
 * @DESC    Get event users
 * @ROUTE   GET /api/events/:id/users
 * @ACCESS  PRIVATE
 */
exports.getEventUsers = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;
  const page = req.query.page;
  const limit = 20;
  const startIndex = (page - 1) * limit;
  let pages =
    (await EventParticipant.find({ event: eventId }).countDocuments()) / limit;
  pages = Math.ceil(pages);
  const eventParticipants = await EventParticipant.find({ event: eventId })
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: 'user',
    });
  const users = eventParticipants.map((it) => it.user);
  res.json({ pages, users });
});

/**
 * @DESC    Get user events
 * @ROUTE   GET /api/events/:event/users/amount
 * @ACCESS  PRIVATE
 */
exports.getUserEventsAmount = asyncHandler(async (req, res, next) => {
  const amount = await EventParticipant.find({
    event: req.params.id,
  }).countDocuments();
  res.json({
    amount,
  });
});

/**
 * @DESC    Check if user participant of event
 * @ROUTE   GET /api/events/:event/isParticipant
 * @ACCESS  PRIVATE
 */
exports.isUserParticipant = asyncHandler(async (req, res, next) => {
  let userEvents = await EventParticipant.find({ user: req.user._id });
  userEvents = userEvents.map((it) => `${it.event}`);
  userEvents.forEach((it) => it.trim());
  const isParticipant = userEvents.includes(req.params.id);
  res.json({
    isParticipant,
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
      const event = await Event.findOne({ _id: req.params.id })
        .populate({
          path: 'participants',
          populate: {
            path: 'user',
            select: 'firstName lastName image id',
          },
        })
        .populate({
          path: 'organizer',
        });
      const eventWithAmountOfParticipants = getEventWithAmountOfParticipants(
        event
      );
      res.json(eventWithAmountOfParticipants);
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
    const event = await Event.findOne({ _id: req.params.id })
      .populate({
        path: 'participants',
        populate: {
          path: 'user',
          select: 'firstName lastName image id',
        },
      })
      .populate({
        path: 'organizer',
      });
    const eventWithAmountOfParticipants = getEventWithAmountOfParticipants(
      event
    );
    res.json(eventWithAmountOfParticipants);
  } else {
    return next(new ErrorResponse('Resource not found', 404));
  }
});

function getEventWithAmountOfParticipants(event) {
  const eventWithAmountOfParticipants = {
    ...event._doc,
    amountOfParticipants: 0,
  };
  eventWithAmountOfParticipants.amountOfParticipants =
    event.participants.length;
  return eventWithAmountOfParticipants;
}

/**
 * @DESC    Delete event
 * @ROUTE   DELETE /api/events/:id
 * @ACCESS  PRIVATE
 */
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    if (event.organizer == req.user.id) {
      await event.remove();
      res.json({ success: true });
    } else {
      return next(new ErrorResponse('Not Authorized', 401));
    }
  } else {
    return next(new ErrorResponse('Resource not found', 404));
  }
});
