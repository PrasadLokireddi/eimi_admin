#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get environment from command line argument
const environment = process.argv[2] || 'DEV';

// Validate environment
const validEnvironments = ['DEV', 'STAGE', 'PROD'];
if (!validEnvironments.includes(environment)) {
  console.error(`Invalid environment: ${environment}`);
  console.error(`Valid environments: ${validEnvironments.join(', ')}`);
  process.exit(1);
}

console.log(`Starting development server for environment: ${environment}`);

// Update environment configuration
const configPath = path.join(__dirname, '../src/config/environment.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// Replace the CURRENT_ENVIRONMENT line
const updatedConfig = configContent.replace(
  /const CURRENT_ENVIRONMENT: Environment = '[^']*';/,
  `const CURRENT_ENVIRONMENT: Environment = '${environment}';`
);

fs.writeFileSync(configPath, updatedConfig);

// Start the development server
console.log('Starting development server...');
const devServer = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });

devServer.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
});