import React from 'react';
import { AppInput } from '../../types/types';

interface CheckboxInputProps {
  input: AppInput;
  onChange: (value: boolean) => void;
}

export function CheckboxInput({ input, onChange }: CheckboxInputProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={input.title}
          checked={input.value as boolean || false}
          onChange={(e) => onChange(e.target.checked)}
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
  );
}