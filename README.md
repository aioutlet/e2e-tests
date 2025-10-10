# E2E Tests for AIOutlet Platform

End-to-end integration tests for the AIOutlet microservices platform. These tests verify complete user workflows across multiple services.

## Overview

This test suite validates:

- ✅ User registration workflow (auth → user → notification)
- ✅ User login workflow (authentication)
- ✅ Service health checks
- ✅ Email delivery (via Mailpit)
- ✅ Database persistence
- ✅ Event-driven communication (message broker)

## Prerequisites

### Required Services Running

The following services must be running before executing E2E tests:

1. **Auth Service** - `http://localhost:3001`
2. **User Service** - `http://localhost:3002`
3. **Message Broker Service** - `http://localhost:4000`
4. **Notification Service** - `http://localhost:3003`
5. **Mailpit** - `http://localhost:8025` (for email testing)

### Databases

- MongoDB (for auth-service and user-service)
- RabbitMQ (for message broker)
- PostgreSQL (for notification-service)

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your service URLs if different
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Run only auth tests
npm run test:auth

# Run only user tests
npm run test:user

# Run only workflow tests
npm run test:workflow

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.js                          # Global test setup
├── helpers/
│   └── testUtils.js                  # Shared utilities
├── auth/
│   └── health.test.js                # Auth service health checks
├── workflows/
│   ├── user-registration.test.js     # Complete registration workflow
│   └── user-login.test.js            # Complete login workflow
└── user/
    └── (future user-service tests)
```

## Test Workflow: User Registration

The user registration E2E test validates the complete flow:

1. **Register User** (auth-service)

   - POST `/api/auth/register`
   - Creates user session
   - Returns JWT token

2. **Create User Record** (user-service)

   - Auth-service calls user-service
   - User record created in MongoDB
   - Returns user details

3. **Publish Event** (message-broker)

   - Auth-service publishes `auth.user.registered` event
   - Event queued in RabbitMQ

4. **Send Welcome Email** (notification-service)

   - Consumes registration event
   - Sends welcome email via SMTP
   - Email captured by Mailpit

5. **Verify Email Delivery**
   - Query Mailpit API
   - Confirm email received
   - Validate email content

## Environment Variables

| Variable                     | Description              | Default                        |
| ---------------------------- | ------------------------ | ------------------------------ |
| `AUTH_SERVICE_URL`           | Auth service URL         | `http://localhost:3001`        |
| `USER_SERVICE_URL`           | User service URL         | `http://localhost:3002`        |
| `MESSAGE_BROKER_SERVICE_URL` | Message broker URL       | `http://localhost:4000`        |
| `NOTIFICATION_SERVICE_URL`   | Notification service URL | `http://localhost:3003`        |
| `MAILPIT_API_URL`            | Mailpit API URL          | `http://localhost:8025/api/v1` |
| `TEST_TIMEOUT`               | Test timeout (ms)        | `30000`                        |
| `CLEANUP_AFTER_TESTS`        | Clean up test data       | `true`                         |

## Test Data Cleanup

Tests automatically clean up created data:

- Test users are deleted after test completion
- Emails are cleared before each test suite
- Database state is preserved for debugging if tests fail

## Troubleshooting

### Services Not Ready

If tests fail with connection errors:

```bash
# Check service health manually
curl http://localhost:3001/health
curl http://localhost:3002/health

# View logs in respective service directories
```

### Email Not Received

If email tests fail:

```bash
# Check Mailpit UI
open http://localhost:8025

# Check notification service logs
```

## Future Test Coverage

Planned test additions:

- [ ] Password reset workflow
- [ ] Email verification workflow
- [ ] User profile updates
- [ ] Account deletion workflow
- [ ] Admin operations
- [ ] Performance/load tests
- [ ] Security tests

## Contributing

When adding new E2E tests:

1. Follow existing test structure
2. Use test utilities from `helpers/testUtils.js`
3. Clean up test data in `afterAll` hooks
4. Add descriptive console logs
5. Set appropriate timeouts
6. Handle errors gracefully

## License

MIT
