export interface AppEnvironment {
  // Each key is an app ID, value is whether it's initialized
  [appId: string]: boolean;
}

export interface EnvironmentData {
  // Version for future compatibility
  version: string;
  // Timestamp of last update
  lastUpdated: string;
  // App states
  apps: AppEnvironment;
}