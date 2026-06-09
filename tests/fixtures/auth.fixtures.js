/**
 * Test fixtures for authentication endpoints
 */

const validLoginPayload = {
  email: "test@example.com",
  password: "Test@123456"
};

const invalidEmailPayload = {
  email: "invalid-email",
  password: "password123"
};

const missingEmailPayload = {
  password: "password123"
};

const missingPasswordPayload = {
  email: "test@example.com"
};

const wrongPasswordPayload = {
  email: "test@example.com",
  password: "WrongPassword123"
};

module.exports = {
  validLoginPayload,
  invalidEmailPayload,
  missingEmailPayload,
  missingPasswordPayload,
  wrongPasswordPayload
};
