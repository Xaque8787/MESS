import React from 'react';
import { DockerApp } from '../types/types';
import { AppSelector } from './AppSelector';
import { AppControls } from './AppControls';

interface CategorySectionProps {
  category: string;
  apps: DockerApp[];
  allApps: DockerApp[]; // Add this prop
  onSelect: (id: string) => void;
  onInstall: (appId: string, inputs: Record<string, string | boolean>) => void;
  onRemove: (appId: string) => void;
  onUpdate: (appId: string, inputs: Record<string, string | boolean>) => void;
}

export function CategorySection({ 
  category, 
  apps,
  allApps, // Add this prop
  onSelect, 
  onInstall,
  onRemove,
  onUpdate 
}: CategorySectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
      <div className="space-y-4">
        {apps.map(app => (
          <div key={app.id}>
            <AppSelector app={app} onSelect={() => onSelect(app.id)} />
            {app.selected && app.inputs && (
              <AppControls
                app={app}
                allApps={allApps}
                onInstall={onInstall}
                onRemove={onRemove}
                onUpdate={onUpdate}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}