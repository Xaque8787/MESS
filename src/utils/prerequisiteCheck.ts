import { DockerApp } from '../types/types';

export function checkPrerequisites(
  app: DockerApp,
  apps: DockerApp[]
): { isValid: boolean; message?: string } {
  if (!app.prereq) {
    return { isValid: true };
  }

  const prereqApp = apps.find(a => a.id === app.prereq);
  if (!prereqApp) {
    return { 
      isValid: false,
      message: `Required app ${app.prereq} not found`
    };
  }

  const isPrereqInstalled = prereqApp.initialized || prereqApp.pendingInstall;
  if (!isPrereqInstalled) {
    return {
      isValid: false,
      message: `${prereqApp.name} must be installed first`
    };
  }

  return { isValid: true };
}