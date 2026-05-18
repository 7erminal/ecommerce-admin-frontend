import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * Component to display token expiry information
 * Useful for debugging and showing user token status
 */
const TokenStatus: React.FC = () => {
  const [status, setStatus] = useState({
    isAuthenticated: false,
    accessTokenExpired: false,
    refreshTokenExpired: false,
    accessTokenTimeRemaining: 0,
    refreshTokenTimeRemaining: 0,
  });

  useEffect(() => {
    const updateStatus = () => {
      setStatus({
        isAuthenticated: authService.isAuthenticated(),
        accessTokenExpired: authService.isAccessTokenExpired(),
        refreshTokenExpired: authService.isRefreshTokenExpired(),
        accessTokenTimeRemaining: authService.getAccessTokenTimeRemaining(),
        refreshTokenTimeRemaining: authService.getRefreshTokenTimeRemaining(),
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm">
      <h3 className="font-semibold mb-2">Token Status</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Authenticated:</span>
          <span className={status.isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {status.isAuthenticated ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Access Token:</span>
          <span className={status.accessTokenExpired ? 'text-red-600' : 'text-green-600'}>
            {status.accessTokenExpired ? '✗ Expired' : `✓ Valid (${formatSeconds(status.accessTokenTimeRemaining)})`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Refresh Token:</span>
          <span className={status.refreshTokenExpired ? 'text-red-600' : 'text-green-600'}>
            {status.refreshTokenExpired ? '✗ Expired' : `✓ Valid (${formatSeconds(status.refreshTokenTimeRemaining)})`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenStatus;
