#!/usr/bin/env node

const { execSync } = require('child_process');
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

console.log(`Building for environment: ${environment}`);

// Update environment configuration
const configPath = path.join(__dirname, '../src/config/environment.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// Replace the CURRENT_ENVIRONMENT line
const updatedConfig = configContent.replace(
  /const CURRENT_ENVIRONMENT: Environment = '[^']*';/,
  `const CURRENT_ENVIRONMENT: Environment = '${environment}';`
);

fs.writeFileSync(configPath, updatedConfig);

try {
  // Run the build
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log(`✅ Build completed successfully for ${environment} environment`);
  
  // Create build info file
  const buildInfo = {
    environment,
    buildTime: new Date().toISOString(),
    version: require('../package.json').version,
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../dist/build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}