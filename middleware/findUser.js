const asyncHandler = require('./async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.findUser = asyncHandler(async (req, res, next) => {
  let searchedUser = await User.findOne({ _id: req.body.user });
  if (!searchedUser) {
    searchedUser = await User.findOne({ _id: req.params.user });
    if (!searchedUser) {
      return next(new ErrorResponse('User not found'), 404);
    }
  }
  req.searchedUser = searchedUser;
  next();
});
