import React, { type ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from './AuthContext';
import { authService } from '../../src/services/authService';
import { userService } from '../../src/services/userService';
import ApplicationContext from './ApplicationContext';
import type { LoginResponse, RegisterParams, RegisterResponse, StoredAuthUser, UserData } from '../types/applicationTypes';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentUser, setCurrentUser] = useState<StoredAuthUser | null>(authService.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [accessToken, setAccessToken] = useState<string | null>(authService.getAccessToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(authService.getRefreshToken());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const applicationContext = useContext(ApplicationContext);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUserSession = useCallback(async (userType?: string) => {
    try {
        console.log("Fetching user session with userType:", userType);
      const data = await userService.fetchUserSession();

      if (!data.Success || !data.Result) {
        return;
      }

      const token = authService.getAccessToken();
      const sessionUser: StoredAuthUser = {
        userId: String(data.Result.UserId),
        email: data.Result.Email,
        fullName: `${data.Result.FirstName} ${data.Result.LastName}`.trim(),
        username: data.Result.Username,
        phoneNumber: data.Result.PhoneNumber,
        role: data.Result.Role?.Role,
        userType,
      };

      authService.storeUser(sessionUser);
      setCurrentUser(sessionUser);

      setUser({
        id: String(data.Result.UserId),
        username: data.Result.Username,
        email: data.Result.Email,
        fullName: `${data.Result.FirstName} ${data.Result.LastName}`.trim(),
        phoneNumber: data.Result.PhoneNumber,
        role: data.Result.Role?.Role,
        status: data.Result.Status,
        token: token || '',
        resetPassword: undefined,
      });

      await applicationContext?.fetchSystemConfigs(data.Result.Customer?.Branch?.BranchId?.toString() || '');


    } catch (error) {
      console.error('Unable to fetch user session:', error);
    }
  }, []);

  useEffect(() => {
    const syncAuthState = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setCurrentUser(authService.getStoredUser());
      setAccessToken(authService.getAccessToken());
      setRefreshToken(authService.getRefreshToken());

      if (!authenticated) {
        setUser(null);
        setErrorMessage('');
      }
    };

    syncAuthState();
    const unsubscribe = authService.onAuthChange(syncAuthState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchUserSession(currentUser?.userType);
    }
  }, [isAuthenticated, currentUser?.userType, fetchUserSession]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    refreshIntervalRef.current = setInterval(() => {
      if (authService.isRefreshTokenExpired()) {
        logout();
        return;
      }

      if (authService.isAccessTokenExpired()) {
        void refreshSession();
      }
    }, 30000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated]);

  const login = async (email: string, userPassword: string): Promise<LoginResponse> => {
    try {
      setLoading(true);
      setErrorMessage('');

      console.log("Attempting login with:", { email, userPassword: '********' });
      const response = await authService.login({ Email: email, Password: userPassword });

      console.log('Login response:', response);
      if (!response.Success || !response.Result?.Token) {
        const statusDesc = response.StatusDesc || 'Login failed';
        setErrorMessage(statusDesc);
        return { Success: false, StatusDesc: statusDesc, Result: null };
      }

      const userType = response.Result.UserType;
      const storedUser: StoredAuthUser = {
        email,
        username: email,
        userType,
      };

      authService.storeUser(storedUser);
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
      setAccessToken(authService.getAccessToken());
      setRefreshToken(authService.getRefreshToken());

      await fetchUserSession(userType);

      return {
        Success: true,
        StatusDesc: response.StatusDesc || 'Login successful',
        Result: response.Result,
      };
    } catch (error: any) {
      const errorMsg = error?.response?.data?.StatusDesc || 'An error occurred during login';
      setErrorMessage(errorMsg);
      return { Success: false, StatusDesc: errorMsg, Result: null };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterParams): Promise<RegisterResponse> => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await authService.register({
        Email: data.Email,
        FirstName: data.FirstName,
        LastName: data.LastName,
        PhoneNumber: data.PhoneNumber,
        Password: data.Password,
        Dob: data.Dob,
        RoleId: data.RoleId,
      });

      console.log("Registration response is ")
      console.log(response)

      if (!response.Success || !response.Result?.Token) {
        const statusDesc = response.StatusDesc || 'Registration failed';
        setErrorMessage(statusDesc);
        return { Success: false, StatusDesc: statusDesc, Result: null };
      }

      const userType = response.Result.UserType;
      const storedUser: StoredAuthUser = {
        email: data.Email,
        username: data.Email,
        userType,
      };

      authService.storeUser(storedUser);
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
      setAccessToken(authService.getAccessToken());
      setRefreshToken(authService.getRefreshToken());

      await fetchUserSession(userType);

      return {
        Success: true,
        StatusDesc: response.StatusDesc || 'Registration successful',
        Result: response.Result,
      };
    } catch (error: any) {
      const errorMsg = error?.response?.data?.StatusDesc || 'An error occurred during registration';
      setErrorMessage(errorMsg);
      return { Success: false, StatusDesc: errorMsg, Result: null };
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      if (authService.isRefreshTokenExpired()) {
        console.log("Refresh token is expired, logging out");
        logout();
        return false;
      }

      const response = await authService.refreshAccessToken();

      if (!response.Success) {
        console.log("Failed to refresh access token, logging out");

        return false;
      }

      const latestAccessToken = authService.getAccessToken();
      const latestStoredUser = authService.getStoredUser();

      setIsAuthenticated(true);
      setAccessToken(latestAccessToken);
      setRefreshToken(authService.getRefreshToken());

      if (latestAccessToken) {
        await fetchUserSession(latestStoredUser?.userType);
      }

      return true;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    sessionStorage.clear();
    applicationContext?.clearAll();

    setIsAuthenticated(false);
    setCurrentUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        currentUser,
        accessToken,
        refreshToken,
        login,
        register,
        refreshSession,
        logout,
        loading,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
