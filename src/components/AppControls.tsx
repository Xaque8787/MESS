import React, { useState, useEffect } from 'react';
import { Settings, Trash2, Download } from 'lucide-react';
import { DockerApp } from '../types/types';
import { AppInputs } from './inputs/AppInputs';
import { checkPrerequisites, checkInputPrerequisites } from '../utils/prerequisiteCheck';
import { ErrorMessage } from './ErrorMessage';

interface AppControlsProps {
  app: DockerApp;
  allApps: DockerApp[];
  onInstall: (appId: string, inputs: Record<string, string | boolean>) => void;
  onRemove: (appId: string) => void;
  onUpdate: (appId: string, inputs: Record<string, string | boolean>) => void;
}

export function AppControls({ app, allApps, onInstall, onRemove, onUpdate }: AppControlsProps) {
  const [inputValues, setInputValues] = useState<Record<string, string | boolean>>({});
  const [prerequisiteError, setPrerequisiteError] = useState<string | null>(null);

  useEffect(() => {
    if (app.inputs) {
      const initialValues: Record<string, string | boolean> = {};
      app.inputs.forEach(input => {
        initialValues[input.title] = input.value ?? '';
        if (input.type === 'conditional-text' && input.dependentField) {
          initialValues[input.dependentField.title] = input.dependentField.value ?? '';
        }
      });
      setInputValues(initialValues);
    }
  }, [app]);

  const handleInputChange = (title: string, value: string | boolean, dependentValue?: string) => {
    setInputValues(prev => {
      const newValues = {
        ...prev,
        [title]: value
      };
      
      if (dependentValue !== undefined) {
        const input = app.inputs?.find(i => i.title === title);
        if (input?.dependentField) {
          newValues[input.dependentField.title] = dependentValue;
        }
      }
      
      return newValues;
    });
  };

  const checkAllPrerequisites = () => {
    // Check app-level prerequisites
    const appCheck = checkPrerequisites(app, allApps);
    if (!appCheck.isValid) {
      return appCheck;
    }

    // Check input-level prerequisites
    if (app.inputs) {
      for (const input of app.inputs) {
        const inputCheck = checkInputPrerequisites(input, allApps);
        if (!inputCheck.isValid) {
          return inputCheck;
        }
        
        // Check dependent field prerequisites if it exists
        if (input.type === 'conditional-text' && input.dependentField?.prereqs) {
          const dependentCheck = checkInputPrerequisites(input.dependentField, allApps);
          if (!dependentCheck.isValid) {
            return dependentCheck;
          }
        }
      }
    }

    return { isValid: true };
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleInstall = () => {
    const prereqCheck = checkAllPrerequisites();
    if (!prereqCheck.isValid) {
      setPrerequisiteError(prereqCheck.message || 'Prerequisite check failed');
      return;
    }
    setPrerequisiteError(null);
    onInstall(app.id, inputValues);
  };

  const isInstallDisabled = app.inputs?.some(input => {
    if (input.type === 'conditional-text' && input.value && input.dependentField?.required) {
      return !inputValues[input.dependentField.title];
    }
    return input.required && input.type === 'text' && (!inputValues[input.title] || !(inputValues[input.title] as string).trim());
  }) ?? false;

  return (
    <div className="mt-4 space-y-3 pl-10" onClick={(e) => e.stopPropagation()}>
      {prerequisiteError && (
        <ErrorMessage message={prerequisiteError} />
      )}
      
      {app.inputs && (
        <AppInputs
          inputs={app.inputs.map(input => ({
            ...input,
            value: inputValues[input.title] ?? input.value ?? '',
            ...(input.dependentField && {
              dependentField: {
                ...input.dependentField,
                value: inputValues[input.dependentField.title] ?? input.dependentField.value ?? ''
              }
            })
          }))}
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <div className="flex gap-3">
        {!app.initialized && (
          <button
            onClick={(e) => handleAction(e, handleInstall)}
            disabled={isInstallDisabled}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              isInstallDisabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Download className="w-4 h-4" />
            Install
          </button>
        )}

        {app.initialized && (
          <>
            <button
              onClick={(e) => handleAction(e, () => onUpdate(app.id, inputValues))}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Update
            </button>
            
            <button
              onClick={(e) => handleAction(e, () => onRemove(app.id))}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}