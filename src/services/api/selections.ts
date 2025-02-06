import { DockerApp } from '../../types/types';
import { apiClient } from './config';

const MASKED_VALUE = '********';

function maskSensitiveValues(apps: DockerApp[]): DockerApp[] {
  return apps.map(app => ({
    ...app,
    inputs: app.inputs?.map(input => {
      if (input.type === 'conditional-text' && input.dependentField) {
        return {
          ...input,
          value: input.value,
          dependentField: input.dependentField.map(field => ({
            ...field,
            value: field.isPassword && field.value ? 
              MASKED_VALUE : field.value
          }))
        };
      }
      
      return {
        ...input,
        value: input.isPassword && input.value ? 
          MASKED_VALUE : input.value
      };
    })
  }));
}

export const selectionsApi = {
  async getSelections() {
    try {
      const { data } = await apiClient.get('/selections');

      // Filter out run scripts from the response
      if (data.apps) {
        data.apps = data.apps.filter(
          app => app.id !== 'run_up' && app.id !== 'run_down'
        );
      }

      return data;
    } catch (error) {
      console.error('Failed to get selections:', error);
      throw new Error('Failed to load selections');
    }
  },

  async saveSelections(data: { apps: DockerApp[] }) {
    try {
      // Filter out run scripts before saving
      const filteredApps = data.apps.filter(
        app => app.id !== 'run_up' && app.id !== 'run_down'
      );

      const maskedData = {
        apps: maskSensitiveValues(JSON.parse(JSON.stringify(filteredApps)))
      };

      await apiClient.post('/selections', maskedData);
    } catch (error) {
      console.error('Failed to save selections:', error);
      throw new Error('Failed to save selections');
    }
  }
};
