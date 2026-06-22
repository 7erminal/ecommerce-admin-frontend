import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '../src/config/api.config';
import { authService } from '../src/services/authService';

class Api {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach access token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = authService.getAccessToken();
        console.log("Access token fetched to add to send request ", accessToken)
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async POST_FORM_DATA<T = any>(endpoint: string, formData: FormData): Promise<AxiosResponse<T>> {
    try {
      console.log('POST_FORM_DATA url:', `${API_BASE_URL}${endpoint}`);
      console.log('POST_FORM_DATA payload:', formData);

      const response = await this.axiosInstance.post<T>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('POST_FORM_DATA Response:', response);
      return response;
    } catch (error) {
      console.error('POST_FORM_DATA Error occurred:', error);
      throw error;
    }
  }

  async POST_<T = any>(endpoint: string, params?: any): Promise<AxiosResponse<T>> {
    try {
      console.log('POST url:', `${API_BASE_URL}${endpoint}`);
      console.log('POST params:', params);

      const response = await this.axiosInstance.post<T>(endpoint, params);

      console.log('POST Response:', response);
      return response;
    } catch (error) {
      console.error('POST Error occurred:', error);
      throw error;
    }
  }

  async GET_<T = any>(endpoint: string): Promise<AxiosResponse<T>> {
    try {
      console.log('GET url:', `${API_BASE_URL}${endpoint}`);

      const response = await this.axiosInstance.get<T>(endpoint);

      console.log('GET Response:', response);
      return response;
    } catch (error) {
      console.error('GET Error occurred:', error);
      throw error;
    }
  }

  async PUT_<T = any>(endpoint: string, params?: any): Promise<AxiosResponse<T>> {
    try {
      console.log('PUT url:', `${API_BASE_URL}${endpoint}`);
      console.log('PUT params:', params);

      const response = await this.axiosInstance.put<T>(endpoint, params);

      console.log('PUT Response:', response);
      return response;
    } catch (error) {
      console.error('PUT Error occurred:', error);
      throw error;
    }
  }

  async DELETE<T = any>(endpoint: string, params?: any): Promise<AxiosResponse<T>> {
    try {
      console.log('DELETE url:', `${API_BASE_URL}${endpoint}`);
      console.log('DELETE params:', params);

      const response = await this.axiosInstance.delete<T>(endpoint, { data: params });

      console.log('DELETE Response:', response);
      return response;
    } catch (error) {
      console.error('DELETE Error occurred:', error);
      throw error;
    }
  }
}

export default new Api();
