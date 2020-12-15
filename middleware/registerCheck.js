const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../models/User');

exports.checkFields = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    next(new ErrorResponse('Please provide credentials', 400));
  }
  let error = '';
  const potentialUserByEmail = await User.findOne({ email });
  if (potentialUserByEmail) {
    error += ' Email is already taken';
  }
  if (error.length > 1) {
    next(new ErrorResponse(error, 400));
  }
  next();
});
