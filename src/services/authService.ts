import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import type {
  AuthenticationDTO,
  LoginTokenResponseDTO,
  RefreshTokenRequest,
  RegisterRequestDTO,
  StoredAuthUser,
} from '../../resources/types/applicationTypes';

// Token storage interface
interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number; // timestamp in milliseconds
  refreshTokenExpiresAt: number; // timestamp in milliseconds
  userType: string;
}

const TOKENS_STORAGE_KEY = 'auth_tokens';
const AUTH_USER_STORAGE_KEY = 'auth_user';
const AUTH_CHANGE_EVENT = 'auth-session-changed';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach access token
    this.api.interceptors.request.use(
      (config) => {
        const tokens = this.getStoredTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshAccessToken();
            const tokens = this.getStoredTokens();
            if (tokens?.accessToken) {
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Login with customer credentials
   */
  async login(credentials: AuthenticationDTO): Promise<LoginTokenResponseDTO> {
    try {
      console.log("Attempting login with:", credentials);
      const response = await this.api.post<LoginTokenResponseDTO>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log('Login API response:', response);
      if (response.data.Success == true && response.data.Result?.Token) {
        // Store tokens with expiry times
        console.log("Tokens response is ", response.data.Result.Token);
        const now = Date.now();
        const tokens: StoredTokens = {
          accessToken: response.data.Result.Token.AccessToken,
          refreshToken: response.data.Result.Token.RefreshToken,
          // Access token typically expires in 15 minutes (900 seconds)
          accessTokenExpiresAt: now + response.data.Result.Token.ExpiresIn * 1000,
          // Refresh token typically expires in 7 days
          refreshTokenExpiresAt: now + 7 * 24 * 60 * 60 * 1000,
          userType: response.data.Result.UserType,
        };
        this.storeTokens(tokens);
        this.dispatchAuthChange();
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register a customer
   */
  async register(credentials: RegisterRequestDTO): Promise<LoginTokenResponseDTO> {
    try {
      console.log("Registering user with data:", credentials);
      const response = await this.api.post<LoginTokenResponseDTO>(
        API_ENDPOINTS.AUTH.REGISTER,
        credentials
      );

      console.log("Registration API response:", response);

      if (response.data.Success == true && response.data.Result?.Token) {
        // Store tokens with expiry times
        const now = Date.now();
        const tokens: StoredTokens = {
          accessToken: response.data.Result.Token.AccessToken,
          refreshToken: response.data.Result.Token.RefreshToken,
          // Access token typically expires in 15 minutes (900 seconds)
          accessTokenExpiresAt: now + response.data.Result.Token.ExpiresIn * 1000,
          // Refresh token typically expires in 7 days
          refreshTokenExpiresAt: now + 7 * 24 * 60 * 60 * 1000,
          userType: response.data.Result.UserType,
        };
        this.storeTokens(tokens);
        this.dispatchAuthChange();
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshAccessToken(): Promise<LoginTokenResponseDTO> {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }
    console.log("Tokens fetched are ", tokens);
    console.log("Refreshing access token with refresh token:", tokens.refreshToken);

    try {
      const response = await this.api.post<LoginTokenResponseDTO>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { Value: tokens.refreshToken } as RefreshTokenRequest
      );

      console.log("Refresh token API response:", response);

      const now = Date.now();
      const updatedTokens: StoredTokens = {
        ...tokens,
        accessToken: response.data.Result.Token.AccessToken,
        refreshToken: response.data.Result.Token.RefreshToken,
        accessTokenExpiresAt: now + response.data.Result.Token.ExpiresIn * 1000,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt, // Keep existing refresh token expiry
      };
      this.storeTokens(updatedTokens);
      this.dispatchAuthChange();

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if access token has expired
   */
  isAccessTokenExpired(): boolean {
    const tokens = this.getStoredTokens();
    if (!tokens?.accessTokenExpiresAt) return true;

    const now = Date.now();
    // Consider token expired if it will expire in less than 1 minute
    return tokens.accessTokenExpiresAt - now < 60000;
  }

  /**
   * Check if refresh token has expired
   */
  isRefreshTokenExpired(): boolean {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshTokenExpiresAt) return true;

    const now = Date.now();
    console.log("About to return ", tokens.refreshTokenExpiresAt <= now);
    return tokens.refreshTokenExpiresAt <= now;
  }

  /**
   * Get time remaining until access token expires (in seconds)
   */
  getAccessTokenTimeRemaining(): number {
    const tokens = this.getStoredTokens();
    if (!tokens?.accessTokenExpiresAt) return 0;

    const now = Date.now();
    const remaining = Math.max(0, tokens.accessTokenExpiresAt - now);
    return Math.floor(remaining / 1000);
  }

  /**
   * Get time remaining until refresh token expires (in seconds)
   */
  getRefreshTokenTimeRemaining(): number {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshTokenExpiresAt) return 0;

    const now = Date.now();
    const remaining = Math.max(0, tokens.refreshTokenExpiresAt - now);
    return Math.floor(remaining / 1000);
  }

  /**
   * Logout user and clear tokens
   */
  logout(): void {
    localStorage.removeItem(TOKENS_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    this.dispatchAuthChange();
  }

  /**
   * Store the active user in local storage so the UI can hydrate memory state.
   */
  storeUser(user: StoredAuthUser | null): void {
    if (user) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
    this.dispatchAuthChange();
  }

  /**
   * Get the stored user payload.
   */
  getStoredUser(): StoredAuthUser | null {
    try {
      const userStr = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored auth user:', error);
      return null;
    }
  }

  /**
   * Get stored tokens
   */
  getStoredTokens(): StoredTokens | null {
    try {
      const tokensStr = localStorage.getItem(TOKENS_STORAGE_KEY);
      console.log("Tokens are ", tokensStr);
      return tokensStr ? JSON.parse(tokensStr) : null;
    } catch (error) {
      console.error('Error parsing stored tokens:', error);
      return null;
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.getStoredTokens()?.accessToken || null;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.getStoredTokens()?.refreshToken || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!tokens?.accessToken && !this.isRefreshTokenExpired();
  }

  /**
   * Store tokens in localStorage
   */
  private storeTokens(tokens: StoredTokens): void {
    console.log("Storing tokens:", tokens);
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
  }

  private dispatchAuthChange(): void {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }

  /**
   * Subscribe to auth state updates.
   */
  onAuthChange(listener: () => void): () => void {
    window.addEventListener(AUTH_CHANGE_EVENT, listener);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, listener);
  }
}

export const authService = new AuthService();
