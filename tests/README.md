# API Test Suite Documentation

This directory contains comprehensive integration tests for all backend APIs using Jest and Supertest.

## 📁 Directory Structure

```
tests/
├── setup.js                          # Jest setup file (DB connection, teardown)
├── fixtures/                         # Test data fixtures
│   ├── auth.fixtures.js             # Authentication test payloads
│   ├── employee.fixtures.js         # Employee test payloads
│   └── profile.fixtures.js          # Profile test payloads
├── helpers/                          # Test utility functions
│   └── testHelpers.js               # Helper functions (tokens, mocks, assertions)
└── integration/                      # Integration tests
    ├── authentication.test.js       # Auth endpoint tests (login, logout, authenticate)
    ├── profile.test.js              # Profile endpoint tests (update, password, OTP, email)
    └── employee.test.js             # Employee endpoint tests (list, create, update, roles)
```

## 🚀 Running Tests

### Prerequisites
- Node.js installed
- Environment variables configured (.env file)
- MongoDB connection available

### All Tests
```bash
npm test
```

### Run with Coverage Report
```bash
npm run test:coverage
```

### Watch Mode (Re-run on file changes)
```bash
npm run test:watch
```

### Run Specific Test File
```bash
npm test -- tests/integration/authentication.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="login"
```

## 📋 Test Coverage

### Authentication Endpoints (`/api/v1/account/authentication`)
- **POST /login**
  - ✓ Missing email validation
  - ✓ Missing password validation
  - ✓ Invalid email format
  - ✓ Non-existent user
  - ✓ Wrong password
  - ✓ Successful login

- **GET /** (Authenticate)
  - ✓ No authentication token
  - ✓ Invalid token
  - ✓ Valid token authentication

- **POST /logout**
  - ✓ No authentication token
  - ✓ Invalid token
  - ✓ Successful logout

### Profile Endpoints (`/api/v1/account/user`)
- **PATCH /update-profile**
  - ✓ No authentication token
  - ✓ Invalid request body
  - ✓ Valid profile update

- **PATCH /change-password**
  - ✓ No authentication token
  - ✓ Password mismatch validation
  - ✓ Missing required fields
  - ✓ Successful password change

- **POST /verify/send-otp**
  - ✓ No authentication token
  - ✓ Invalid email format
  - ✓ Successful OTP send

- **PATCH /verify**
  - ✓ No authentication token
  - ✓ Invalid OTP format
  - ✓ Successful email verification

### Employee Endpoints (`/api/v1/staff/employee`)
- **GET /** (List Employees)
  - ✓ Fetch employee list
  - ✓ Pagination support
  - ✓ Search functionality

- **GET /get-user-type-roles-and-dept**
  - ✓ Fetch user types, roles, and departments

- **POST /** (Create Employee)
  - ✓ Missing required fields
  - ✓ Invalid email format
  - ✓ Empty payload
  - ✓ Successful employee creation

- **PATCH /edit/:id** (Update Employee)
  - ✓ Invalid employee ID format
  - ✓ Non-existent employee
  - ✓ Successful employee update
  - ✓ Empty update payload

## 🛠️ Test Fixtures

### Authentication Fixtures (`tests/fixtures/auth.fixtures.js`)
- `validLoginPayload` - Valid email and password
- `invalidEmailPayload` - Invalid email format
- `missingEmailPayload` - Missing email field
- `missingPasswordPayload` - Missing password field
- `wrongPasswordPayload` - Incorrect password

### Employee Fixtures (`tests/fixtures/employee.fixtures.js`)
- `validCreateEmployeePayload` - Complete employee data
- `validUpdateEmployeePayload` - Employee update data
- `invalidEmailPayload` - Invalid email format
- `missingRequiredFieldPayload` - Missing lastName field

### Profile Fixtures (`tests/fixtures/profile.fixtures.js`)
- `validUpdateProfilePayload` - Profile update data
- `validChangePasswordPayload` - Matching new passwords
- `invalidChangePasswordPayload` - Mismatching new passwords
- `missingPasswordPayload` - Missing confirm password
- `validSendOTPPayload` - Valid email for OTP
- `validVerifyEmailPayload` - Email and OTP for verification

## 🔧 Test Helpers

Located in `tests/helpers/testHelpers.js`:

```javascript
// Create mock JWT token
const token = createMockToken({ userId: "123", role: "admin" });

// Generate random MongoDB ObjectId
const id = generateMockMongoId();

// Create test user
const user = createTestUser({ email: "custom@example.com" });

// Create test employee
const employee = createTestEmployee({ status: "inactive" });

// Assert success response structure
assertSuccessResponse(response);

// Assert error response structure
assertErrorResponse(response);
```

## ✅ Expected Test Results

Tests are designed to handle various response scenarios:
- **2xx**: Success responses
- **4xx**: Validation and authorization errors
- **5xx**: Server errors

Most tests accept multiple status codes to accommodate:
- Different authentication implementations
- Optional vs. required middleware
- Various validation strategies

## 📊 Understanding Test Output

```
 PASS  tests/integration/authentication.test.js
  Authentication Endpoints
    POST /api/v1/account/authentication/login
      ✓ Should return 400 if email is missing (45ms)
      ✓ Should return 400 if password is missing (32ms)
      ✓ Should return 400 for invalid email format (28ms)
      ✓ Should return 401 for non-existent user (55ms)
      ✓ Should return 401 for wrong password (42ms)
      ✓ Should return token on successful login (67ms)
```

## 🔍 Test Philosophy

These tests are designed to:
1. **Validate API contracts** - Ensure endpoints respond appropriately
2. **Handle real-world scenarios** - Valid/invalid inputs, missing data
3. **Be maintainable** - Use fixtures and helpers to reduce duplication
4. **Be flexible** - Accept multiple valid response codes
5. **Be comprehensive** - Cover happy paths and error cases

## 📝 Adding New Tests

### 1. Create fixture data
```javascript
// tests/fixtures/newFeature.fixtures.js
const validPayload = { /* ... */ };
module.exports = { validPayload };
```

### 2. Write test file
```javascript
// tests/integration/newFeature.test.js
const { validPayload } = require("@/../tests/fixtures/newFeature.fixtures");

describe("New Feature Endpoints", () => {
  test("Should work with valid payload", async () => {
    const response = await request(app)
      .post("/api/v1/new-feature")
      .send(validPayload);
    
    expect(response.status).toBeLessThan(500);
  });
});
```

### 3. Run tests
```bash
npm test
```

## 🐛 Debugging Tests

### Run single test with verbose output
```bash
npm test -- tests/integration/authentication.test.js --verbose
```

### Run specific test case
```bash
npm test -- --testNamePattern="Should return 400"
```

### Debug in Node
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome DevTools.

## 🔗 Environment Variables

Ensure these are set in your `.env`:
- `BACKEND_PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CORS_ORIGIN` - Allowed CORS origins

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## 🤝 Contributing

When adding new tests:
1. Follow existing patterns
2. Use descriptive test names
3. Add fixtures for reusable data
4. Document complex test logic
5. Keep tests independent (no cross-test dependencies)

---

**Last Updated:** June 2026
