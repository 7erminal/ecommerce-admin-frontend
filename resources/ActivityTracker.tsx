import React, { useEffect, useRef, useCallback, type ReactNode, useContext } from 'react';
// import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthContext from './providers/AuthContext';

const INACTIVITY_TIME_LIMIT = 15 * 60 * 1000; // 15 minutes

const ActivityTracker: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const { logout } = useAuth();
  const timerRef = useRef<number | undefined>(undefined);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext)

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(logoutUser, INACTIVITY_TIME_LIMIT);
  }, []);

  const logoutUser = () => {
    authContext?.logout();
    navigate("/auth/login");
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click'];
    const resetTimerHandler = () => resetTimer();

    events.forEach(event => {
      window.addEventListener(event, resetTimerHandler);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimerHandler);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);

  return <>{children}</>;
};

export default ActivityTracker;
