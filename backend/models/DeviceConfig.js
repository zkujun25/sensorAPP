const mongoose = require("mongoose");

const deviceConfigSchema = new mongoose.Schema({
  roomName: String,
  pollingIntervalSec: Number,
  userId: Number,
  espUrl: String
});

module.exports = mongoose.model("DeviceConfig", deviceConfigSchema);
