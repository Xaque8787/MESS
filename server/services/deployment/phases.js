import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { processApp } from '../scriptService.js';
import { broadcastOutput } from '../websocketService.js';
import { updateEnvironment, updateSelections } from './state.js';
import { environmentService } from '../environment.js';

export async function executeUpPhase() {
  try {
    const envData = await environmentService.readEnvironment();
    if (!envData.isFirstRun) {
      console.log('[Up Phase] Not first run, skipping');
      return null;
    }

    console.log('[Up Phase] Starting first run initialization...');
    broadcastOutput('=== Phase 1: Initialization ===\n');
    
    const selectionsFile = join(process.cwd(), 'data', 'selections.json');
    const selections = JSON.parse(await readFile(selectionsFile, 'utf-8'));
    
    const upApp = selections.apps.find(app => app.id === 'first_run_up');
    if (!upApp?.pendingInstall) {
      return null;
    }

    await processApp(null, upApp.id, upApp, 'install');
    
    const updatedApp = {
      ...upApp,
      initialized: true,
      pendingInstall: false
    };

    await updateEnvironment({ [upApp.id]: updatedApp });
    await updateSelections([updatedApp]);
    
    return updatedApp;
  } catch (error) {
    console.error('[Up Phase] Error:', error);
    broadcastOutput(`Error in up phase: ${error.message}\n`);
    throw error;
  }
}

export async function executeAppPhase(apps) {
  try {
    console.log('[App Phase] Starting...');
    broadcastOutput('=== Phase 2: Application Installation ===\n');
    
    const results = [];

    for (const app of apps) {
      if (!app.pendingInstall || app.id === 'first_run_up' || app.id === 'first_run_down') {
        continue;
      }

      console.log(`[App Phase] Processing ${app.id}...`);
      await processApp(null, app.id, app, 'install');
      
      const updatedApp = {
        ...app,
        initialized: true,
        pendingInstall: false
      };
      
      results.push(updatedApp);
    }

    if (results.length > 0) {
      await updateEnvironment(
        results.reduce((acc, app) => ({ ...acc, [app.id]: app }), {})
      );
      await updateSelections(results);
    }

    return results;
  } catch (error) {
    console.error('[App Phase] Error:', error);
    broadcastOutput(`Error in app phase: ${error.message}\n`);
    throw error;
  }
}

export async function executeDownPhase() {
  try {
    const envData = await environmentService.readEnvironment();
    if (!envData.isFirstRun) {
      console.log('[Down Phase] Not first run, skipping');
      return null;
    }

    console.log('[Down Phase] Starting...');
    broadcastOutput('=== Phase 3: Finalization ===\n');
    
    const selectionsFile = join(process.cwd(), 'data', 'selections.json');
    const selections = JSON.parse(await readFile(selectionsFile, 'utf-8'));
    
    const downApp = selections.apps.find(app => app.id === 'first_run_down');
    if (!downApp?.pendingInstall) {
      return null;
    }

    await processApp(null, downApp.id, downApp, 'install');
    
    const updatedApp = {
      ...downApp,
      initialized: true,
      pendingInstall: false
    };

    await updateEnvironment({ [downApp.id]: updatedApp });
    await updateSelections([updatedApp]);
    
    return updatedApp;
  } catch (error) {
    console.error('[Down Phase] Error:', error);
    broadcastOutput(`Error in down phase: ${error.message}\n`);
    throw error;
  }
}