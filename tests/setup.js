// Global test setup and utilities
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set default test timeout
jest.setTimeout(30000);

// Global test lifecycle hooks
beforeAll(async () => {
  console.log('\n🚀 Starting E2E Test Suite...\n');
  console.log('Service URLs:');
  console.log(`  - Auth Service: ${process.env.AUTH_SERVICE_URL}`);
  console.log(`  - User Service: ${process.env.USER_SERVICE_URL}`);
  console.log(`  - Message Broker: ${process.env.MESSAGE_BROKER_SERVICE_URL}`);
  console.log(`  - Notification Service: ${process.env.NOTIFICATION_SERVICE_URL}\n`);
});

afterAll(async () => {
  console.log('\n✅ E2E Test Suite Complete!\n');
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
