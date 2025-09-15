const mongoose = require('mongoose');
const { mongoUri } = require('./index');

async function connectDB() {
  if (!mongoUri) throw new Error('MONGO_URI not set');
  console.log("Connecting to MongoDB:", mongoUri);
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;
