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
      if (app.pendingInstall && !app.initialized) {
        changes.installs.push(app);
      } else if (app.pendingRemoval && app.initialized) {
        changes.removals.push(app);
      } else if (app.pendingUpdate && app.initialized) {
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
              value: inputs[input.title] ?? input.value ?? ''
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
      // Create environment data with pending operations preserved
      const envData: AppEnvironment = {};
      apps.forEach(app => {
        envData[app.id] = {
          installed: app.initialized,
          pendingInstall: app.pendingInstall || false,
          pendingUpdate: app.pendingUpdate || false,
          pendingRemoval: app.pendingRemoval || false,
          config: {}
        };
        app.inputs?.forEach(input => {
          if (input.value !== undefined) {
            envData[app.id].config[input.title] = input.value;
          }
        });
      });

      await api.saveSelections({ apps });
      await api.initializeApps({ apps, environment: envData });
      
      // Update local state after successful initialization
      setApps(prevApps => prevApps.map(app => ({
        ...app,
        initialized: app.pendingInstall ? true : app.pendingRemoval ? false : app.initialized,
        pendingInstall: false,
        pendingUpdate: false,
        pendingRemoval: false,
        selected: false
      })));
      
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