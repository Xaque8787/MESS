import { useState, useEffect, useCallback } from 'react';
import { DockerApp, PendingChanges, AppEnvironment } from '../types/types';
import { api } from '../services/api';
import { initialApps } from '../data/initialApps';

export function useAppSelections() {
  const [apps, setApps] = useState<DockerApp[]>(initialApps);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({
    installs: [],
    removals: [],
    updates: []
  });

  useEffect(() => {
    loadSelections();
  }, []);

  const loadSelections = async () => {
    try {
      const data = await api.getSelections();
      if (data.apps && data.apps.length > 0) {
        setApps(data.apps);
      }
    } catch (err) {
      setError('Failed to load selections');
    } finally {
      setLoading(false);
    }
  };

  const updatePendingChanges = useCallback((updatedApps: DockerApp[]) => {
    const changes: PendingChanges = {
      installs: [],
      removals: [],
      updates: []
    };

    updatedApps.forEach(app => {
      if (!app.initialized && app.pendingInstall) {
        changes.installs.push(app);
      } else if (app.initialized && app.pendingRemoval) {
        changes.removals.push(app);
      } else if (app.initialized && app.pendingUpdate) {
        changes.updates.push(app);
      }
    });

    setPendingChanges(changes);
  }, []);

  const handleSelect = (appId: string) => {
    setApps(prevApps => {
      const newApps = prevApps.map(app => ({
        ...app,
        selected: app.id === appId ? !app.selected : app.selected,
        ...(app.id === appId && !app.selected ? {
          pendingRemoval: false,
          pendingUpdate: false,
          pendingInstall: false
        } : {})
      }));
      updatePendingChanges(newApps);
      return newApps;
    });
  };

  const handleInstall = (appId: string, inputs: Record<string, string | boolean>) => {
    setApps(prevApps => {
      const newApps = prevApps.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            inputs: app.inputs?.map(input => ({
              ...input,
              value: inputs[input.title] || ''
            })),
            pendingInstall: true,
            pendingRemoval: false,
            pendingUpdate: false
          };
        }
        return app;
      });
      updatePendingChanges(newApps);
      return newApps;
    });
  };

  const handleRemove = (appId: string) => {
    setApps(prevApps => {
      const newApps = prevApps.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            pendingRemoval: true,
            pendingUpdate: false,
            pendingInstall: false
          };
        }
        return app;
      });
      updatePendingChanges(newApps);
      return newApps;
    });
  };

  const handleUpdate = (appId: string, inputs: Record<string, string | boolean>) => {
    setApps(prevApps => {
      const newApps = prevApps.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            inputs: app.inputs?.map(input => ({
              ...input,
              value: inputs[input.title]
            })),
            pendingUpdate: true,
            pendingRemoval: false,
            pendingInstall: false
          };
        }
        return app;
      });
      updatePendingChanges(newApps);
      return newApps;
    });
  };

  const handleInitialize = () => {
    if (
      pendingChanges.installs.length === 0 &&
      pendingChanges.removals.length === 0 &&
      pendingChanges.updates.length === 0
    ) {
      return;
    }
    setShowConfirmation(true);
  };

  const confirmChanges = async () => {
    try {
      const updatedApps = apps.map(app => {
        if (!app.initialized && app.pendingInstall) {
          return {
            ...app,
            initialized: true,
            selected: false,
            pendingInstall: false,
            pendingUpdate: false,
            pendingRemoval: false
          };
        }
        if (app.initialized && app.pendingRemoval) {
          return {
            ...app,
            initialized: false,
            selected: false,
            pendingInstall: false,
            pendingUpdate: false,
            pendingRemoval: false,
            inputs: app.inputs?.map(input => ({ ...input, value: '' }))
          };
        }
        if (app.initialized && app.pendingUpdate) {
          return {
            ...app,
            selected: false,
            pendingInstall: false,
            pendingUpdate: false,
            pendingRemoval: false
          };
        }
        return {
          ...app,
          selected: false,
          pendingInstall: false,
          pendingUpdate: false,
          pendingRemoval: false
        };
      });

      // Create environment data
      const envData: AppEnvironment = {};
      updatedApps.forEach(app => {
        if (app.initialized) {
          envData[app.id] = {
            installed: true,
            config: {}
          };
          app.inputs?.forEach(input => {
            if (input.value !== undefined) {
              envData[app.id].config[input.title] = input.value;
            }
          });
        }
      });

      await api.saveSelections({ apps: updatedApps });
      await api.initializeApps({ apps: updatedApps, environment: envData });
      
      setApps(updatedApps);
      setPendingChanges({ installs: [], removals: [], updates: [] });
      setShowConfirmation(false);
    } catch (err) {
      setError('Failed to apply changes');
    }
  };

  return {
    apps,
    loading,
    error,
    showConfirmation,
    pendingChanges,
    handleSelect,
    handleInstall,
    handleRemove,
    handleUpdate,
    handleInitialize,
    confirmChanges,
    cancelChanges: () => setShowConfirmation(false)
  };
}