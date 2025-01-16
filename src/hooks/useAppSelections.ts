import { useState, useEffect, useCallback } from 'react';
import { DockerApp, PendingChanges, AppEnvironment } from '../types/types';
import { selectionsApi, environmentApi } from '../services/api';
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

  const loadSelections = async () => {
    try {
      const data = await selectionsApi.getSelections();
      const envData = await environmentApi.getEnvironment();

      const mergedApps = initialApps.map(initialApp => {
        const savedApp = data.apps?.find(app => app.id === initialApp.id);
        const envApp = envData.apps[initialApp.id];
        
        if (savedApp && envApp?.config) {
          return {
            ...initialApp,
            initialized: true,
            selected: false,
            inputs: initialApp.inputs?.map(input => {
              if (input.type === 'conditional-text' && input.dependentField) {
                return {
                  ...input,
                  value: envApp.config[input.title] ?? input.value,
                  dependentField: input.dependentField.map(field => ({
                    ...field,
                    value: envApp.config[field.title] ?? field.value
                  }))
                };
              }
              return {
                ...input,
                value: envApp.config[input.title] ?? input.value
              };
            })
          };
        }
        return initialApp;
      });

      setApps(mergedApps);
    } catch (err) {
      console.error('Error loading selections:', err);
      setError(err instanceof Error ? err.message : 'Failed to load selections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSelections();
  }, []);

  const handleSelect = useCallback((appId: string) => {
    setApps(prevApps => {
      const newApps = prevApps.map(app => ({
        ...app,
        selected: app.id === appId ? !app.selected : false,
        ...(app.id === appId && !app.selected ? {
          pendingRemoval: false,
          pendingUpdate: false,
          pendingInstall: false
        } : {})
      }));
      updatePendingChanges(newApps);
      return newApps;
    });
  }, [updatePendingChanges]);

  const handleInstall = useCallback((appId: string, inputs: Record<string, string | boolean>) => {
    setApps(prevApps => {
      const newApps = prevApps.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            inputs: app.inputs?.map(input => {
              if (input.type === 'conditional-text' && input.dependentField) {
                return {
                  ...input,
                  value: inputs[input.title],
                  dependentField: input.dependentField.map(field => ({
                    ...field,
                    value: inputs[field.title]
                  }))
                };
              }
              return {
                ...input,
                value: inputs[input.title]
              };
            }),
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
  }, [updatePendingChanges]);

  const handleRemove = useCallback((appId: string) => {
    setApps(prevApps => {
      const newApps = prevApps.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            pendingRemoval: true,
            pendingUpdate: false,
            pendingInstall: false,
            selected: false
          };
        }
        return app;
      });
      updatePendingChanges(newApps);
      return newApps;
    });
  }, [updatePendingChanges]);

  const handleUpdate = useCallback((appId: string, inputs: Record<string, string | boolean>) => {
    setApps(prevApps => {
      const newApps = prevApps.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            inputs: app.inputs?.map(input => {
              if (input.type === 'conditional-text' && input.dependentField) {
                return {
                  ...input,
                  value: inputs[input.title],
                  dependentField: input.dependentField.map(field => ({
                    ...field,
                    value: inputs[field.title]
                  }))
                };
              }
              return {
                ...input,
                value: inputs[input.title]
              };
            }),
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
  }, [updatePendingChanges]);

  const handleInitialize = useCallback(() => {
    if (
      pendingChanges.installs.length === 0 &&
      pendingChanges.removals.length === 0 &&
      pendingChanges.updates.length === 0
    ) {
      return;
    }
    setShowConfirmation(true);
  }, [pendingChanges]);

  const confirmChanges = async () => {
    try {
      const envData: AppEnvironment = {};
      
      apps.forEach(app => {
        if (!app.initialized && !app.pendingInstall) return;
        
        envData[app.id] = {
          installed: app.initialized,
          pendingInstall: app.pendingInstall || false,
          pendingUpdate: app.pendingUpdate || false,
          pendingRemoval: app.pendingRemoval || false,
          config: {}
        };

        app.inputs?.forEach(input => {
          if (input.type === 'conditional-text' && input.dependentField) {
            if (input.value) {
              envData[app.id].config[input.title] = input.value;
              input.dependentField.forEach(field => {
                if (field.value !== undefined) {
                  envData[app.id].config[field.title] = field.value;
                }
              });
            }
          } else if (input.value !== undefined) {
            envData[app.id].config[input.title] = input.value;
          }
        });
      });

      await selectionsApi.saveSelections({ apps });
      await environmentApi.initializeApps({ apps, environment: envData });
      
      await loadSelections();
      setPendingChanges({ installs: [], removals: [], updates: [] });
      setShowConfirmation(false);
    } catch (err) {
      console.error('Error in confirmChanges:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply changes';
      setError(errorMessage);
      throw err;
    }
  };

  const cancelChanges = useCallback(() => {
    setShowConfirmation(false);
  }, []);

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
    cancelChanges
  };
}