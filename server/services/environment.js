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
    console.log('Updating app states with:', { apps, environment });
    const currentEnv = await this.readEnvironment();
    const updatedEnv = {
      ...currentEnv,
      apps: { ...currentEnv.apps }
    };

    // Process each app's state and config
    apps.forEach(app => {
      if (app.pendingRemoval) {
        delete updatedEnv.apps[app.id];
      } else if (app.pendingInstall || app.pendingUpdate) {
        const config = {};
        
        // Process inputs into config
        app.inputs?.forEach(input => {
          if (input.type === 'conditional-text' && input.dependentField) {
            // Store the main conditional input value
            if (input.value !== undefined) {
              config[input.title] = input.value;
              
              // If the conditional input is true, store all dependent field values
              if (input.value === true) {
                input.dependentField.forEach(field => {
                  if (field.value !== undefined) {
                    // Handle password masking for dependent fields
                    if (field.isPassword && field.value) {
                      config[field.title] = MASKED_VALUE;
                    } else {
                      config[field.title] = field.value;
                    }
                  }
                });
              }
            }
          } else if (input.value !== undefined) {
            // Handle password masking for regular inputs
            if (input.isPassword && input.value) {
              config[input.title] = MASKED_VALUE;
            } else {
              config[input.title] = input.value;
            }
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

    // Update isFirstRun flag if this is the first installation
    if (currentEnv.isFirstRun && apps.some(app => app.pendingInstall)) {
      updatedEnv.isFirstRun = false;
    }

    console.log('Writing updated environment:', updatedEnv);
    await this.writeEnvironment(updatedEnv);
    return updatedEnv;
  }
};