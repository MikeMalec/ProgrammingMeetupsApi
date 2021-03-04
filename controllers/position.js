const asyncHandler = require('../middleware/async');
const Position = require('../models/Position');

exports.savePosition = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { latitude, longitude } = req.body;
  await Position.create({
    latitude,
    longitude,
  });
  res.json({ success: true });
});

exports.getPosition = asyncHandler(async (req, res, next) => {
  const position = await Position.findOneAndDelete().sort('+createdAt');
  console.log(`fetched = ${position}`);
  if (position) {
    const { latitude, longitude } = position;
    res.json({ latitude, longitude });
  } else {
    res.json({});
  }
});
