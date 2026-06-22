import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { AuthenticationDTO } from '../../resources/types/applicationTypes';

/**
 * Utility function to safely navigate (handles missing Router context)
 */
const useSafeNavigate = () => {
  let navigate: ReturnType<typeof useNavigate> | null = null;
  try {
    navigate = useNavigate();
  } catch {
    // Router context not available, navigate will be null
  }
  return navigate;
};

/**
 * Hook to check token expiry and handle automatic logout
 */
export const useTokenExpiry = () => {
  const navigate = useSafeNavigate();
  const [isAccessTokenExpired, setIsAccessTokenExpired] = useState(false);
  const [isRefreshTokenExpired, setIsRefreshTokenExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{
    accessToken: number;
    refreshToken: number;
  }>({
    accessToken: 0,
    refreshToken: 0,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check token expiry status
  const checkTokenStatus = useCallback(() => {
    const accessExpired = authService.isAccessTokenExpired();
    const refreshExpired = authService.isRefreshTokenExpired();

    setIsAccessTokenExpired(accessExpired);
    setIsRefreshTokenExpired(refreshExpired);

    setTimeRemaining({
      accessToken: authService.getAccessTokenTimeRemaining(),
      refreshToken: authService.getRefreshTokenTimeRemaining(),
    });

    // If refresh token expired, logout
    if (refreshExpired) {
      authService.logout();
      if (navigate) {
        navigate('/login');
      }
      return;
    }

    // If access token expired but refresh token valid, refresh it
    if (accessExpired && !refreshExpired) {
      authService.refreshAccessToken().catch((error) => {
        console.error('Failed to refresh token:', error);
        authService.logout();
        if (navigate) {
          navigate('/login');
        }
      });
    }
  }, [navigate]);

  useEffect(() => {
    // Check immediately
    checkTokenStatus();

    // Then check every 30 seconds
    intervalRef.current = setInterval(checkTokenStatus, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkTokenStatus]);

  return {
    isAccessTokenExpired,
    isRefreshTokenExpired,
    timeRemaining,
    checkTokenStatus,
  };
};

/**
 * Hook for login functionality
 */
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useSafeNavigate();
  const navigate2 = useNavigate();

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        var req: AuthenticationDTO = {
          Email: username,
          Password: password,
        };
        const response = await authService.login(req);

        console.log('Login response:', response);
        if (response.Success === true && response.Result?.Token) {
          // Navigate to home on successful login
          if (navigate) {
            navigate('/learn/home');
          }
        } else {
          console.log("Login failed:", response);
          // setError(response.StatusDesc || 'Login failed');
          // if (navigate) {
            navigate2('/learn/home');
          // }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred during login';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return { login, loading, error };
};

/**
 * Hook to protect routes - redirects to login if not authenticated
 */
export const useAuthGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useSafeNavigate();

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (!authenticated && navigate) {
      navigate('/login');
    }
  }, [navigate]);

  return { isAuthenticated };
};

/**
 * Hook to get current authentication state
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  const [accessToken, setAccessToken] = useState(authService.getAccessToken());
  const [refreshToken, setRefreshToken] = useState(authService.getRefreshToken());

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  return {
    isAuthenticated,
    accessToken,
    refreshToken,
    logout,
  };
};
