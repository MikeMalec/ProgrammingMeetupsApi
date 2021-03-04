const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 35,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 35,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    image: {
      type: String,
      default: 'no-photo.jpg',
    },
    description: {
      type: String,
      default: '',
    },
    interestedIn: {
      type: [String],
      default: [],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 150,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('events', {
  ref: 'EventParticipant',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('MeetupUser', UserSchema);
