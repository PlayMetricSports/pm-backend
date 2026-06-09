/**
 * Test utility helpers
 */

/**
 * Create a mock JWT token for testing
 * @param {Object} payload - The token payload
 * @returns {string} Mock JWT token
 */
const createMockToken = (payload = {}) => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const body = Buffer.from(JSON.stringify({
    userId: "test-user-123",
    email: "test@example.com",
    role: "user",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...payload
  })).toString("base64");
  const signature = "mock-signature";
  
  return `${header}.${body}.${signature}`;
};

/**
 * Generate a random MongoDB ObjectId
 * @returns {string} Valid MongoDB ObjectId
 */
const generateMockMongoId = () => {
  return "507f1f77bcf86cd799439" + Math.random().toString().substring(2, 12);
};

/**
 * Create test user data
 * @param {Object} overrides - Override default values
 * @returns {Object} Test user object
 */
const createTestUser = (overrides = {}) => {
  return {
    _id: generateMockMongoId(),
    email: "testuser@example.com",
    firstName: "Test",
    lastName: "User",
    password: "hashedPassword123",
    userType: "user",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
};

/**
 * Create test employee data
 * @param {Object} overrides - Override default values
 * @returns {Object} Test employee object
 */
const createTestEmployee = (overrides = {}) => {
  return {
    _id: generateMockMongoId(),
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    userType: "employee",
    departmentId: generateMockMongoId(),
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
};

/**
 * Assert response structure for success
 * @param {Object} response - Express response object
 */
const assertSuccessResponse = (response) => {
  expect(response.body).toHaveProperty("success", true);
  expect(response.body).toHaveProperty("code");
  expect(response.body).toHaveProperty("message");
  if (response.body.data !== undefined) {
    expect(response.body).toHaveProperty("data");
  }
};

/**
 * Assert response structure for error
 * @param {Object} response - Express response object
 */
const assertErrorResponse = (response) => {
  expect(response.body).toHaveProperty("success", false);
  expect(response.body).toHaveProperty("code");
  expect(response.body).toHaveProperty("error");
  expect(Array.isArray(response.body.error) || typeof response.body.error === "object").toBe(true);
};

module.exports = {
  createMockToken,
  generateMockMongoId,
  createTestUser,
  createTestEmployee,
  assertSuccessResponse,
  assertErrorResponse
};
