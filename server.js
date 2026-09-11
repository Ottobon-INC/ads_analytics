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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  
  // SPA fallback for routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
