import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { environmentService } from './services/environment.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Data file paths
const DATA_DIR = path.join(__dirname, '../data');
const SELECTIONS_FILE = path.join(DATA_DIR, 'selections.json');

// Ensure data directory exists before starting server
async function initializeServer() {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize environment service
    await environmentService.ensureEnvFile();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Data directory: ${DATA_DIR}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.get('/api/selections', async (req, res) => {
  try {
    const data = await fs.readFile(SELECTIONS_FILE, 'utf-8')
      .catch(() => JSON.stringify({ apps: [] }));
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading selections:', error);
    res.status(500).json({ error: 'Failed to read selections' });
  }
});

app.post('/api/selections', async (req, res) => {
  try {
    await fs.writeFile(SELECTIONS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving selections:', error);
    res.status(500).json({ error: 'Failed to save selections' });
  }
});

app.post('/api/initialize', async (req, res) => {
  try {
    const { apps, environment } = req.body;
    const envData = await environmentService.updateAppStates(apps, environment);
    res.json({ success: true, environment: envData });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize apps' });
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Initialize server
initializeServer();