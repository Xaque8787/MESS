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

    if (app.pendingRemoval) {
      // Remove app config on removal
      delete updatedEnv.apps[app.id];
    } else if (app.pendingInstall || app.pendingUpdate) {
      const config = {};
      
      // Process inputs into config
      app.inputs?.forEach(input => {
        if (input.type === 'conditional-text' && input.dependentField) {
          if (input.value) {
            // Handle main input value
            config[input.title] = input.quoteValue ? `"${input.value}"` : input.value;
            // Handle dependent field value
            const dependentValue = input.dependentField.value;
            config[input.dependentField.title] = input.dependentField.quoteValue 
              ? `"${dependentValue}"` 
              : dependentValue;
          }
        } else if (input.value !== undefined) {
          // Handle regular input value
          config[input.title] = input.quoteValue ? `"${input.value}"` : input.value;
        }
      });

      updatedEnv.apps[app.id] = {
        initialized: true,
        config: app.id === 'first_run_up' || app.id === 'first_run_down' ? {} : config
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