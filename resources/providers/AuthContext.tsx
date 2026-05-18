import { createContext } from 'react';
import type { AuthContextProps } from '../types/applicationTypes';

// Create a context with a default value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;