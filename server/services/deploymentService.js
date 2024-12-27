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
    if (!appConfig || typeof appConfig !== 'object') continue;

    try {
      let operation = null;
      
      if (appConfig.pendingRemoval) {
        operation = 'remove';
      } else if (appConfig.pendingInstall && !appConfig.initialized) {
        operation = 'install';
      } else if (appConfig.pendingUpdate && appConfig.initialized) {
        operation = 'update';
      }

      if (!operation) {
        console.log(`No pending operation for ${appId}`);
        broadcastOutput(`No pending operation for ${appId}\n`);
        continue;
      }

      console.log(`Processing ${operation} for ${appId}`);
      broadcastOutput(`Processing ${operation} for ${appId}...\n`);
      
      await processApp(wss, appId, appConfig, operation);

      // Update app state based on operation result
      updatedApps[appId] = {
        ...appConfig,
        initialized: operation === 'install' ? true : operation === 'remove' ? false : appConfig.initialized,
        pendingInstall: false,
        pendingUpdate: false,
        pendingRemoval: false,
        selected: operation === 'remove' ? false : appConfig.selected, // Reset selected state on removal
        config: appConfig.config || {},
        // Reset input values on removal
        inputs: operation === 'remove' ? 
          appConfig.inputs?.map(input => ({
            ...input,
            value: undefined
          })) : 
          appConfig.inputs
      };

    } catch (error) {
      console.error(`Error processing ${appId}:`, error);
      broadcastOutput(`Error processing ${appId}: ${error.message}\n`);
      throw error;
    }
  }

  return updatedApps;
}

export async function executeDeployment(wss) {
  try {
    broadcastOutput('Starting deployment...\n');
    const envData = await getEnvironmentData();
    
    const updatedApps = await processApps(wss, envData.apps);
    
    const newEnvData = {
      ...envData,
      apps: updatedApps,
      lastUpdated: new Date().toISOString()
    };
    
    // Save the updated environment
    await updateEnvironmentData(newEnvData);
    
    // Also update the selections file to reflect the new state
    const selectionsFile = join(process.cwd(), 'data', 'selections.json');
    const selections = JSON.parse(await readFile(selectionsFile, 'utf-8'));
    
    selections.apps = selections.apps.map(app => {
      const updatedApp = updatedApps[app.id];
      if (updatedApp) {
        return {
          ...app,
          initialized: updatedApp.initialized,
          pendingInstall: false,
          pendingUpdate: false,
          pendingRemoval: false,
          selected: updatedApp.selected, // Preserve selected state from updatedApps
          inputs: updatedApp.inputs // Preserve input values from updatedApps
        };
      }
      return app;
    });
    
    await writeFile(selectionsFile, JSON.stringify(selections, null, 2));
    
    broadcastOutput('Deployment completed successfully\n');
    return newEnvData;
  } catch (error) {
    console.error('Deployment error:', error);
    broadcastOutput(`Deployment error: ${error.message}\n`);
    throw error;
  }
}