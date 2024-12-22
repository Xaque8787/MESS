import React, { useState } from 'react';
import { PendingChanges } from '../types/types';
import { TerminalOutput } from './TerminalOutput';

interface ConfirmationDialogProps {
  changes: PendingChanges;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({ changes, onConfirm, onCancel }: ConfirmationDialogProps) {
  const [showTerminal, setShowTerminal] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setShowTerminal(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Confirm Changes</h2>
          
          {changes.installs.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-green-600 mb-2">Apps to Install:</h3>
              <ul className="list-disc pl-5">
                {changes.installs.map(app => (
                  <li key={app.id}>{app.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {changes.removals.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-red-600 mb-2">Apps to Remove:</h3>
              <ul className="list-disc pl-5">
                {changes.removals.map(app => (
                  <li key={app.id}>{app.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {changes.updates.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-blue-600 mb-2">Apps to Update:</h3>
              <ul className="list-disc pl-5">
                {changes.updates.map(app => (
                  <li key={app.id}>{app.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      <TerminalOutput
        show={showTerminal}
        onClose={() => setShowTerminal(false)}
      />
    </>
  );
}