import React from 'react';
import { AppInput } from '../../types/types';
import { TextInput } from './TextInput';
import { CheckboxInput } from './CheckboxInput';
import { ConditionalTextInput } from './ConditionalTextInput';

interface AppInputsProps {
  inputs: AppInput[];
  onChange: (title: string, value: string | boolean, dependentValue?: string) => void;
  onClick: (e: React.MouseEvent) => void;
}

export function AppInputs({ inputs, onChange, onClick }: AppInputsProps) {
  // Filter out invisible inputs for UI rendering
  const visibleInputs = inputs.filter(input => input.visible !== false);

  return (
    <div className="space-y-3" onClick={onClick}>
      {visibleInputs.map((input) => (
        <div key={input.title}>
          {input.type === 'conditional-text' ? (
            <ConditionalTextInput
              input={input}
              onChange={onChange}
            />
          ) : input.type === 'checkbox' ? (
            <CheckboxInput
              input={input}
              onChange={(value) => onChange(input.title, value)}
            />
          ) : (
            <TextInput
              input={input}
              onChange={(value) => onChange(input.title, value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}