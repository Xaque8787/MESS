import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../../data');
const ENV_FILE = path.join(DATA_DIR, 'env.json');

export const defaultEnvironment = {
  version: '1.0',
  lastUpdated: new Date().toISOString(),
  isFirstRun: true,
  apps: {},
};

export { DATA_DIR, ENV_FILE };