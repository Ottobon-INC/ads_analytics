import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8081 : 3001);
const DATA_FILE = path.join(__dirname, 'sheets.json');
const CLICKS_DATA_FILE = path.join(__dirname, 'clicks.json');

// Default sheets if the file doesn't exist yet
const defaultSheets = [
  {
    id: 'medcy-ivf-camp',
    name: 'Medcy IVF Camp leads',
    url: 'https://docs.google.com/spreadsheets/d/1LLvUhgc55mqXU0MYirIZhEGdtGJ63o2faOkEdUlyhm4/edit?usp=sharing'
  }
];

// Initialize sheets.json if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultSheets, null, 2), 'utf-8');
}

// Initialize clicks.json if not exists
if (!fs.existsSync(CLICKS_DATA_FILE)) {
  fs.writeFileSync(CLICKS_DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

app.use(cors());
app.use(express.json());

// API Endpoint to Get Sheets
app.get('/api/sheets', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read sheets data' });
  }
});

// API Endpoint to Save Sheets
app.post('/api/sheets', (req, res) => {
  try {
    const { sheetsList } = req.body;
    if (!Array.isArray(sheetsList)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(sheetsList, null, 2), 'utf-8');
    res.json({ success: true, message: 'Sheets saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save sheets data' });
  }
});

// API Endpoint to Get Clicks
app.get('/api/clicks', (req, res) => {
  try {
    if (fs.existsSync(CLICKS_DATA_FILE)) {
      const data = fs.readFileSync(CLICKS_DATA_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read clicks data' });
  }
});

// API Endpoint to Track Clicks
app.post('/api/track-click', async (req, res) => {
  try {
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { elementClicked } = req.body;
    
    // Fallback if IP is IPv6 loopback
    const ipToLookup = (userIp === '::1' || userIp === '127.0.0.1') ? '' : userIp;
    
    let locationStr = 'Unknown';
    try {
      // Fetch geolocation from free IP-API
      const geoResponse = await fetch(`http://ip-api.com/json/${ipToLookup}`);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.status === 'success') {
          locationStr = `${geoData.city}, ${geoData.country}`;
        }
      }
    } catch (geoError) {
      console.error('Geolocation fetch error:', geoError.message);
    }

    console.log(`[CLICK DETECTED] Element: "${elementClicked}" | IP Address: ${userIp} | Location: ${locationStr}`);

    // Read existing clicks
    let clicks = [];
    if (fs.existsSync(CLICKS_DATA_FILE)) {
      const data = fs.readFileSync(CLICKS_DATA_FILE, 'utf-8');
      clicks = JSON.parse(data);
    }

    // Add new click
    clicks.push({
      ip: userIp,
      location: locationStr,
      element: elementClicked,
      timestamp: new Date().toISOString()
    });

    // Save back to file
    fs.writeFileSync(CLICKS_DATA_FILE, JSON.stringify(clicks, null, 2), 'utf-8');

    res.status(200).json({ success: true, message: "IP and Location captured successfully." });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  
  // SPA fallback for routing
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
