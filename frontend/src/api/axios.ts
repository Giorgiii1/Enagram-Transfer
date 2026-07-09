import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL: string = 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
