import axios from 'axios';
import { localStorageHelper, StorageKeys } from '../Common/localStorageHelper';
import { ENVIRONMENT } from '../Environment';

export const BASE_URL = ENVIRONMENT.baseUrl;

const axiosOptions = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

const axiosRawOptions = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const userAuthFetch = axios.create(axiosOptions);

export const userRawFetch = axios.create(axiosRawOptions);

// Adding headers to requests
userAuthFetch.interceptors.request.use(config =>
  localStorageHelper
    .getItemFromStorage(StorageKeys.ACCESS_TOKEN)
    .then(tokenResponse => {
      if (tokenResponse) {
        config.headers.authorization = `Bearer ${tokenResponse}`;
      }
      console.log(`API called: ${config.url}`);
      return Promise.resolve(config);
    }),
);

userRawFetch.interceptors.request.use(config =>
  localStorageHelper
    .getItemFromStorage(StorageKeys.ACCESS_TOKEN)
    .then(tokenResponse => {
      if (tokenResponse) {
        config.headers.authorization = `Bearer ${tokenResponse}`;
      }
      console.log(`API Raw called: ${config.url}`);
      return Promise.resolve(config);
    }),
);

export const extractData = r => r.data;
