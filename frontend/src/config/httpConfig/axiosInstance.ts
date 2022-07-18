import axios, { AxiosRequestConfig } from 'axios';

const httpConfig: AxiosRequestConfig = {
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URI,
  timeout: 10000,
};

const axiosInstance = axios.create(httpConfig);

export default axiosInstance;
