# API Testing Quick Start Guide

## 📋 Overview

This guide helps you get started with the comprehensive API test suite for the PlayMetrics backend.

## 🔧 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required for tests to run:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `BACKEND_PORT` - Server port

### 3. Start MongoDB (if using locally)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally and start it
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test Suite
```bash
# Authentication tests
npm test -- tests/integration/authentication.test.js

# Profile tests
npm test -- tests/integration/profile.test.js

# Employee tests
npm test -- tests/integration/employee.test.js
```

### Run Tests Matching a Pattern
```bash
# Run only login-related tests
npm test -- --testNamePattern="login"

# Run only error-related tests
npm test -- --testNamePattern="error|invalid|missing"
```

## 📊 Test Output

### Success Example
```
 PASS  tests/integration/authentication.test.js (1.234s)
  Authentication Endpoints
    POST /api/v1/account/authentication/login
      ✓ Should return 400 if email is missing (45ms)
      ✓ Should return token on successful login (67ms)
    GET /api/v1/account/authentication
      ✓ Should authenticate user with valid token (32ms)
```

### Expected Test Results
- ✓ Tests should pass when API endpoints respond correctly
- ✗ Tests may fail if:
  - Database connection is not configured
  - MongoDB is not running
  - Endpoints are not implemented yet
  - Validation logic differs from test expectations

## 📁 Test Structure

```
tests/
├── setup.js                    # Jest configuration & DB setup
├── fixtures/                   # Test data
│   ├── auth.fixtures.js
│   ├── employee.fixtures.js
│   └── profile.fixtures.js
├── helpers/                    # Utility functions
│   └── testHelpers.js
├── integration/                # API integration tests
│   ├── authentication.test.js
│   ├── profile.test.js
│   └── employee.test.js
└── README.md                   # Detailed documentation
```

## 🎯 Test Coverage

The test suite covers:
- ✅ Authentication (login, logout, persistence)
- ✅ User Profile (update, password change, email verification)
- ✅ Employee Management (list, create, update)
- ✅ Input Validation (email, required fields, formats)
- ✅ Authentication & Authorization
- ✅ Error Handling

## 🔍 Debugging

### View Test Details
```bash
npm test -- --verbose
```

### Run Single Test
```bash
npm test -- --testNamePattern="Should return 400 if email is missing"
```

### Debug in VS Code
1. Add breakpoint in test file
2. Run: `npm test -- --runInBand tests/integration/authentication.test.js`
3. Attach VS Code debugger

## 📚 Documentation

- **Full Test Documentation**: See `tests/README.md`
- **Jest Documentation**: https://jestjs.io/
- **Supertest Documentation**: https://github.com/visionmedia/supertest

## 🆘 Troubleshooting

### "MONGODB_URI is not defined in environment variables"
- **Solution**: Add `MONGODB_URI` to `.env` file
```bash
MONGODB_URI=mongodb://localhost:27017/pm-backend-test
```

### "MongoDB connection refused"
- **Solution**: Start MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Tests timeout
- **Solution**: Increase timeout in jest.config.js or individual tests
```javascript
jest.setTimeout(60000); // 60 second timeout
```

### Module not found errors
- **Solution**: Ensure module aliases are configured in `jest.config.js`
- Check that `moduleNameMapper` matches your project structure

## 💡 Tips

1. **Keep tests independent** - Each test should work standalone
2. **Use fixtures** - Reuse test data from `tests/fixtures/`
3. **Use helpers** - Utility functions in `tests/helpers/testHelpers.js`
4. **Watch mode** - Use `npm run test:watch` during development
5. **Coverage reports** - Use `npm run test:coverage` to find untested code

## 🤝 Contributing

To add new tests:
1. Create fixture data in appropriate file
2. Write integration test in `tests/integration/`
3. Follow existing patterns and naming conventions
4. Run full test suite before submitting: `npm test`

---

**For detailed test documentation, see:** `tests/README.md`
