import { DockerApp } from '../../types/types';
import { apiClient } from './config';

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
      await apiClient.post('/selections', data);
    } catch (error) {
      console.error('Failed to save selections:', error);
      throw new Error('Failed to save selections');
    }
  }
};