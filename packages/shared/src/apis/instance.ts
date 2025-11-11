import axios, { AxiosInstance } from 'axios';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

const createAxiosInstance = (baseURL: string, headers: { [key: string]: string }): AxiosInstance => {
  return axios.create({
    baseURL,
    headers: {
      ...headers,
    },
  });
};

const configureRequestInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(requestInterceptor);
};

const configureResponseInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(successInterceptor, errorInterceptor);
};

const createApiInstance = (
  baseURL: string,
  headers: { [key: string]: string },
  options: {
    useRequestInterceptors?: boolean;
    useResponseInterceptors?: boolean;
  } = { useRequestInterceptors: false, useResponseInterceptors: false },
): AxiosInstance => {
  const instance = createAxiosInstance(baseURL, headers);

  if (options.useRequestInterceptors) {
    configureRequestInterceptors(instance);
  }

  if (options.useResponseInterceptors) {
    configureResponseInterceptors(instance);
  }

  return instance;
};

export const publicApiInstance = createApiInstance(
  BASE_URL,
  {
    'Content-Type': 'application/json',
  },
  { useResponseInterceptors: true },
);

export const privateApiInstance = createApiInstance(
  BASE_URL,
  {
    'Content-Type': 'application/json',
  },
  { useRequestInterceptors: true, useResponseInterceptors: true },
);

export const formDataApiInstance = createApiInstance(
  BASE_URL,
  {
    'Content-Type': 'multipart/form-data',
  },
  { useRequestInterceptors: true, useResponseInterceptors: true },
);