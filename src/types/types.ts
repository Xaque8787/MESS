export interface InputPrereq {
  appId: string;
  inputTitle: string;
  value: string | boolean;
}

export interface DependentField {
  title: string;
  envName: string;
  description?: string;
  placeholder?: string;
  value?: string | boolean;
  required: boolean;
  visible?: boolean;
  quoteValue?: boolean;
  isPassword?: boolean;
  prereqs?: InputPrereq[];
  type: 'text' | 'checkbox';
}

export interface AppInput {
  title: string;
  envName: string;
  type: 'text' | 'checkbox' | 'conditional-text';
  required: boolean;
  description?: string;
  placeholder?: string;
  value?: string | boolean;
  visible?: boolean;
  quoteValue?: boolean;
  isPassword?: boolean;
  prereqs?: InputPrereq[];
  dependentField?: DependentField[];
}

export interface DockerApp {
  id: string;
  name: string;
  description: string;
  category: string;
  selected: boolean;
  initialized: boolean;
  pendingInstall?: boolean;
  pendingUpdate?: boolean;
  pendingRemoval?: boolean;
  installOrder?: number;
  visible?: boolean;
  prereqs?: string[];
  iconUrl?: string;
  inputs?: AppInput[];
}

export interface PendingChanges {
  installs: DockerApp[];
  removals: DockerApp[];
  updates: DockerApp[];
}

export interface AppEnvironment {
  [appId: string]: {
    initialized: boolean;
    config: Record<string, any>;
    pendingInstall?: boolean;
    pendingUpdate?: boolean;
    pendingRemoval?: boolean;
  };
}