import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { DockerApp } from '../../types/types';

export async function updateEnvironment(updates: Record<string, DockerApp>) {
  const envFile = join(process.cwd(), 'data', 'env.json');
  const envData = JSON.parse(await readFile(envFile, 'utf-8'));
  
  const newEnvData = {
    ...envData,
    apps: {
      ...envData.apps,
      ...updates
    },
    lastUpdated: new Date().toISOString()
  };
  
  await writeFile(envFile, JSON.stringify(newEnvData, null, 2));
  return newEnvData;
}

export async function updateSelections(updates: DockerApp[]) {
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