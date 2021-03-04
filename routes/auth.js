const express = require('express');
const router = express.Router();

const { register, login, updateProfile } = require('../controllers/auth');
const { checkFields } = require('../middleware/registerCheck');
const { protect } = require('../middleware/auth');

router.route('/register').post(checkFields, register);
router.route('/login').post(login);
router.route('/profile').put(protect, updateProfile);

module.exports = router;
