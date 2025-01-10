import React from 'react';
import { AppInput } from '../../types/types';

interface TextInputProps {
  input: AppInput;
  onChange: (value: string) => void;
}

export function TextInput({ input, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {input.title}
        {input.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {input.description && (
        <p className="text-sm text-gray-500 mb-2">{input.description}</p>
      )}
      <input
        type={input.isPassword ? "password" : "text"}
        value={(input.value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={input.placeholder}
        className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}