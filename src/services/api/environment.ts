import { AppEnvironment } from '../../types/types';
import { apiClient } from './config';

export const environmentApi = {
  async getEnvironment() {
    try {
      const { data } = await apiClient.get('/environment');
      return data;
    } catch (error) {
      console.error('Failed to get environment:', error);
      throw new Error('Failed to load environment');
    }
  },

  async initializeApps(data: { apps: any[], environment: AppEnvironment }) {
    try {
      const { data: response } = await apiClient.post('/initialize', data);
      return response;
    } catch (error) {
      console.error('Failed to initialize apps:', error);
      throw new Error('Failed to initialize applications');
    }
  }
};