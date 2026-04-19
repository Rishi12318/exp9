import axios from 'axios';
import { getAuthHeader } from './auth';

const apiClient = axios.create({
  baseURL: '/'
});

apiClient.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();

  if (authHeader) {
    config.headers.Authorization = authHeader;
  }

  return config;
});

export default apiClient;
