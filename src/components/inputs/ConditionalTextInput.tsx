import React from 'react';
import { AppInput } from '../../types/types';

interface ConditionalTextInputProps {
  input: AppInput;
  onChange: (value: string | boolean, dependentValue?: string) => void;
}

export function ConditionalTextInput({ input, onChange }: ConditionalTextInputProps) {
  const handleCheckboxChange = (checked: boolean) => {
    // When unchecking, clear both the checkbox and dependent field
    if (!checked) {
      onChange(false);
    } else {
      // When checking, just set the checkbox to true
      onChange(true, input.dependentField?.value || '');
    }
  };

  const handleTextChange = (value: string) => {
    if (input.dependentField) {
      // Keep checkbox checked and update dependent value
      onChange(true, value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={input.title}
            checked={input.value as boolean || false}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={input.title} className="text-sm font-medium text-gray-700">
            {input.title}
          </label>
        </div>
        {input.description && (
          <p className="text-sm text-gray-500 mt-1 ml-6">{input.description}</p>
        )}
      </div>
      
      {input.value && input.dependentField && (
        <div className="ml-6">
          {input.dependentField.description && (
            <p className="text-sm text-gray-500 mb-2">{input.dependentField.description}</p>
          )}
          <input
            type={input.dependentField.isPassword ? "password" : "text"}
            value={input.dependentField.value || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={input.dependentField.placeholder}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            required={input.dependentField.required}
          />
          {input.dependentField.required && !input.dependentField.value && (
            <p className="text-red-500 text-xs mt-1">This field is required when {input.title} is enabled</p>
          )}
        </div>
      )}
    </div>
  );
}