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

  for (const [appId, appConfig] of Object.entries(apps || {})) {
    // Skip if no pending changes
    if (!appConfig.pendingRemoval && !appConfig.pendingUpdate && !appConfig.pendingInstall) {
      continue;
    }

    try {
      // Determine the correct operation
      let operation;
      if (appConfig.pendingRemoval) {
        operation = 'remove';
      } else if (appConfig.pendingUpdate && appConfig.initialized) {
        operation = 'update';
      } else if (appConfig.pendingInstall && !appConfig.initialized) {
        operation = 'install';
      } else {
        broadcastOutput(wss, `Skipping ${appId}: No valid operation found\n`);
        continue;
      }

      broadcastOutput(wss, `Processing ${operation} for ${appId}...\n`);
      await processApp(wss, appId, appConfig, operation);

      // Update app state based on operation
      updatedApps[appId] = {
        ...appConfig,
        initialized: operation === 'install' ? true : operation === 'remove' ? false : appConfig.initialized,
        pendingInstall: false,
        pendingUpdate: false,
        pendingRemoval: false
      };
    } catch (error) {
      broadcastOutput(wss, `Error processing ${appId}: ${error.message}\n`);
      throw error;
    }
  }

  return updatedApps;
}

export async function executeDeployment(wss) {
  try {
    const envData = await getEnvironmentData();
    const updatedApps = await processApps(wss, envData.apps);
    
    // Update environment with new app states
    const newEnvData = {
      ...envData,
      apps: updatedApps
    };
    
    await updateEnvironmentData(newEnvData);
    return newEnvData;
  } catch (error) {
    console.error('Deployment error:', error);
    broadcastOutput(wss, `Deployment error: ${error.message}\n`);
    throw error;
  }
}