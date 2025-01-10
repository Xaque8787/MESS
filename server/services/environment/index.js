import { defaultEnvironment } from './config.js';
import { readEnvironmentFile, writeEnvironmentFile, ensureEnvironmentFile } from './fileOperations.js';
import { updateAppStates } from './stateManager.js';

export const environmentService = {
  async ensureEnvFile() {
    return ensureEnvironmentFile();
  },

  async readEnvironment() {
    try {
      await this.ensureEnvFile();
      const data = await readEnvironmentFile();
      return data || defaultEnvironment;
    } catch (error) {
      console.error('Error reading environment:', error);
      return defaultEnvironment;
    }
  },

  async writeEnvironment(data) {
    return writeEnvironmentFile(data);
  },

  async updateAppStates(apps, environment) {
    return updateAppStates(apps, environment, this);
  }
};