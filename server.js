const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');

// Load env
dotenv.config({ path: './config/config.env' });

// Connect to the DB
connectDB();

//Routes
const auth = require('./routes/auth');
const events = require('./routes/events');

const app = express();

// File uploading
app.use(fileupload());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/users', events);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('SERVER STARTED'));

process.on('unhandledRejection', (err, promise) => {
  console.log(`unhandled rejection ${err.message}`);
  // server.close(() => process.exit(1));
});
