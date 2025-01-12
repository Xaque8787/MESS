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
          dependentField: {
            ...input.dependentField,
            value: input.dependentField.isPassword && input.dependentField.value ? 
              MASKED_VALUE : input.dependentField.value
          }
        };
      }
      
      // Handle regular inputs
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
      return data;
    } catch (error) {
      console.error('Failed to get selections:', error);
      throw new Error('Failed to load selections');
    }
  },

  async saveSelections(data: { apps: DockerApp[] }) {
    try {
      // Create a deep copy to avoid modifying the original data
      const maskedData = {
        apps: maskSensitiveValues(JSON.parse(JSON.stringify(data.apps)))
      };
      await apiClient.post('/selections', maskedData);
    } catch (error) {
      console.error('Failed to save selections:', error);
      throw new Error('Failed to save selections');
    }
  }
};