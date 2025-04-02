const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Reading = require('./models/Reading');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error while connecting:", err));

// GET: Get all the readings
app.get('/api/readings', async (req, res) => {
  try {
    const readings = await Reading.find().sort({ timestamp: -1 }).limit(20);
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Adding a new reading
app.post('/api/readings', async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    const newReading = new Reading({ temperature, humidity });
    await newReading.save();
    res.status(201).json(newReading);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Starting a server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
