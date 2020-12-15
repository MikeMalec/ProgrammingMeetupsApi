const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth');
const { checkFields } = require('../middleware/registerCheck');

router.route('/register').post(checkFields, register);
router.route('/login').post(login);

module.exports = router;
