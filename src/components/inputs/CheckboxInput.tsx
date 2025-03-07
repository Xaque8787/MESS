import React from 'react';
import { HelpCircle } from 'lucide-react';
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
        {input.tooltip && (
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
              {input.tooltip}
              <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </div>
      {input.description && (
        <p className="text-sm text-gray-500 mt-1 ml-6">{input.description}</p>
      )}
    </div>
  );
}