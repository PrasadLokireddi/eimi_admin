// Environment configuration
export type Environment = 'DEV' | 'STAGE' | 'PROD';

export interface EnvironmentConfig {
  environment: Environment;
  apiUrl: string;
  appName: string;
  version: string;
}

// Default environment - change this to switch environments
const CURRENT_ENVIRONMENT: Environment = 'DEV';

const environments: Record<Environment, EnvironmentConfig> = {
  DEV: {
    environment: 'DEV',
    apiUrl: 'https://dev-api.eimibuyorsell.com/api/',
    appName: 'EIMI Admin',
    version: '1.0.0-dev'
  },
  STAGE: {
    environment: 'STAGE',
    apiUrl: 'https://staging-api.example.com',
    appName: 'EIMI Admin (Staging)',
    version: '1.0.0-stage'
  },
  PROD: {
    environment: 'PROD',
    apiUrl: 'https://api.example.com',
    appName: 'EIMI Admin',
    version: '1.0.0'
  }
};

export const config = environments[CURRENT_ENVIRONMENT];

// Sample credentials for each environment
export const sampleCredentials = {
  DEV: {
    email: 'dev@admin.com',
    password: 'dev123'
  },
  STAGE: {
    email: 'stage@admin.com',
    password: 'stage123'
  },
  PROD: {
    email: 'admin@company.com',
    password: 'admin123'
  }
};

export default config;