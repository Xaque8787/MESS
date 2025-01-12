import { DockerApp, AppInput, InputPrereq } from '../types/types';

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

export function checkInputPrerequisites(
  input: AppInput,
  allApps: DockerApp[]
): { isValid: boolean; message?: string } {
  if (!input.prereqs || input.prereqs.length === 0) {
    return { isValid: true };
  }

  for (const prereq of input.prereqs) {
    const prereqApp = allApps.find(a => a.id === prereq.appId);
    
    // Check if prerequisite app exists and is installed/pending
    if (!prereqApp || (!prereqApp.initialized && !prereqApp.pendingInstall)) {
      return {
        isValid: false,
        message: `${prereq.appId} must be installed first to enable this option`
      };
    }

    // Check input value
    const prereqInput = prereqApp.inputs?.find(i => i.title === prereq.inputTitle);
    if (!prereqInput || prereqInput.value !== prereq.value) {
      return {
        isValid: false,
        message: `${prereqApp.name} must have "${prereq.inputTitle}" enabled to use this option`
      };
    }
  }

  return { isValid: true };
}