const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const { savePosition, getPosition } = require('../controllers/position');

router.route('/').post(savePosition).get(getPosition);

module.exports = router;
