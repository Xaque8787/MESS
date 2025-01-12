import React from 'react';
import { AppInput, DockerApp } from '../../types/types';
import { TextInput } from './TextInput';
import { CheckboxInput } from './CheckboxInput';
import { ConditionalTextInput } from './ConditionalTextInput';
import { checkInputPrerequisites } from '../../utils/prerequisiteCheck';

interface AppInputsProps {
  inputs: AppInput[];
  allApps: DockerApp[];
  onChange: (title: string, value: string | boolean, dependentValue?: string) => void;
  onClick: (e: React.MouseEvent) => void;
}

export function AppInputs({ inputs, allApps, onChange, onClick }: AppInputsProps) {
  // Filter out invisible inputs for UI rendering
  const visibleInputs = inputs.filter(input => input.visible !== false);

  const handleInputChange = (input: AppInput, value: string | boolean, dependentValue?: string) => {
    // For checkbox inputs with prerequisites, check if they can be enabled
    if (input.type === 'checkbox' && value === true && input.prereqs) {
      const prereqCheck = checkInputPrerequisites(input, allApps);
      if (!prereqCheck.isValid) {
        alert(prereqCheck.message);
        return;
      }
    }
    onChange(input.title, value, dependentValue);
  };

  return (
    <div className="space-y-3" onClick={onClick}>
      {visibleInputs.map((input) => (
        <div key={input.title}>
          {input.type === 'conditional-text' ? (
            <ConditionalTextInput
              input={input}
              onChange={(value, dependentValue) => handleInputChange(input, value, dependentValue)}
            />
          ) : input.type === 'checkbox' ? (
            <CheckboxInput
              input={input}
              onChange={(value) => handleInputChange(input, value)}
            />
          ) : (
            <TextInput
              input={input}
              onChange={(value) => handleInputChange(input, value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}