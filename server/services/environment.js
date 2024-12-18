import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

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

  async updateAppStates(apps, environment) {
    const currentEnv = await this.readEnvironment();
    const updatedEnv = {
      ...currentEnv,
      apps: { ...currentEnv.apps }
    };

    // Process app states and configurations
    apps.forEach(app => {
      // Handle app installation status
      if (app.initialized) {
        updatedEnv.apps[app.id] = true;
      } else {
        delete updatedEnv.apps[app.id];
      }

      // Handle app configurations
      if (app.initialized && app.inputs) {
        const configValues = {};
        app.inputs.forEach(input => {
          if (input.value) {
            configValues[input.title] = input.value;
          }
        });

        if (Object.keys(configValues).length > 0) {
          updatedEnv[app.id] = configValues;
        }
      } else {
        delete updatedEnv[app.id];
      }
    });

    await this.writeEnvironment(updatedEnv);
    return updatedEnv;
  }
};