/**
 * Centralized API configuration
 * Change URLs and endpoints in ONE place only
 */

export const API_BASE_URL = 'https://ecommerce.api.readils.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/auth/sign-in',
    REGISTER: '/v1/auth/register',
    REFRESH_TOKEN: '/v1/auth/refresh-access-token',
  },
  USER: {
    GET_SESSION: '/v1/user/get-user-session',
  },
  ROLES: {
    GET_ALL: '/v1/app-service/get-roles/',
  },
  CATEGORIES: {
    GET_ALL: '/v1/items/get-categories',
    ADD_CATEGORY: '/v1/items/add-category',
    DELETE_CATEGORY: (id: string) => `/v1/items/delete-category/${id}`,
    },
  FEATURES: {
    GET_ALL: '/v1/items/get-features',
    ADD_FEATURE: '/v1/items/add-feature',
    DELETE_FEATURE: (id: string) => `/v1/items/delete-feature/${id}`,
  },
  PURPOSES: {
    GET_ALL: '/v1/items/get-purposes',
    ADD_PURPOSE: '/v1/items/add-purpose',
    DELETE_PURPOSE: (id: string) => `/v1/items/delete-purpose/${id}`,
  },
    ITEMS: {
        GET_ALL: '/v1/items/get-items',
        GET_BY_ID: (id: string) => `/v1/items/get-item/${id}`,
        ADD_ITEM: '/v1/items/add-sales-product',
      UPLOAD_IMAGE: '/v1/items/upload-product-image',
        UPDATE_ITEM: '/v1/items/update-item',
        DELETE_ITEM: (id: string) => `/v1/items/delete-item/${id}`,
    }
} as const;

export const getFullApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
