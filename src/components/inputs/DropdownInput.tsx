import React from 'react';
import { AppInput } from '../../types/types';

interface DropdownInputProps {
  input: AppInput;
  onChange: (value: string) => void;
}

export function DropdownInput({ input, onChange }: DropdownInputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {input.title}
        {input.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {input.description && (
        <p className="text-sm text-gray-500 mb-2">{input.description}</p>
      )}
      <select
        value={input.value as string || ''}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        required={input.required}
      >
        <option value="">Select an option</option>
        {input.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
