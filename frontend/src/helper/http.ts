import { showNotification } from '@mantine/notifications';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ErrorCode } from '@/config/httpConfig/apis';
import axiosInstance from '@/config/httpConfig/axiosInstance';
import { findNotiConfig } from './notificationHelper';

const HttpConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const apiGet = <T>(url: string) =>
  new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (!navigator.onLine) {
      showNotification(findNotiConfig(ErrorCode.ERR_NETWORK));
      return reject(false);
    }

    return axiosInstance.get<T>(url, HttpConfig).then(resolve, reject);
  });

const apiPost = <T>(url: string, payload: any, config?: AxiosRequestConfig) =>
  new Promise<AxiosResponse<T>>((resolve, reject) => {
    if (!navigator.onLine) {
      showNotification(findNotiConfig(ErrorCode.ERR_NETWORK));
      return reject(false);
    }

    return axiosInstance.post<T>(url, payload, { ...HttpConfig, ...config }).then(resolve, reject);
  });

export const http = {
  get: apiGet,
  post: apiPost,
};
