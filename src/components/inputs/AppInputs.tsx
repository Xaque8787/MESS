import React from 'react';
import { AppInput } from '../../types/types';
import { TextInput } from './TextInput';
import { CheckboxInput } from './CheckboxInput';

interface AppInputsProps {
  inputs: AppInput[];
  onChange: (title: string, value: string | boolean) => void;
  onClick: (e: React.MouseEvent) => void;
}

export function AppInputs({ inputs, onChange, onClick }: AppInputsProps) {
  return (
    <div className="space-y-3" onClick={onClick}>
      {inputs.map((input) => (
        <div key={input.title}>
          {input.type === 'checkbox' ? (
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