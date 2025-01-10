import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { environmentService } from '../environment.js';

export async function updateEnvironment(updates) {
  const envData = await environmentService.readEnvironment();
  
  const newEnvData = {
    ...envData,
    apps: {
      ...envData.apps,
      ...updates
    },
    lastUpdated: new Date().toISOString()
  };
  
  await environmentService.writeEnvironment(newEnvData);
  return newEnvData;
}

export async function updateSelections(updates) {
  const selectionsFile = join(process.cwd(), 'data', 'selections.json');
  const selections = JSON.parse(await readFile(selectionsFile, 'utf-8'));
  
  const updatedApps = selections.apps.map(app => {
    const update = updates.find(u => u.id === app.id);
    return update || app;
  });
  
  const newSelections = {
    ...selections,
    apps: updatedApps
  };
  
  await writeFile(selectionsFile, JSON.stringify(newSelections, null, 2));
  return newSelections;
}