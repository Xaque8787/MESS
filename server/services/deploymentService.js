import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { broadcastOutput } from './websocketService.js';
import { processApp } from './scriptService.js';

export async function executeDeployment(wss) {
  try {
    console.log('Starting deployment process');
    broadcastOutput('Starting deployment...\n');

    const selectionsFile = join(process.cwd(), 'data', 'selections.json');
    const selections = JSON.parse(await readFile(selectionsFile, 'utf-8'));
    
    // Sort apps by installOrder, putting nulls last and handling undefined
    const sortedApps = [...selections.apps].sort((a, b) => {
      if (a.installOrder === null || a.installOrder === undefined) return 1;
      if (b.installOrder === null || b.installOrder === undefined) return -1;
      return a.installOrder - b.installOrder;
    });

    // Filter apps that need processing
    const appsToProcess = sortedApps.filter(app => 
      (app.pendingInstall && !app.initialized) || 
      app.pendingUpdate || 
      app.pendingRemoval
    );

    // Process each app
    for (const app of appsToProcess) {
      if (app.pendingInstall && !app.initialized) {
        await processApp(wss, app.id, app, 'install');
      } else if (app.pendingUpdate) {
        await processApp(wss, app.id, app, 'update');
      } else if (app.pendingRemoval) {
        await processApp(wss, app.id, app, 'remove');
      }
    }

    broadcastOutput('\n=== Deployment completed successfully ===\n');
    return true;
  } catch (error) {
    console.error('Deployment error:', error);
    broadcastOutput(`Deployment error: ${error.message}\n`);
    throw error;
  }
}