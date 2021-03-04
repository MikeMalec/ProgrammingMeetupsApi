const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');
const EventComment = require('../models/EventComment');
const { start } = require('repl');

/**
 * @DESC    Create event comment
 * @ROUTE   POST /api/events/:id/comments
 * @ACCESS  PRIVATE
 */
exports.createEventComment = asyncHandler(async (req, res, next) => {
  const { comment } = req.body;
  const event = await Event.find({ _id: req.params.id });
  if (event) {
    const eventComment = await EventComment.create({
      user: req.user._id,
      event: req.params.id,
      comment,
    });
    res.json({
      eventComment,
    });
  } else {
    return next(new ErrorResponse('Resource not found', 404));
  }
});

/**
 * @DESC    Get Event comments
 * @ROUTE   GET /api/events/:id/comments
 * @ACCESS  PRIVATE
 */
exports.getEventComments = asyncHandler(async (req, res, next) => {
  const page = req.query.page;
  const limit = 25;
  const startIndex = (page - 1) * limit;
  let pages =
    (await EventComment.find({ event: req.params.id }).countDocuments()) /
    limit;
  pages = Math.ceil(pages);
  const comments = await EventComment.find({ event: req.params.id })
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit)
    .select('-event -_id -id')
    .populate({
      path: 'user',
    });
  res.json({
    comments,
    pages,
  });
});
