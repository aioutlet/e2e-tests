// Utility functions for E2E tests
import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const MAILPIT_API_URL = process.env.MAILPIT_API_URL || 'http://localhost:8025/api/v1';

/**
 * Generate unique test email
 */
export function generateTestEmail() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `e2e-test-${timestamp}-${random}@example.com`;
}

/**
 * Generate test user data
 */
export function generateTestUser() {
  const email = generateTestEmail();
  return {
    email,
    password: 'Test@123456',
    firstName: 'TestUser',
    lastName: 'AutoTest',
  };
}

/**
 * Register a new user via auth-service
 */
export async function registerUser(userData) {
  const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/register`, userData);
  return response.data;
}

/**
 * Login user via auth-service
 */
export async function loginUser(email, password) {
  const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
}

/**
 * Get user by email via user-service
 */
export async function getUserByEmail(email, token) {
  const response = await axios.get(`${USER_SERVICE_URL}/api/users/findByEmail?email=${encodeURIComponent(email)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

/**
 * Delete user via user-service
 */
export async function deleteUser(userId, token) {
  try {
    await axios.delete(`${USER_SERVICE_URL}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error('Failed to delete user:', error.message);
    return false;
  }
}

/**
 * Get emails from Mailpit
 */
export async function getEmails(recipientEmail = null) {
  try {
    const response = await axios.get(`${MAILPIT_API_URL}/messages`);
    const messages = response.data.messages || [];

    if (recipientEmail) {
      return messages.filter((msg) => msg.To?.some((to) => to.Address === recipientEmail));
    }

    return messages;
  } catch (error) {
    console.error('Failed to get emails from Mailpit:', error.message);
    return [];
  }
}

/**
 * Get email by subject
 */
export async function getEmailBySubject(subject, recipientEmail = null) {
  const emails = await getEmails(recipientEmail);
  return emails.find((email) => email.Subject?.includes(subject));
}

/**
 * Clear all emails from Mailpit
 */
export async function clearEmails() {
  try {
    await axios.delete(`${MAILPIT_API_URL}/messages`);
    return true;
  } catch (error) {
    console.error('Failed to clear emails:', error.message);
    return false;
  }
}

/**
 * Wait for condition with timeout
 */
export async function waitFor(conditionFn, options = {}) {
  const { timeout = 10000, interval = 500, timeoutMessage = 'Condition not met within timeout' } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await conditionFn();
      if (result) {
        return result;
      }
    } catch (error) {
      // Continue waiting
    }
    await sleep(interval);
  }

  throw new Error(timeoutMessage);
}

/**
 * Sleep utility
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if service is healthy
 */
export async function checkServiceHealth(serviceUrl) {
  try {
    const response = await axios.get(`${serviceUrl}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Wait for all services to be ready
 */
export async function waitForServices() {
  const services = [
    { name: 'Auth Service', url: AUTH_SERVICE_URL },
    { name: 'User Service', url: USER_SERVICE_URL },
  ];

  console.log('Waiting for services to be ready...');

  for (const service of services) {
    console.log(`  Checking ${service.name}...`);
    await waitFor(async () => checkServiceHealth(service.url), {
      timeout: 60000,
      interval: 2000,
      timeoutMessage: `${service.name} did not become ready`,
    });
    console.log(`  ✓ ${service.name} is ready`);
  }

  console.log('All services ready!\n');
}
