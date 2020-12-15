const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const { saveImage } = require('../utils/FileUpload');

/**
 * @DESC    Register user
 * @ROUTE   POST /api/auth/register
 * @ACCESS  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const {
    name,
    lastName,
    email,
    description,
    interestedIn,
    password,
  } = req.body;
  const user = await User.create({
    name,
    lastName,
    email,
    description,
    interestedIn,
    password,
  });
  saveImage(req, user);
  const token = user.getSignedJwtToken();
  user.token = token;
  await user.save();
  res.json({ success: true, token, user });
});

/**
 * @DESC    Login user
 * @ROUTE   POST /api/auth/login
 * @ACCESS  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Please provide credentials', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  const isMatchPassword = await user.matchPassword(password);

  if (!isMatchPassword) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  const token = user.getSignedJwtToken();
  user.token = token;
  await user.save();
  res.json({ success: true, token, user });
});

/**
 * @DESC    Update user profile
 * @ROUTE   PUT /api/auth/me
 * @ACCESS  Public
 */
