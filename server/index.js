import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { environmentService } from './services/environment.js';
import { setupWebSocket } from './services/websocketService.js';
import { executeDeployment } from './services/deploymentService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const PORT = 3001;

// Data file paths
const DATA_DIR = path.join(__dirname, '../data');
const SELECTIONS_FILE = path.join(DATA_DIR, 'selections.json');

// Set up WebSocket with path
const wss = setupWebSocket(server, '/ws');

// Ensure data directory exists before starting server
async function initializeServer() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(path.join(__dirname, '../scripts/apps'), { recursive: true });
    await environmentService.ensureEnvFile();
    
    server.listen(PORT, () => {
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
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.get('/api/environment', async (req, res) => {
  try {
    const envData = await environmentService.readEnvironment();
    res.json(envData);
  } catch (error) {
    console.error('Error reading environment:', error);
    res.status(500).json({ error: 'Failed to read environment' });
  }
});

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
    console.log('Received initialization request:', req.body);
    const { apps, environment } = req.body;
    const envData = await environmentService.updateAppStates(apps, environment, wss);
    
    try {
      console.log('Starting deployment execution');
      await executeDeployment(wss);
      console.log('Deployment completed');
      res.json({ success: true, environment: envData });
    } catch (error) {
      console.error('Script execution error:', error);
      res.status(500).json({ error: 'Failed to execute scripts' });
    }
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize apps' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

initializeServer();