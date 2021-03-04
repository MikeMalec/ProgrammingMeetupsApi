const User = require('./models/User');
const Event = require('./models/Event');
const EventParticipant = require('./models/EventParticipant');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

async function produceUsersAndConnectWithEvent(eventId) {
  const event = await Event.findById(eventId);
  console.log(event);
  for (let i = 0; i < 100; i++) {
    const user = await User.create({
      firstName: 'firstName',
      lastName: 'lastName',
      email: `email${i + 100}@gmail.com`,
      image: 'm.jpg',
      description: 'DESCRIPTION',
      password: '123456',
    });
    await EventParticipant.create({ user: user._id, event: event._id });
  }
}

// produceUsersAndConnectWithEvent('5ff5fb50635eed1f58bf5818');

async function produceEventsForUser(userId) {
  for (let i = 0; i < 100; i++) {
    const event = await Event.create({
      organizer: userId,
      latitude: 49.79215489297022 - i / 8,
      longitude: 18.783777121794224 - i / 8,
      location: {
        type: 'Point',
        coordinates: [18.783777121794224 - i / 8, 49.79217489297022 - i / 8],
      },
      address: `${i} address`,
      happensAt: 1610736060284 + i,
      tags: ['kotlin', 'android'],
      description: 'description',
      image: '1609766870868Mainimage_5ff317d6dbcc940b9c5e01d1.jpg',
      icon: '1609766870868Mainimage_5ff317d6dbcc940b9c5e01d1.jpg',
    });
    await EventParticipant.create({
      user: userId,
      event: event._id,
    });
    console.log(event);
  }
}

produceEventsForUser('5ff603ce651d530888fc329f');
