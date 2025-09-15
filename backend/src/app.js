const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { port } = require('./config');

const authRoutes = require('./routes/auth');
const touristRoutes = require('./routes/tourist');
const tripRoutes = require('./routes/trip');
const alertRoutes = require('./routes/alert');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/alert', alertRoutes);

app.use(errorHandler);

async function init() {
  await connectDB();
}
init().catch(err => console.error(err));

module.exports = app;
