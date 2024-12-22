import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { processApp } from './scriptService.js';
import { broadcastOutput } from './websocketService.js';

async function getEnvironmentData() {
  const envFile = join(process.cwd(), 'data', 'env.json');
  const data = await readFile(envFile, 'utf-8');
  return JSON.parse(data);
}

async function updateEnvironmentData(envData) {
  const envFile = join(process.cwd(), 'data', 'env.json');
  await writeFile(envFile, JSON.stringify(envData, null, 2));
}

async function processApps(wss, apps) {
  const updatedApps = { ...apps };
  
  for (const [appId, appConfig] of Object.entries(apps)) {
    // Skip if no pending changes or not an object
    if (!appConfig || typeof appConfig !== 'object') continue;

    try {
      // Determine the correct operation based on pending flags
      let operation = null;
      
      if (appConfig.pendingRemoval) {
        operation = 'remove';
      } else if (appConfig.pendingInstall && !appConfig.initialized) {
        operation = 'install';
      } else if (appConfig.pendingUpdate && appConfig.initialized) {
        operation = 'update';
      }

      // Skip if no operation needed
      if (!operation) {
        console.log(`No pending operation for ${appId}`);
        continue;
      }

      console.log(`Processing ${operation} for ${appId}`);
      broadcastOutput(wss, `Processing ${operation} for ${appId}...\n`);
      
      await processApp(wss, appId, appConfig, operation);

      // Update app state based on operation result
      updatedApps[appId] = {
        ...appConfig,
        initialized: operation === 'install' ? true : operation === 'remove' ? false : appConfig.initialized,
        pendingInstall: false,
        pendingUpdate: false,
        pendingRemoval: false
      };

    } catch (error) {
      console.error(`Error processing ${appId}:`, error);
      broadcastOutput(wss, `Error processing ${appId}: ${error.message}\n`);
      throw error;
    }
  }

  return updatedApps;
}

export async function executeDeployment(wss) {
  try {
    const envData = await getEnvironmentData();
    
    // Process apps and get updated states
    const updatedApps = await processApps(wss, envData.apps);
    
    // Update environment with new app states
    const newEnvData = {
      ...envData,
      apps: updatedApps,
      lastUpdated: new Date().toISOString()
    };
    
    await updateEnvironmentData(newEnvData);
    return newEnvData;
  } catch (error) {
    console.error('Deployment error:', error);
    broadcastOutput(wss, `Deployment error: ${error.message}\n`);
    throw error;
  }
}