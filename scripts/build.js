import { execSync } from 'child_process';

const env = process.argv[2] || 'DEV';

console.log(`\nBuilding for environment: ${env}\n`);

let mode;
switch (env.toUpperCase()) {
  case 'DEV':
    mode = 'development';
    break;
  case 'STAGE':
    mode = 'staging';
    break;
  case 'PROD':
    mode = 'production';
    break;
  default:
    console.error('Unknown environment! Use DEV, STAGE, or PROD.');
    process.exit(1);
}

try {
  execSync(`npm run build -- --mode ${mode}`, { stdio: 'inherit' });
  console.log(`\nBuild for ${env} completed successfully!\n`);
} catch (error) {
  console.error(`\nBuild for ${env} failed.\n`);
  process.exit(1);
}