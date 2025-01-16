import React from 'react';
import { AppInput, DependentField, DockerApp } from '../../types/types';
import { checkInputPrerequisites } from '../../utils/prerequisiteCheck';

interface ConditionalTextInputProps {
  input: AppInput;
  allApps?: DockerApp[];
  onChange: (value: string | boolean, dependentValues?: Record<string, string | boolean>) => void;
}

export function ConditionalTextInput({ input, allApps = [], onChange }: ConditionalTextInputProps) {
  const handleCheckboxChange = (checked: boolean) => {
    if (!checked) {
      // When unchecking, clear all dependent values
      const clearedValues: Record<string, string | boolean> = {};
      input.dependentField?.forEach(field => {
        clearedValues[field.title] = field.type === 'checkbox' ? false : '';
      });
      onChange(false, clearedValues);
    } else {
      // When checking, initialize with existing or default values
      const dependentValues: Record<string, string | boolean> = {};
      input.dependentField?.forEach(field => {
        dependentValues[field.title] = field.value ?? (field.type === 'checkbox' ? false : '');
      });
      onChange(true, dependentValues);
    }
  };

  const handleDependentValueChange = (field: DependentField, value: string | boolean) => {
    if (!input.dependentField) return;

    // Check prerequisites if they exist
    if (field.prereqs && allApps.length > 0) {
      const prereqCheck = checkInputPrerequisites({ ...field, type: 'text' }, allApps);
      if (!prereqCheck.isValid) {
        alert(prereqCheck.message);
        return;
      }
    }

    // Collect all current dependent values
    const dependentValues: Record<string, string | boolean> = {};
    input.dependentField.forEach(f => {
      dependentValues[f.title] = f === field ? value : (f.value ?? (f.type === 'checkbox' ? false : ''));
    });

    onChange(true, dependentValues);
  };

  // Ensure we have a boolean value for the checkbox
  const isChecked = Boolean(input.value);

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={input.title}
            checked={isChecked}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label 
            htmlFor={input.title} 
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {input.title}
          </label>
        </div>
        {input.description && (
          <p className="text-sm text-gray-500 mt-1 ml-6">{input.description}</p>
        )}
      </div>
      
      {isChecked && input.dependentField && (
        <div className="ml-6 grid grid-cols-1 gap-4">
          {input.dependentField.map((field) => (
            <div key={field.title} className="space-y-2">
              {field.description && (
                <p className="text-sm text-gray-500">{field.description}</p>
              )}
              {field.type === 'checkbox' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`${input.title}-${field.title}`}
                    checked={Boolean(field.value)}
                    onChange={(e) => handleDependentValueChange(field, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label 
                    htmlFor={`${input.title}-${field.title}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {field.title}
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.title}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type={field.isPassword ? "password" : "text"}
                    value={(field.value as string) || ''}
                    onChange={(e) => handleDependentValueChange(field, e.target.value)}
                    placeholder={field.placeholder}
                    className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    required={field.required}
                  />
                  {field.required && !field.value && (
                    <p className="text-red-500 text-xs mt-1">
                      This field is required when {input.title} is enabled
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}