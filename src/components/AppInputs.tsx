import React from 'react';
import { AppInput } from '../types/types';

interface AppInputsProps {
  inputs: AppInput[];
  onChange: (title: string, value: string) => void;
  onClick: (e: React.MouseEvent) => void;
}

export function AppInputs({ inputs, onChange, onClick }: AppInputsProps) {
  return (
    <div className="space-y-3" onClick={onClick}>
      {inputs.map((input) => (
        <div key={input.title} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            {input.title}
            {input.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={input.value || ''}
            onChange={(e) => onChange(input.title, e.target.value)}
            placeholder={input.placeholder}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}
    </div>
  );
}