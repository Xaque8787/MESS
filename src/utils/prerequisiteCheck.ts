import { DockerApp } from '../types/types';

export function checkPrerequisites(
  app: DockerApp,
  apps: DockerApp[]
): { isValid: boolean; message?: string } {
  if (!app.prereqs || app.prereqs.length === 0) {
    return { isValid: true };
  }

  for (const prereqId of app.prereqs) {
    const prereqApp = apps.find(a => a.id === prereqId);
    if (!prereqApp) {
      return { 
        isValid: false,
        message: `Required app ${prereqId} not found`
      };
    }

    const isPrereqInstalled = prereqApp.initialized || prereqApp.pendingInstall;
    if (!isPrereqInstalled) {
      return {
        isValid: false,
        message: `${prereqApp.name} must be installed first`
      };
    }
  }

  return { isValid: true };
}