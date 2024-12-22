#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

// Get the environment data
const envFile = path.join(process.cwd(), 'data', 'env.json');

async function main() {
  try {
    const envData = JSON.parse(await fs.readFile(envFile, 'utf-8'));
    console.log('Starting configuration with environment:', envData);
    
    // Here you can add your custom logic to handle the environment data
    // For example, running docker-compose commands or other scripts
    
    for (const [appId, appConfig] of Object.entries(envData)) {
      if (appId === 'version' || appId === 'lastUpdated') continue;
      
      const scriptPath = path.join(process.cwd(), 'scripts', 'apps', `${appId}.sh`);
      try {
        await fs.access(scriptPath);
        console.log(`Executing script for ${appId}...`);
        
        const process = spawn('bash', [scriptPath], {
          env: {
            ...process.env,
            APP_CONFIG: JSON.stringify(appConfig)
          }
        });

        process.stdout.on('data', (data) => {
          console.log(`[${appId}] ${data.toString()}`);
        });

        process.stderr.on('data', (data) => {
          console.error(`[${appId}] Error: ${data.toString()}`);
        });

        await new Promise((resolve, reject) => {
          process.on('close', (code) => {
            if (code === 0) {
              console.log(`[${appId}] Script completed successfully`);
              resolve();
            } else {
              reject(new Error(`Script failed with code ${code}`));
            }
          });
        });
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`No script found for ${appId}, skipping...`);
        } else {
          throw err;
        }
      }
    }
  } catch (error) {
    console.error('Error executing scripts:', error);
    process.exit(1);
  }
}

main();