import React from 'react';
import { Server } from 'lucide-react';
import { DockerApp } from '../types/types';

interface AppSelectorProps {
  app: DockerApp;
  onSelect: (id: string) => void;
}

export function AppSelector({ app, onSelect }: AppSelectorProps) {
  const getBorderStyle = () => {
    if (app.pendingRemoval) return 'border-red-500 bg-red-50';
    if (app.initialized && app.pendingUpdate) return 'border-yellow-500 bg-yellow-50';
    if (app.initialized) return 'border-green-500 bg-green-50';
    if (app.pendingInstall) return 'border-blue-500 bg-blue-50';
    if (app.selected) return 'border-gray-300 bg-gray-50';
    return 'border-gray-200 hover:border-gray-300';
  };

  const getStatusLabel = () => {
    if (app.pendingRemoval) return (
      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
        Pending Removal
      </span>
    );
    if (app.initialized && app.pendingUpdate) return (
      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
        Update Pending
      </span>
    );
    if (app.initialized) return (
      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
        Installed
      </span>
    );
    if (app.pendingInstall) return (
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
        Installation Pending
      </span>
    );
    return null;
  };

  const AppIcon = () => {
    if (app.iconUrl) {
      return (
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={app.iconUrl} 
            alt={app.name} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }
    return <Server className={`w-16 h-16 ${
      app.pendingRemoval ? 'text-red-500' :
      app.initialized && app.pendingUpdate ? 'text-yellow-500' :
      app.initialized ? 'text-green-500' :
      app.pendingInstall ? 'text-blue-500' :
      'text-gray-400'
    }`} />;
  };

  return (
    <div 
      onClick={() => onSelect(app.id)}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${getBorderStyle()}`}
    >
      <div className="flex items-center gap-3">
        <AppIcon />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{app.name}</h3>
            {getStatusLabel()}
          </div>
          <p className="text-sm text-gray-500">{app.description}</p>
        </div>
      </div>
    </div>
  );
}