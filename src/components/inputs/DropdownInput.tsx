import React from 'react';
import { HelpCircle } from 'lucide-react';
import { AppInput } from '../../types/types';

interface DropdownInputProps {
  input: AppInput;
  onChange: (value: string) => void;
}

export function DropdownInput({ input, onChange }: DropdownInputProps) {
  // Convert \n in tooltip to line breaks
  const tooltipContent = input.tooltip?.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < input.tooltip!.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">
          {input.title}
          {input.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {input.tooltip && (
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] max-w-xs whitespace-normal break-words">
              {tooltipContent}
              <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </div>
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