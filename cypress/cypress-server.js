/* eslint-disable import/no-extraneous-dependencies, no-console */
const { execSync } = require('child_process');
const { post } = require('request');

function execSetup(baseUrl) {
  console.log('Running setup...');

  const setupData = {
    name: 'Example Admin',
    email: 'admin@redash.io',
    password: 'password',
    org_name: 'Redash',
  };

  post(baseUrl + '/setup', { formData: setupData });
}

function startServer() {
  console.log('Starting the server...');
  execSync('docker-compose -p cypress up -d', { stdio: 'inherit' });
  execSync('docker-compose -p cypress run server create_db', { stdio: 'inherit' });
}

function stopServer() {
  console.log('Stopping the server...');
  execSync('docker-compose -p cypress down', { stdio: 'inherit' });
}

const command = process.argv[2];
const baseUrl = process.argv[3];

switch (command) {
  case 'start':
    startServer();
    execSetup('http://localhost:5000');
    break;
  case 'start-ci':
    startServer();
    break;
  case 'setup':
    execSetup(baseUrl);
    break;
  case 'stop':
    stopServer();
    break;
  default:
    console.log('Usage: npm run cypress:server start|stop');
    break;
}
