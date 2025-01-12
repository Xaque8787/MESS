export interface InputPrereq {
  appId: string;
  inputTitle: string;
  value: string | boolean;
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
  dependentField?: {
    title: string;
    envName: string;
    description?: string;
    placeholder?: string;
    value?: string;
    required: boolean;
    visible?: boolean;
    quoteValue?: boolean;
    isPassword?: boolean;
    prereqs?: InputPrereq[];
  };
}