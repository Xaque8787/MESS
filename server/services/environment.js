import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { broadcastOutput } from './websocketService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const ENV_FILE = path.join(DATA_DIR, 'env.json');

const defaultEnvironment = {
  version: '1.0',
  lastUpdated: new Date().toISOString(),
  apps: {},
};

export const environmentService = {
  async ensureEnvFile() {
    try {
      await fs.access(ENV_FILE);
    } catch {
      await this.writeEnvironment(defaultEnvironment);
    }
  },

  async readEnvironment() {
    try {
      await this.ensureEnvFile();
      const data = await fs.readFile(ENV_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading environment:', error);
      return defaultEnvironment;
    }
  },

  async writeEnvironment(data) {
    try {
      await fs.writeFile(
        ENV_FILE,
        JSON.stringify(
          {
            ...data,
            lastUpdated: new Date().toISOString()
          },
          null,
          2
        )
      );
    } catch (error) {
      console.error('Error writing environment:', error);
      throw error;
    }
  },

  async updateAppStates(apps, environment, wss) {
    console.log('Updating app states:', { apps, environment });
    broadcastOutput(wss, 'Updating application states...\n');

    const currentEnv = await this.readEnvironment();
    const updatedEnv = {
      ...currentEnv,
      apps: {}
    };

    // Process app states and configurations
    apps.forEach(app => {
      updatedEnv.apps[app.id] = {
        initialized: app.initialized,
        pendingInstall: app.pendingInstall || false,
        pendingUpdate: app.pendingUpdate || false,
        pendingRemoval: app.pendingRemoval || false,
        config: {}
      };

      // Handle app configurations
      if (app.inputs) {
        app.inputs.forEach(input => {
          if (input.value !== undefined) {
            updatedEnv.apps[app.id].config[input.title] = input.value;
          }
        });
      }
    });

    console.log('Updated environment:', updatedEnv);
    broadcastOutput(wss, 'Application states updated.\n');
    
    await this.writeEnvironment(updatedEnv);
    return updatedEnv;
  }
};