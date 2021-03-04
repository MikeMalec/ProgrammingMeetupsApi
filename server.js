const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const { createComment } = require('./utils/SocketCommentManager');

const http = require('http');
const socketio = require('socket.io');

// Load env
dotenv.config({ path: './config/config.env' });

// Connect to the DB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Routes
const auth = require('./routes/auth');
const events = require('./routes/events');
const users = require('./routes/user');
const positions = require('./routes/position');

// File uploading
app.use(fileupload());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/positions', positions);
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/users', users);

app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('JOIN_EVENT_COMMENTS', (eventId) => {
    socket.join(eventId);
  });
  socket.on('NEW_COMMENT', async (jwt, eventId, comment) => {
    try {
      const eventComment = await createComment(jwt, eventId, comment);
      io.to(eventId).emit('NEW_COMMENT', eventComment);
    } catch (e) {
      console.log(e);
    }
  });
});

const PORT = process.env.PORT || 7000;

server.listen(PORT, console.log('SERVER STARTED'));

process.on('unhandledRejection', (err, promise) => {
  console.log(`unhandled rejection ${err.message}`);
  // server.close(() => process.exit(1));
});
