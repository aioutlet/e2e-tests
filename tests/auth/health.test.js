// E2E Test: Auth Service Health Checks
// Tests operational endpoints

import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

describe('Auth Service Health Checks', () => {
  it('should return healthy status from /health endpoint', async () => {
    const response = await axios.get(`${AUTH_SERVICE_URL}/health`);

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.status).toBe('healthy');
    expect(response.data.service).toBeDefined();
    expect(response.data.version).toBeDefined();
    expect(response.data.timestamp).toBeDefined();

    console.log('✅ Health check passed');
    console.log(`   Service: ${response.data.service}`);
    console.log(`   Version: ${response.data.version}`);
  });

  it('should return ready status from /health/ready endpoint', async () => {
    const response = await axios.get(`${AUTH_SERVICE_URL}/health/ready`);

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.status).toBe('ready');
    expect(response.data.checks).toBeDefined();
    expect(response.data.checks.database).toBeDefined();
    expect(response.data.checks.externalServices).toBeDefined();

    console.log('✅ Readiness check passed');
    console.log(`   Database: ${response.data.checks.database.status}`);
  });

  it('should return alive status from /health/live endpoint', async () => {
    const response = await axios.get(`${AUTH_SERVICE_URL}/health/live`);

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.status).toBe('alive');
    expect(response.data.uptime).toBeGreaterThan(0);

    console.log('✅ Liveness check passed');
    console.log(`   Uptime: ${response.data.uptime}s`);
  });

  it('should return metrics from /metrics endpoint', async () => {
    const response = await axios.get(`${AUTH_SERVICE_URL}/metrics`);

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.uptime).toBeDefined();
    expect(response.data.memory).toBeDefined();
    expect(response.data.process).toBeDefined();

    console.log('✅ Metrics endpoint working');
    console.log(`   Heap Used: ${response.data.memory.heapUsedMB}MB`);
    console.log(`   Memory Status: ${response.data.memory.status}`);
  });
});
