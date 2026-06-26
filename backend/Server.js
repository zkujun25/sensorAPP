const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const Reading = require('./models/Reading');
const User = require('./models/Users.js');

// const ESP_URL1 = 'http://esp321.local/data';
// const USER_ID1 = 2; 

// const ESP_URL2 = 'http://esp322.local/data';
// const USER_ID2 = 3; 

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
    const readings = await Reading.find().sort({ timestamp: -1 });
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

//KONFIGURACIJE
const DeviceConfig = require('./models/DeviceConfig');

app.get('/api/device-configs', async (req, res) => {
  try {
    const configs = await DeviceConfig.find();
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/device-configs/:userId', async (req, res) => {
  try {
    const { roomName, pollingIntervalSec, espUrl} = req.body;

    const updated = await DeviceConfig.findOneAndUpdate(
      { userId: req.params.userId },
      { roomName, pollingIntervalSec, espUrl},
      { new: true, upsert: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Device configuration not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

async function startPollingForDevices() {
  try {
    const configs = await DeviceConfig.find();

    configs.forEach((config) => {
      const { userId, pollingIntervalSec } = config;
      //const { userId, pollingIntervalSec, espUrl } = config;
      const espUrl = `http://esp32${userId}.local/data`; // npr. esp322.local za userId 2

      setInterval(async () => {
        try {
          const response = await axios.get(espUrl);
          const data = response.data;

          if (data.temperature !== -1 && data.humidity !== -1) {
            const newReading = new Reading({
              temperature: data.temperature,
              humidity: data.humidity,
              timestamp: new Date(),
              userid: userId
            });

            await newReading.save();
            console.log(`Uređaj ${userId}: ${JSON.stringify(data)}`);
          } else {
            console.warn(`Uređaj ${userId}: Nevaljano očitanje`);
          }
        } catch (err) {
          console.error(`Greška pri dohvaćanju s ESP32 (${espUrl}):`, err.message);
        }
      }, pollingIntervalSec * 1000);
    });

  } catch (err) {
    console.error("Greška pri pokretanju polling funkcije:", err.message);
  }
}

startPollingForDevices();

// function fetchFromDevice(url, userId, deviceLabel) {
//   return async () => {
//     try {
//       const response = await axios.get(url);
//       const data = response.data;

//       if (data.temperature !== -1 && data.humidity !== -1) {
//         const newReading = new Reading({
//           temperature: data.temperature,
//           humidity: data.humidity,
//           timestamp: new Date(),
//           userid: userId
//         });

//         await newReading.save();
//         console.log(`${deviceLabel}: ${JSON.stringify(data)}`);
//       } else {
//         console.warn(`${deviceLabel}: Nevaljano očitanje`);
//       }
//     } catch (error) {
//       console.error(`${deviceLabel}: Greška pri dohvaćanju`, error.message);
//     }
//   };
// }
// setInterval(fetchFromDevice(ESP_URL1, USER_ID1, 'ESP321'), 300 * 1000);
// setInterval(fetchFromDevice(ESP_URL2, USER_ID2, 'ESP322'), 300 * 1000);

//Dohvat s arduina 1
// setInterval(async () => {
//   try {
//     const response = await axios.get(ESP_URL1);
//     const data = response.data;

//     if (data.temperature !== -1 && data.humidity !== -1) {
//       const newReading = new Reading({  
//         temperature: data.temperature,
//         humidity: data.humidity,
//         timestamp: new Date(),
//         userid: USER_ID1
//       });

//       await newReading.save();
//       console.log(`Spremljeno s Uređaja 1: ${JSON.stringify(data)}`);
//     } else {
//       console.warn('Nevaljano očitanje sa senzora1 (temperature/humidity === -1)');
//     }
//   } catch (error) {
//     console.error('Greška pri dohvaćanju s uređaja 1:', error.message);
//   }
// }, 300 * 1000);

// Dohvat s arduina 2
// setInterval(async () => {
//   try {
//     const response = await axios.get(ESP_URL2);
//     const data = response.data;

//     if (data.temperature !== -1 && data.humidity !== -1) {
//       const newReading = new Reading({  
//         temperature: data.temperature,
//         humidity: data.humidity,
//         timestamp: new Date(),
//         userid: USER_ID2
//       });

//       await newReading.save();
//       console.log(`Spremljeno s Uređaja 2: ${JSON.stringify(data)}`);
//     } else {
//       console.warn('Nevaljano očitanje sa senzora 2 (temperature/humidity === -1)');
//     }
//   } catch (error) {
//     console.error('Greška pri dohvaćanju s uređaja 2:', error.message);
//   }
// }, 300 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
