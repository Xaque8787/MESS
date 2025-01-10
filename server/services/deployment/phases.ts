import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { DockerApp } from '../../types/types';
import { processApp } from '../scriptService.js';
import { broadcastOutput } from '../websocketService.js';
import { updateEnvironment, updateSelections } from './state.js';

export async function executeUpPhase() {
  const selectionsFile = join(process.cwd(), 'data', 'selections.json');
  const selections = JSON.parse(await readFile(selectionsFile, 'utf-8'));
  
  const upApp = selections.apps.find(app => app.id === 'first_run_up');
  if (!upApp?.pendingInstall) {
    return null;
  }

  console.log('Executing up phase...');
  await processApp(null, upApp.id, upApp, 'install');
  
  const updatedApp = {
    ...upApp,
    initialized: true,
    pendingInstall: false
  };

  await updateEnvironment({ [upApp.id]: updatedApp });
  await updateSelections([updatedApp]);
  
  return updatedApp;
}

export async function executeAppPhase(apps: DockerApp[]) {
  console.log('Executing app phase...');
  const results = [];

  for (const app of apps) {
    if (!app.pendingInstall || app.id === 'first_run_up' || app.id === 'first_run_down') {
      continue;
    }

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
}

export async function executeDownPhase() {
  const selectionsFile = join(process.cwd(), 'data', 'selections.json');
  const selections = JSON.parse(await readFile(selectionsFile, 'utf-8'));
  
  const downApp = selections.apps.find(app => app.id === 'first_run_down');
  if (!downApp?.pendingInstall) {
    return null;
  }

  console.log('Executing down phase...');
  await processApp(null, downApp.id, downApp, 'install');
  
  const updatedApp = {
    ...downApp,
    initialized: true,
    pendingInstall: false
  };

  await updateEnvironment({ [downApp.id]: updatedApp });
  await updateSelections([updatedApp]);
  
  return updatedApp;
}