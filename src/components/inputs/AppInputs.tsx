import React from 'react';
import { AppInput, DockerApp } from '../../types/types';
import { TextInput } from './TextInput';
import { CheckboxInput } from './CheckboxInput';
import { ConditionalTextInput } from './ConditionalTextInput';
import { DropdownInput } from './DropdownInput';
import { checkInputPrerequisites } from '../../utils/prerequisiteCheck';

interface AppInputsProps {
  inputs: AppInput[];
  allApps: DockerApp[];
  onChange: (title: string, value: string | boolean, dependentValues?: Record<string, string | boolean>) => void;
  onClick: (e: React.MouseEvent) => void;
}

export function AppInputs({ inputs, allApps, onChange, onClick }: AppInputsProps) {
  const visibleInputs = inputs.filter(input => input.visible !== false);

  const handleInputChange = (input: AppInput, value: string | boolean, dependentValues?: Record<string, string | boolean>) => {
    if (input.type === 'checkbox' && value === true && input.prereqs) {
      const prereqCheck = checkInputPrerequisites(input, allApps);
      if (!prereqCheck.isValid) {
        alert(prereqCheck.message);
        return;
      }
    }
    onChange(input.title, value, dependentValues);
  };

  return (
    <div className="space-y-3" onClick={onClick}>
      {visibleInputs.map((input) => (
        <div key={input.title}>
          {input.type === 'dropdown' ? (
            <DropdownInput
              input={input}
              onChange={(value) => handleInputChange(input, value)}
            />
          ) : input.type === 'conditional-text' ? (
            <ConditionalTextInput
              input={input}
              allApps={allApps}
              onChange={(value, dependentValues) => handleInputChange(input, value, dependentValues)}
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
