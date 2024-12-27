export interface AppInput {
  title: string;
  type: 'text' | 'checkbox' | 'conditional-text';
  required: boolean;
  placeholder?: string;
  value?: string | boolean;
  dependentField?: {
    title: string;
    placeholder?: string;
    value?: string;
    required: boolean;
  };
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
  prereqs?: string[]; // Changed from string to string[]
  iconUrl?: string;  // Added support for custom icons
  inputs?: AppInput[];
}