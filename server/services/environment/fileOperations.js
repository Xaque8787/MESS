import fs from 'fs/promises';
import { ENV_FILE, defaultEnvironment } from './config.js';

export async function readEnvironmentFile() {
  try {
    const data = await fs.readFile(ENV_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading environment file:', error);
    return null;
  }
}

export async function writeEnvironmentFile(data) {
  try {
    await fs.writeFile(ENV_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing environment file:', error);
    throw error;
  }
}

export async function ensureEnvironmentFile() {
  try {
    await fs.access(ENV_FILE);
  } catch {
    await writeEnvironmentFile(defaultEnvironment);
  }
}