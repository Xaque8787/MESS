import axios from 'axios';
import { DockerApp, AppEnvironment } from '../types/types';

const API_URL = '/api';

export const api = {
  async getSelections() {
    const { data } = await axios.get(`${API_URL}/selections`);
    return data;
  },

  async saveSelections(data: { apps: DockerApp[] }) {
    await axios.post(`${API_URL}/selections`, data);
  },

  async initializeApps(data: { apps: DockerApp[], environment: AppEnvironment }) {
    const { data: response } = await axios.post(`${API_URL}/initialize`, data);
    return response;
  }
};