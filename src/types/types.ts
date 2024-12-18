export interface AppInput {
  title: string;
  type: 'text' | 'checkbox';
  required: boolean;
  placeholder?: string;
  value?: string | boolean;
}

export interface DockerApp {
  id: string;
  name: string;
  description: string;
  category: string;
  selected: boolean;
  initialized?: boolean;
  pendingRemoval?: boolean;
  pendingUpdate?: boolean;
  pendingInstall?: boolean;
  prereq?: string;
  inputs?: AppInput[];
}

export interface AppSelections {
  apps: DockerApp[];
}

export interface PendingChanges {
  installs: DockerApp[];
  removals: DockerApp[];
  updates: DockerApp[];
}

export interface AppConfig {
  [key: string]: string | boolean;
}

export interface AppEnvironment {
  [appId: string]: {
    installed: boolean;
    config: AppConfig;
  };
}