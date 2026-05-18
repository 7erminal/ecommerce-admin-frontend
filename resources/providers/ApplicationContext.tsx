import { createContext } from 'react';
import type { ApplicationContextProps } from '../types/applicationTypes';

const ApplicationContext = createContext<ApplicationContextProps | undefined>(undefined);

export default ApplicationContext;