export async function updateAppStates(apps, environment, service) {
  console.log('Updating app states:', { apps, environment });
  const currentEnv = await service.readEnvironment();
  const updatedEnv = {
    ...currentEnv,
    lastUpdated: new Date().toISOString(),
    apps: { ...currentEnv.apps }
  };

  // First, handle run scripts - ALWAYS set them to uninitialized state
  updatedEnv.apps['run_up'] = {
    initialized: false,
    pendingInstall: true,
    pendingUpdate: false,
    pendingRemoval: false,
    config: {}
  };

  updatedEnv.apps['run_down'] = {
    initialized: false,
    pendingInstall: true,
    pendingUpdate: false,
    pendingRemoval: false,
    config: {}
  };

  // Check if this is the first run
  const isFirstRun = currentEnv.isFirstRun;

  // Process each app's state and config
  apps.forEach(app => {
    // Skip first run scripts if not first run
    if ((app.id === 'first_run_up' || app.id === 'first_run_down') && !isFirstRun) {
      return;
    }

    // Skip run scripts as they're already handled
    if (app.id === 'run_up' || app.id === 'run_down') {
      return;
    }

    if (app.pendingRemoval) {
      // Remove app config on removal
      delete updatedEnv.apps[app.id];
    } else if (app.pendingInstall || app.pendingUpdate) {
      const config = {};

      // Process inputs into config
      app.inputs?.forEach(input => {
        if (input.type === 'conditional-text' && input.dependentField) {
          if (input.value !== undefined) {
            config[input.title] = input.value;

            if (input.value === true) {
              input.dependentField.forEach(field => {
                if (field.value !== undefined) {
                  config[field.title] = field.value;
                }
              });
            }
          }
        } else if (input.value !== undefined) {
          config[input.title] = input.value;
        }
      });

      updatedEnv.apps[app.id] = {
        initialized: true,
        pendingInstall: app.pendingInstall || false,
        pendingUpdate: app.pendingUpdate || false,
        pendingRemoval: app.pendingRemoval || false,
        config
      };
    }
  });

  // Set isFirstRun to false after processing first run
  if (isFirstRun && apps.some(app => app.pendingInstall)) {
    updatedEnv.isFirstRun = false;
  }

  console.log('Updated environment:', updatedEnv);
  await service.writeEnvironment(updatedEnv);
  return updatedEnv;
}
