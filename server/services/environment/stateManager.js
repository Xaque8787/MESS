export async function updateAppStates(apps, environment, service) {
  console.log('Updating app states:', { apps, environment });
  const currentEnv = await service.readEnvironment();
  const updatedEnv = {
    ...currentEnv,
    lastUpdated: new Date().toISOString(),
    apps: { ...currentEnv.apps }
  };

  // Check if this is the first run
  const isFirstRun = currentEnv.isFirstRun;

  // Process each app's state and config
  apps.forEach(app => {
    // Skip first run scripts if not first run
    if ((app.id === 'first_run_up' || app.id === 'first_run_down') && !isFirstRun) {
      return;
    }

    // Skip persisting run scripts entirely
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
          // Always store the main conditional input value if it exists
          if (input.value !== undefined) {
            config[input.title] = input.value;

            // If the conditional input is true, process all dependent fields
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
