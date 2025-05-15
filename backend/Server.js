const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const Reading = require('./models/Reading');
const User = require('./models/Users.js');

const ESP_URL = 'http://192.168.1.120/data';
const USER_ID = 2; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error while connecting:", err));

app.get('/api/readings', async (req, res) => {
  try {
    const readings = await Reading.find().sort({ timestamp: -1 }).limit(20);
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ id: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { id, username, password, name } = req.body;
    const newUser = new User({ id, username, password, name });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', (req,res) => {
  res.send("Server radi!");
});

setInterval(async () => {
  try {
    const response = await axios.get(ESP_URL);
    const data = response.data;

    if (data.temperature !== -1 && data.humidity !== -1) {
      const newReading = new Reading({  
        temperature: data.temperature,
        humidity: data.humidity,
        timestamp: new Date(),
        userid: USER_ID
      });

      await newReading.save();
      console.log(`Spremljeno očitanje sa ESP32: ${JSON.stringify(data)}`);
    } else {
      console.warn('Nevaljano očitanje sa senzora (temperature/humidity === -1)');
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju s ESP32:', error.message);
  }
}, 30 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
