const User = require('../models/User');
const jwt = require('jsonwebtoken');
const EventComment = require('../models/EventComment');
const Event = require('../models/Event');

exports.createComment = async function (token, eventId, comment) {
  const userToken = token.split(' ')[1];
  const { id } = jwt.verify(userToken, process.env.JWT_SECRET);
  const user = await User.findById(id);
  if (user) {
    const event = await Event.findById(eventId);
    if (event) {
      const eventComment = await EventComment.create({
        user: user._id,
        event: event._id,
        comment,
      });
      return { user, comment, createdAt: eventComment.createdAt };
    }
  }
};
