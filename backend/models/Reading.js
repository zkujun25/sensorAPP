const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: {
    type: Date,
    default: Date.now
  },
  userid: Number
});

module.exports = mongoose.model('Reading', readingSchema);