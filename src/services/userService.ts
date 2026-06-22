/**
 * User Service - handles all user-related API calls
 * Centralized user profile, session, and authentication user data fetching
 */

import Api from '../../resources/apis';
import { API_ENDPOINTS } from '../config/api.config';
import type { UserGatewayResponseDTO } from '../../resources/types/applicationTypes';

class UserService {
  /**
   * Fetch user session details from backend using access token
   * Called after login/register and after token refresh
   */
  async fetchUserSession(): Promise<UserGatewayResponseDTO> {
    const response = await Api.POST_<UserGatewayResponseDTO>(API_ENDPOINTS.USER.GET_SESSION);
    return response.data;
  }
}

export const userService = new UserService();
