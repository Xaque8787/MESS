import axios from 'axios';
import { DockerApp, AppEnvironment } from '../types/types';

const API_URL = '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

  async initializeApps(data: { apps: DockerApp[], environment: AppEnvironment }) {
    try {
      const { data: response } = await apiClient.post('/initialize', data);
      return response;
    } catch (error) {
      console.error('Failed to initialize apps:', error);
      throw new Error('Failed to initialize applications');
    }
  }
};