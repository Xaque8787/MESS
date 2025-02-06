import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const ENV_FILE = path.join(DATA_DIR, 'env.json');

const defaultEnvironment = {
  version: '1.0',
  lastUpdated: new Date().toISOString(),
  isFirstRun: true,
  apps: {},
};

const MASKED_VALUE = '********';

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
        JSON.stringify({
          ...data,
          lastUpdated: new Date().toISOString()
        }, null, 2)
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

    // Process each app's state and config
    apps.forEach(app => {
      // Skip run_up and run_down completely - don't write them to env.json
      if (app.id === 'run_up' || app.id === 'run_down') {
        return;
      }

      if (app.pendingRemoval) {
        delete updatedEnv.apps[app.id];
      } else if (app.pendingInstall || app.pendingUpdate) {
        const config = {};

        // Process inputs into config
        app.inputs?.forEach(input => {
          if (input.type === 'conditional-text' && input.dependentField) {
            if (input.value) {
              // Store main conditional input value
              config[input.title] = input.value;

              // Store dependent field values
              input.dependentField.forEach(field => {
                if (field.value !== undefined) {
                  config[field.title] = field.isPassword && field.value ?
                    MASKED_VALUE : field.value;
                }
              });
            }
          } else if (input.value !== undefined) {
            config[input.title] = input.isPassword && input.value ?
              MASKED_VALUE : input.value;
          }
        });

        updatedEnv.apps[app.id] = {
          initialized: true,
          pendingInstall: app.pendingInstall || false,
          pendingUpdate: app.pendingUpdate || false,
          pendingRemoval: app.pendingRemoval || false,
          config
        };
      }
    });

    await this.writeEnvironment(updatedEnv);
    return updatedEnv;
  }
};
