// Script to wait for services to be ready before running tests
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 2000;

async function checkService(serviceUrl, serviceName) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await axios.get(`${serviceUrl}/health`, { timeout: 5000 });
      if (response.status === 200) {
        console.log(`✓ ${serviceName} is ready`);
        return true;
      }
    } catch (error) {
      console.log(`⏳ Waiting for ${serviceName}... (attempt ${i + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }

  console.error(`✗ ${serviceName} failed to become ready after ${MAX_RETRIES} attempts`);
  return false;
}

async function waitForServices() {
  console.log('\n🚀 Waiting for services to be ready...\n');

  const services = [
    { url: AUTH_SERVICE_URL, name: 'Auth Service' },
    { url: USER_SERVICE_URL, name: 'User Service' },
  ];

  for (const service of services) {
    const isReady = await checkService(service.url, service.name);
    if (!isReady) {
      process.exit(1);
    }
  }

  console.log('\n✅ All services are ready!\n');
}

waitForServices().catch((error) => {
  console.error('Error waiting for services:', error);
  process.exit(1);
});
