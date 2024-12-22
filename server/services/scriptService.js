import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { broadcastOutput } from './websocketService.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPTS_DIR = join(__dirname, '../../scripts/apps');

const SCRIPT_TYPES = {
  install: '',
  update: '_update',
  remove: '_remove'
};

async function getScriptPath(appId, operation) {
  const suffix = SCRIPT_TYPES[operation] || '';
  const scriptName = `${appId}${suffix}.sh`;
  const scriptPath = join(SCRIPTS_DIR, scriptName);

  try {
    await access(scriptPath);
    return scriptPath;
  } catch {
    console.log(`Script not found: ${scriptPath}`);
    return null;
  }
}

async function executeScript(wss, scriptPath, appConfig) {
  return new Promise((resolve, reject) => {
    const child = spawn('/bin/bash', [scriptPath], {
      env: {
        ...process.env,
        APP_CONFIG: JSON.stringify(appConfig)
      }
    });

    let output = '';

    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`Script output: ${text}`);
      // Send raw output directly
      broadcastOutput(wss, text);
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      console.error(`Script error: ${text}`);
      broadcastOutput(wss, `Error: ${text}`);
    });

    child.on('error', (error) => {
      console.error('Failed to start script:', error);
      reject(error);
    });

    child.on('close', (code) => {
      console.log(`Script exited with code ${code}`);
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Script failed with code ${code}`));
      }
    });
  });
}

export async function processApp(wss, appId, appConfig, operation = 'install') {
  console.log(`Processing ${operation} for app ${appId}`);
  broadcastOutput(wss, `\nProcessing ${operation} for ${appId}...\n`);
  
  const scriptPath = await getScriptPath(appId, operation);
  
  if (!scriptPath) {
    const message = `No ${operation} script found for ${appId}\n`;
    console.log(message);
    broadcastOutput(wss, message);
    return true;
  }

  try {
    console.log(`Executing script: ${scriptPath}`);
    broadcastOutput(wss, `Executing ${operation} script...\n`);
    await executeScript(wss, scriptPath, appConfig);
    const successMessage = `✅ ${appId} ${operation} completed successfully\n`;
    broadcastOutput(wss, successMessage);
    return true;
  } catch (error) {
    console.error(`Script execution failed:`, error);
    const errorMessage = `❌ Error during ${appId} ${operation}: ${error.message}\n`;
    broadcastOutput(wss, errorMessage);
    throw error;
  }
}