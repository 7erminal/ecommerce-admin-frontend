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
    GET_ALL: '/v1/user',
    ADD_USER: '/v1/user/',
    UPDATE_USER: (id: string) => `/v1/user/${id}`,
    DELETE_USER: (id: string) => `/v1/user/${id}`,
  },
  ROLES: {
    GET_ALL: '/v1/app-service/get-roles/',
  },
  ID_TYPES: {
    GET_ALL: '/v1/app-service/get-id-types',
  },
  CATEGORIES: {
    GET_ALL: '/v1/items/get-categories',
    ADD_CATEGORY: '/v1/items/add-category',
    DELETE_CATEGORY: (id: string) => `/v1/items/delete-category/${id}`,
    UPDATE_CATEGORY: (id: string) => `/v1/items/update-category/${id}`,
    },
  APPLICATIONS: {
    GET_BY_ID: (code: string) => `/v1/app-service/get-application/${code}`,
    GET_ALL: '/v1/app-service/get-applications',
    GET_SHOPS: '/v1/app-service/get-application-shops',
    ADD_APPLICATION: '/v1/app-service/add-application',
    DELETE_APPLICATION: (id: string) => `/v1/app-service/delete-application/${id}`,
    UPDATE_APPLICATION: (id: string) => `/v1/app-service/update-application/${id}`,
    UPDATE_THEME: (id: string) => `/v1/app-service/update-application-theme/${id}`,
    ADD_SHOP: '/v1/app-service/application/add-shop',
    REMOVE_SHOP: '/v1/app-service/application/remove-shop',
  },
  SHOPS: {
    GET_ALL: '/v1/app-service/get-shops',
    GET_BY_ID: (id: string) => `/v1/app-service/get-shop/${id}`,
    ADD_SHOP: '/v1/app-service/add-shop',
    UPDATE_SHOP: '/v1/app-service/update-shop',
    DELETE_SHOP: '/v1/app-service/delete-shop',
  },
  BRANCHES: {
    GET_ALL: '/v1/app-service/get-branches',
    ADD_BRANCH: '/v1/app-service/add-branch',
    UPDATE_BRANCH: (id: string) => `/v1/app-service/update-branch/${id}`,
    DELETE_BRANCH: (id: string) => `/v1/app-service/delete-branch/${id}`,
  },
  SHOP_BRANCHES: {
    ADD_BRANCH: '/v1/app-service/shop/add-branch',
    REMOVE_BRANCH: '/v1/app-service/shop/remove-branch',
  },
  THEMES: {
    GET_BY_ID: (id: string) => `/v1/app-service/fetch-theme/${id}`,
    GET_ALL: '/v1/app-service/fetch-themes',
    ADD_THEME: '/v1/app-service/add-theme',
    ADD_THEME_CONFIG: (id: string) => `/v1/app-service/add-theme-config/${id}`,
    REMOVE_THEME: (id: string) => `/v1/app-service/remove-theme/${id}`,
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
        UPDATE_ITEM: (id: string) => `/v1/items/update-product/${id}`,
        DELETE_ITEM: (id: string) => `/v1/items/delete-item/${id}`,
    },
    ORDERS: {
        GET_ALL: '/v1/transactions/get-orders',
        GET_BY_ID: (id: string) => `/v1/transactions/get-order/${id}`,
        ADD_ORDER: '/v1/transactions/place-order-request',
    },
    CUSTOMERS: {
        GET_ALL: '/v1/customers',
        GET_BY_ID: (id: string) => `/v1/customers/${id}`,
        ADD_CUSTOMER: '/v1/customers/',
    },
  SYSTEM_CONFIGS: {
    GET_ALL: (id: string) => `/v1/app-service/get-system-details/${id}`,
    UPLOAD_IMAGE: '/v1/app-service/upload-system-image',
  },
} as const;

export const getFullApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
