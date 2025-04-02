const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reading', readingSchema);